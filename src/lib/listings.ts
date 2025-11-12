import { supabase, hasSupabaseClient } from './supabaseClient';
import type {
  ListingPayload,
  ListingSummary,
  ListingFeatureGroup,
} from '@/types/listing';

const listingSummaryProjection = `
  id,
  autovit_id,
  slug,
  title,
  price_value,
  price_currency,
  year,
  mileage_km,
  fuel_type,
  gearbox,
  main_image,
  badges,
  location_label
`;

const listingDetailProjection = `
  id,
  autovit_id,
  slug,
  status,
  title,
  subtitle,
  price_value,
  price_currency,
  price_old_value,
  price_negotiable,
  price_labels,
  mileage_km,
  year,
  engine_capacity_cc,
  engine_power_hp,
  fuel_type,
  gearbox,
  transmission,
  body_type,
  color,
  emission_class,
  co2_emissions,
  consumption,
  vin,
  first_registration,
  technical_inspection,
  last_service,
  main_features,
  badges,
  highlight_tags,
  images,
  description,
  details,
  feature_groups,
  technical_specs,
  seller,
  financing_options,
  created_at,
  updated_at
`;

type ListingRow = Record<string, unknown>;

type ListingSummaryRow = Record<string, unknown>;

const toSummary = (row: ListingSummaryRow): ListingSummary => ({
  id: String(row.id),
  autovitId: row.autovit_id ? String(row.autovit_id) : null,
  title: String(row.title ?? ''),
  slug: row.slug ? String(row.slug) : null,
  priceValue: Number(row.price_value ?? 0),
  priceCurrency: String(row.price_currency ?? 'EUR'),
  year: row.year != null ? Number(row.year) : null,
  mileageKm: row.mileage_km != null ? Number(row.mileage_km) : null,
  fuelType: row.fuel_type != null ? String(row.fuel_type) : null,
  gearbox: row.gearbox != null ? String(row.gearbox) : null,
  mainImage: row.main_image != null ? String(row.main_image) : null,
  badges: Array.isArray(row.badges) ? row.badges as { code: string; label: string }[] : [],
  location: row.location_label != null ? String(row.location_label) : null,
});

const normaliseFeatureGroups = (value: unknown): ListingFeatureGroup[] => {
  if (!Array.isArray(value)) return [];
  return value.map((group) => ({
    key: String((group as any).key ?? ''),
    label: String((group as any).label ?? ''),
    items: Array.isArray((group as any).values)
      ? ((group as any).values as any[]).map((item) => String(item.label ?? item.value ?? ''))
      : [],
  }));
};

