import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, hasSupabaseClient } from '@/lib/supabaseClient';
import type { ListingPayload } from '@/types/listing';

export interface AdminListingRecord extends ListingPayload {
  id: string;
  autovitId: string | null;
  status: string | null;
  createdAt?: string;
  updatedAt?: string;
  raw?: Record<string, unknown>;
}

const ADMIN_SELECT = `
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
  main_image,
  location_label,
  description,
  details,
  feature_groups,
  technical_specs,
  seller,
  financing_options,
  created_at,
  updated_at,
  payload
`;

const normaliseRecord = (row: Record<string, any>): AdminListingRecord => ({
  id: String(row.id),
  autovitId: row.autovit_id ? String(row.autovit_id) : null,
  slug: row.slug ? String(row.slug) : null,
  status: row.status ? String(row.status) : null,
  title: String(row.title ?? ''),
  subtitle: row.subtitle ?? null,
  price: {
    value: Number(row.price_value ?? 0),
    currency: String(row.price_currency ?? 'EUR'),
    oldValue: row.price_old_value != null ? Number(row.price_old_value) : null,
    negotiable: row.price_negotiable ?? undefined,
    labels: row.price_labels ?? undefined,
  },
  mileageKm: row.mileage_km != null ? Number(row.mileage_km) : null,
  registrationYear: row.year != null ? Number(row.year) : null,
  engineCapacityCc: row.engine_capacity_cc != null ? Number(row.engine_capacity_cc) : null,
  enginePowerHp: row.engine_power_hp != null ? Number(row.engine_power_hp) : null,
  fuelType: row.fuel_type ?? null,
  gearbox: row.gearbox ?? null,
  transmission: row.transmission ?? null,
  bodyType: row.body_type ?? null,
  color: row.color ?? null,
  emissionClass: row.emission_class ?? null,
  co2Emissions: row.co2_emissions ?? null,
  consumption: row.consumption ?? undefined,
  vin: row.vin ?? null,
  firstRegistration: row.first_registration ?? null,
  technicalInspection: row.technical_inspection ?? null,
  lastService: row.last_service ?? null,
  mainFeatures: row.main_features ?? undefined,
  badges: row.badges ?? undefined,
  highlightTags: row.highlight_tags ?? undefined,
  images: Array.isArray(row.images)
    ? row.images.map((image: any, index: number) => ({
        url: String(typeof image === 'string' ? image : image?.url ?? ''),
        isPrimary: index === 0,
        caption: image?.caption ?? null,
      }))
    : [],
  description: row.description ?? null,
  details: row.details ?? undefined,
  featureGroups: row.feature_groups ?? undefined,
  technicalSpecs: row.technical_specs ?? undefined,
  seller: row.seller ?? null,
  financingOptions: row.financing_options ?? undefined,
  createdAt: row.created_at ?? undefined,
  updatedAt: row.updated_at ?? undefined,
  raw: row,
});

export const useAdminListings = (enabled = true) =>
  useQuery<AdminListingRecord[]>(
    {
      queryKey: ['admin-listings'],
      enabled: enabled && hasSupabaseClient && Boolean(supabase),
      queryFn: async () => {
        if (!hasSupabaseClient || !supabase) {
          throw new Error('Supabase environment variables missing');
        }

        const { data, error } = await supabase
          .from('autovit_listings')
          .select(ADMIN_SELECT)
          .order('updated_at', { ascending: false })
          .limit(200);

        if (error) {
          throw error;
        }

        return (data ?? []).map((row) => normaliseRecord(row as Record<string, any>));
      },
      staleTime: 1000 * 30,
    }
  );

export interface ListingMutationPayload {
  id?: string;
  autovit_id: string;
  title: string;
  status?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  price_value: number;
  price_currency: string;
  price_old_value?: number | null;
  price_negotiable?: boolean | null;
  price_labels?: string[] | null;
  mileage_km?: number | null;
  year?: number | null;
  engine_capacity_cc?: number | null;
  engine_power_hp?: number | null;
  fuel_type?: string | null;
  gearbox?: string | null;
  transmission?: string | null;
  body_type?: string | null;
  color?: string | null;
  emission_class?: string | null;
  co2_emissions?: string | null;
  consumption?: Record<string, unknown> | null;
  vin?: string | null;
  first_registration?: string | null;
  technical_inspection?: string | null;
  last_service?: string | null;
  main_features?: Array<{ label: string; value: string }> | null;
  badges?: Array<{ code: string; label: string }> | null;
  highlight_tags?: string[] | null;
  images?: Array<{ url: string; caption?: string | null }>; 
  main_image?: string | null;
  location_label?: string | null;
  description?: string | null;
  details?: Record<string, unknown>[] | null;
  feature_groups?: Record<string, unknown>[] | null;
  technical_specs?: Record<string, unknown>[] | null;
  seller?: Record<string, unknown> | null;
  financing_options?: Record<string, unknown>[] | null;
  payload?: Record<string, unknown> | null;
}

const sanitizeMutationPayload = (payload: ListingMutationPayload) => {
  const { id, images, main_features, ...rest } = payload as Record<string, any>;
  const cleaned: Record<string, any> = { ...rest };

  if (Array.isArray(images)) {
    cleaned.images = images.filter((image) => image.url);
    cleaned.main_image = payload.main_image ?? images[0]?.url ?? null;
  } else if (images === null) {
    cleaned.images = [];
    cleaned.main_image = payload.main_image ?? null;
  }

  if (Array.isArray(main_features)) {
    cleaned.main_features = main_features;
  } else if (main_features === null) {
    cleaned.main_features = null;
  }

  return { id, values: cleaned };
};

export const useSaveListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ListingMutationPayload) => {
      if (!hasSupabaseClient || !supabase) {
        throw new Error('Supabase is not configured');
      }

      const { id, values } = sanitizeMutationPayload(payload);

      if (id) {
        const { error } = await supabase
          .from('autovit_listings')
          .update(values)
          .eq('id', id);

        if (error) throw error;
        return id;
      }

      const { data, error } = await supabase
        .from('autovit_listings')
        .insert(values)
        .select('id')
        .single();

      if (error) throw error;
      return data?.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    },
  });
};

export const useUpdateListingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!hasSupabaseClient || !supabase) {
        throw new Error('Supabase is not configured');
      }

      const { error } = await supabase
        .from('autovit_listings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    },
  });
};

interface ImportAutovitParams {
  url: string;
  status?: string;
}

export const useImportAutovitListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, status }: ImportAutovitParams) => {
      if (!hasSupabaseClient || !supabase) {
        throw new Error('Supabase nu este configurat.');
      }

      const { data, error } = await supabase.functions.invoke('import-autovit', {
        body: { url, status },
      });

      if (error) {
        throw new Error(error.message ?? 'Importul a eșuat.');
      }

      if (data?.error) {
        throw new Error(String(data.error));
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    },
  });
};
