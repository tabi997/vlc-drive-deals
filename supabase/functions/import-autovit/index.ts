import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = [
    Deno.env.get("ALLOWED_ORIGIN"),
    "http://localhost:4173",
    "http://localhost:5173",
  ].filter(Boolean) as string[];

  const originHeader = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": originHeader,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

type AutovitImportPayload = {
  url: string;
  status?: string;
};

type AutovitAdvert = Record<string, unknown>;

type ParametersDict = Record<string, { values: Array<{ label: string; value: string }> } | undefined>;

type EquipmentGroup = {
  key: string;
  label: string;
  values: Array<{ key: string; label: string }>;
};

type DetailItem = {
  key: string;
  label: string;
  value: string | null;
  description?: string | null;
  group: string;
  href?: string | null;
  overviewOrder?: number | null;
};

const extractScriptPayload = (html: string) => {
  const scriptRegex = /<script id="__NEXT_DATA__" type="application\/json"[^>]*>(.*?)<\/script>/s;
  const match = html.match(scriptRegex);
  if (!match) {
    throw new Error("Nu am găsit payload-ul Autovit (__NEXT_DATA__).");
  }
  return JSON.parse(match[1]);
};

const normalizeNumber = (value: string | undefined | null) => {
  if (!value) return null;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const getParameterValue = (parametersDict: ParametersDict, key: string, field: "label" | "value" = "value") => {
  const entry = parametersDict?.[key];
  if (!entry?.values?.length) return null;
  return entry.values[0]?.[field] ?? null;
};

const normalizeMainFeatures = (advert: AutovitAdvert, parametersDict: ParametersDict) => {
  const features: Array<{ label: string; value: string }> = [];
  const year = getParameterValue(parametersDict, "year", "value");
  const mileage = getParameterValue(parametersDict, "mileage", "label");
  const engineCapacity = getParameterValue(parametersDict, "engine_capacity", "label");
  const fuel = getParameterValue(parametersDict, "fuel_type", "label");

  if (year) features.push({ label: "An fabricație", value: String(year) });
  if (mileage) features.push({ label: "Kilometraj", value: mileage });
  if (engineCapacity) features.push({ label: "Capacitate cilindrică", value: engineCapacity });
  if (fuel) features.push({ label: "Combustibil", value: fuel });

  const advertMainFeatures = (advert?.mainFeatures as string[] | undefined) ?? [];
  advertMainFeatures.forEach((value) => {
    if (!features.find((item) => item.value === value)) {
      features.push({ label: value, value });
    }
  });

  return features.length ? features : null;
};

const normalizeImages = (advert: AutovitAdvert) => {
  const photos = (advert?.images as { photos?: Array<{ url: string }> } | undefined)?.photos ?? [];
  return photos
    .map((photo: { url: string }) => ({
      url: photo.url,
    }))
    .filter((image) => Boolean(image.url));
};

const normalizeBadges = (advert: AutovitAdvert) => {
  const badges = (advert?.badges as Array<{ code: string; label: string }> | undefined) ?? [];
  return badges.map((badge) => ({ code: badge.code, label: badge.label }));
};

const normalizeEquipment = (equipment: EquipmentGroup[] | undefined) => {
  if (!equipment?.length) return null;
  return equipment.map((group) => ({
    key: group.key,
    label: group.label,
    items: group.values?.map((item) => item.label) ?? [],
  }));
};

const normalizeDetails = (details: DetailItem[] | undefined) => {
  if (!details?.length) return null;
  return details.map((detail) => ({
    key: detail.key,
    label: detail.label,
    value: detail.value ?? null,
    description: detail.description ?? null,
    group: detail.group ?? "other",
    href: detail.href ?? null,
    order: detail.overviewOrder ?? null,
  }));
};

const normalizeTechnicalSpecs = (details: DetailItem[] | undefined) => {
  const specs = details?.filter((detail) => detail.group === "technical_specs") ?? [];
  if (!specs.length) return null;
  return specs.map((detail) => ({
    label: detail.label,
    value: detail.value ?? "",
    category: detail.group,
    order: detail.overviewOrder ?? null,
  }));
};

const normalizeConsumption = (parametersDict: ParametersDict) => {
  const urban = getParameterValue(parametersDict, "urban_consumption", "label");
  const extraUrban = getParameterValue(parametersDict, "extra_urban_consumption", "label");
  const combined = getParameterValue(parametersDict, "combined_consumption", "label");

  if (!urban && !extraUrban && !combined) return null;

  return {
    urban: urban ?? null,
    extraUrban: extraUrban ?? null,
    combined: combined ?? null,
  };
};

const isValidAutovitUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    const allowedDomains = ["www.autovit.ro", "autovit.ro"];
    return allowedDomains.includes(url.hostname.toLowerCase()) && url.protocol === "https:";
  } catch {
    return false;
  }
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { url, status }: AutovitImportPayload = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL-ul Autovit este obligatoriu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidAutovitUrl(url)) {
      return new Response(JSON.stringify({ error: "URL-ul trebuie să fie de pe domeniul autovit.ro" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Autovit a răspuns cu status ${response.status}`);
    }

    const html = await response.text();
    const payload = extractScriptPayload(html);

    const advert: AutovitAdvert | undefined = payload?.props?.pageProps?.advert;
    if (!advert) {
      throw new Error("Nu am putut extrage anunțul din pagina Autovit.");
    }

    const autovitId = String((advert as any).id ?? (advert as any).advertId ?? Date.now());
    const parametersDict = (advert as any).parametersDict as ParametersDict;
    const images = normalizeImages(advert);
    const mainImage = images.length ? images[0].url : null;

    const record = {
      autovit_id: autovitId,
      slug: (advert as any).slug ?? null,
      status: status ?? (advert as any).status ?? "ACTIVE",
      title: (advert as any).title ?? "Anunț Autovit",
      subtitle: (advert as any).adFromAdCore?.subtitle ?? null,
      price_value: normalizeNumber((advert as any).price?.value) ?? null,
      price_currency: (advert as any).price?.currency ?? "EUR",
      price_old_value: normalizeNumber((advert as any).price?.oldPrice?.value ?? null),
      price_negotiable: Boolean((advert as any).price?.isNegotiable ?? false),
      price_labels: ((advert as any).price?.labels as Array<{ label: string }> | undefined)?.map((item) => item.label) ?? null,
      mileage_km: normalizeNumber(getParameterValue(parametersDict, "mileage", "value")),
      year: normalizeNumber(getParameterValue(parametersDict, "year", "value")),
      engine_capacity_cc: normalizeNumber(getParameterValue(parametersDict, "engine_capacity", "value")),
      engine_power_hp: normalizeNumber(getParameterValue(parametersDict, "engine_power", "value")),
      fuel_type: getParameterValue(parametersDict, "fuel_type", "label"),
      gearbox: getParameterValue(parametersDict, "gearbox", "label"),
      transmission: getParameterValue(parametersDict, "transmission", "label"),
      body_type: getParameterValue(parametersDict, "body_type", "label"),
      color: getParameterValue(parametersDict, "color", "label"),
      emission_class: getParameterValue(parametersDict, "emission_class", "label"),
      co2_emissions: getParameterValue(parametersDict, "co2_emissions", "label"),
      consumption: normalizeConsumption(parametersDict),
      vin: getParameterValue(parametersDict, "vin_number", "label"),
      first_registration: getParameterValue(parametersDict, "first_registration", "label"),
      technical_inspection: getParameterValue(parametersDict, "technical_inspection_valid_until", "label"),
      last_service: getParameterValue(parametersDict, "service_history", "label"),
      main_features: normalizeMainFeatures(advert, parametersDict),
      badges: normalizeBadges(advert),
      highlight_tags: normalizeBadges(advert).map((badge) => badge.label),
      images,
      main_image: mainImage,
      location_label: (advert as any).seller?.location?.shortAddress ?? null,
      description: (advert as any).description ?? null,
      details: normalizeDetails((advert as any).details as DetailItem[] | undefined),
      feature_groups: normalizeEquipment((advert as any).equipment as EquipmentGroup[] | undefined),
      technical_specs: normalizeTechnicalSpecs((advert as any).details as DetailItem[] | undefined),
      seller: (advert as any).seller ?? null,
      financing_options: (advert as any).valueAddedServices ?? null,
      payload: advert,
    };

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey =
      Deno.env.get("SERVICE_ROLE_KEY") ??
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase environment not configured");
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabaseClient
      .from("autovit_listings")
      .upsert(record, {
        onConflict: "autovit_id",
      });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "Anunț importat cu succes",
        autovit_id: autovitId,
        status: record.status,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Importul a eșuat";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