const toListingPayload = (row: ListingRow): ListingPayload => {
  const consumption = typeof row.consumption === 'object' && row.consumption !== null
    ? row.consumption as Record<string, string | null>
    : undefined;

  return {
    id: String(row.id),
    autovitId: row.autovit_id ? String(row.autovit_id) : null,
    slug: row.slug ? String(row.slug) : null,
    status: row.status ? String(row.status) : null,
    title: String(row.title ?? ''),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    price: {
      value: Number(row.price_value ?? 0),
      currency: String(row.price_currency ?? 'EUR'),
      oldValue: row.price_old_value != null ? Number(row.price_old_value) : null,
      negotiable: row.price_negotiable as boolean | undefined,
      labels: Array.isArray(row.price_labels)
        ? (row.price_labels as unknown[]).map((label) => String(label))
        : undefined,
    },
    mileageKm: row.mileage_km != null ? Number(row.mileage_km) : null,
    registrationYear: row.year != null ? Number(row.year) : null,
    engineCapacityCc: row.engine_capacity_cc != null ? Number(row.engine_capacity_cc) : null,
    enginePowerHp: row.engine_power_hp != null ? Number(row.engine_power_hp) : null,
    fuelType: row.fuel_type != null ? String(row.fuel_type) : null,
    gearbox: row.gearbox != null ? String(row.gearbox) : null,
    transmission: row.transmission != null ? String(row.transmission) : null,
    bodyType: row.body_type != null ? String(row.body_type) : null,
    color: row.color != null ? String(row.color) : null,
    emissionClass: row.emission_class != null ? String(row.emission_class) : null,
    co2Emissions: row.co2_emissions != null ? String(row.co2_emissions) : null,
    consumption: consumption
      ? {
          urban: consumption.urban ?? null,
          extraUrban: consumption.extraUrban ?? consumption.extraurban ?? null,
          combined: consumption.combined ?? null,
        }
      : undefined,
    vin: row.vin != null ? String(row.vin) : null,
    firstRegistration: row.first_registration != null ? String(row.first_registration) : null,
    technicalInspection: row.technical_inspection != null ? String(row.technical_inspection) : null,
    lastService: row.last_service != null ? String(row.last_service) : null,
    mainFeatures: Array.isArray(row.main_features)
      ? (row.main_features as any[]).map((item) => ({
          label: String(item.label ?? ''),
          value: String(item.value ?? ''),
        }))
      : undefined,
    badges: Array.isArray(row.badges)
      ? (row.badges as any[]).map((badge) => ({
          code: String(badge.code ?? ''),
          label: String(badge.label ?? ''),
        }))
      : undefined,
    highlightTags: Array.isArray(row.highlight_tags)
      ? (row.highlight_tags as any[]).map((tag) => String(tag))
      : undefined,
    images: Array.isArray(row.images)
      ? (row.images as any[]).map((image, index) => ({
          url: String(typeof image === 'string' ? image : image.url ?? ''),
          isPrimary: index === 0,
          caption: typeof image === 'object' && image !== null ? String(image.caption ?? '') : null,
        }))
      : [],
    description: row.description != null ? String(row.description) : null,
    details: Array.isArray(row.details)
      ? (row.details as any[]).map((detail) => ({
          key: String(detail.key ?? ''),
          label: String(detail.label ?? ''),
          value: detail.value != null ? String(detail.value) : null,
          description: detail.description != null ? String(detail.description) : null,
          group: String(detail.group ?? ''),
          href: detail.href != null ? String(detail.href) : null,
          order: detail.overviewOrder ?? detail.order ?? null,
        }))
      : undefined,
    featureGroups: normaliseFeatureGroups(row.feature_groups),
    technicalSpecs: Array.isArray(row.technical_specs)
      ? (row.technical_specs as any[]).map((spec) => ({
          label: String(spec.label ?? ''),
          value: String(spec.value ?? ''),
          category: spec.category != null ? String(spec.category) : null,
          order: spec.order != null ? Number(spec.order) : null,
        }))
      : undefined,
    seller: row.seller && typeof row.seller === 'object'
      ? {
          id: String((row.seller as any).id ?? ''),
          name: String((row.seller as any).name ?? ''),
          type: ((row.seller as any).type ?? 'PRIVATE') as 'PROFESSIONAL' | 'PRIVATE',
          phoneNumbers: Array.isArray((row.seller as any).phoneNumbers)
            ? ((row.seller as any).phoneNumbers as any[]).map((phone) => String(phone))
            : undefined,
          email: (row.seller as any).email ?? null,
          website: (row.seller as any).website ?? null,
          address: ((row.seller as any).location?.address) ?? null,
          city: ((row.seller as any).location?.city) ?? null,
          county: ((row.seller as any).location?.region) ?? null,
          badges: Array.isArray((row.seller as any).featuresBadges)
            ? ((row.seller as any).featuresBadges as any[]).map((badge) => ({
                code: String(badge.code ?? ''),
                label: String(badge.label ?? ''),
              }))
            : undefined,
          workingHours: Array.isArray((row.seller as any).workingHours)
            ? ((row.seller as any).workingHours as any[]).map((item) => ({
                day: Number(item.day ?? 0),
                openAt: String(item.openAt ?? ''),
                closeAt: String(item.closeAt ?? ''),
                isOpen: Boolean(item.isOpen),
              }))
            : undefined,
          location: (row.seller as any).location
            ? {
                latitude: (row.seller as any).location.map?.latitude ?? null,
                longitude: (row.seller as any).location.map?.longitude ?? null,
                shortAddress: (row.seller as any).location.shortAddress ?? null,
              }
            : null,
        }
      : null,
    financingOptions: Array.isArray(row.financing_options)
      ? (row.financing_options as any[]).map((option) => ({
          partnerName: String(option.partnerName ?? option.partner_name ?? ''),
          monthlyPayment: Number(option.monthlyPayment ?? option.monthly_payment ?? 0),
          advancePayment: option.advancePayment ?? option.advance_payment ?? null,
          currency: String(option.currency ?? 'EUR'),
          loanTermMonths: option.loanTermMonths ?? option.loan_term_months ?? null,
          apr: option.apr ?? null,
          description: option.description ?? null,
        }))
      : undefined,
    createdAt: row.created_at != null ? String(row.created_at) : undefined,
    updatedAt: row.updated_at != null ? String(row.updated_at) : undefined,
  };
};

export const fetchListings = async (): Promise<ListingSummary[]> => {
  if (!hasSupabaseClient || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('listings_view')
    .select(listingSummaryProjection)
    .order('created_at', { ascending: false })
    .limit(60);

  if (error) {
    throw error;
  }

  return (data ?? []).map(toSummary);
};

export const fetchListingById = async (id: string): Promise<ListingPayload | null> => {
  if (!hasSupabaseClient || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('listings_view')
    .select(listingDetailProjection)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return toListingPayload(data as ListingRow);
};

export const fetchListingByAutovitId = async (autovitId: string): Promise<ListingPayload | null> => {
  if (!hasSupabaseClient || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('listings_view')
    .select(listingDetailProjection)
    .eq('autovit_id', autovitId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return toListingPayload(data as ListingRow);
};

export const hasSupabaseEnv = hasSupabaseClient;
