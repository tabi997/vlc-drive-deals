import { createClient } from '@supabase/supabase-js';
import listing from '../src/data/sample-listing.json' assert { type: 'json' };

const url = process.env.SUPABASE_SERVICE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.service_role;

if (!url || !serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

const payload = {
  autovit_id: listing.autovitId ?? listing.id,
  status: listing.status ?? 'ACTIVE',
  title: listing.title,
  subtitle: listing.subtitle ?? null,
  price_value: listing.price.value,
  price_currency: listing.price.currency,
  price_old_value: listing.price.oldValue ?? null,
  price_negotiable: listing.price.negotiable ?? null,
  price_labels: listing.price.labels ?? null,
  mileage_km: listing.mileageKm ?? null,
  year: listing.registrationYear ?? null,
  engine_capacity_cc: listing.engineCapacityCc ?? null,
  engine_power_hp: listing.enginePowerHp ?? null,
  fuel_type: listing.fuelType ?? null,
  gearbox: listing.gearbox ?? null,
  transmission: listing.transmission ?? null,
  body_type: listing.bodyType ?? null,
  color: listing.color ?? null,
  emission_class: listing.emissionClass ?? null,
  co2_emissions: listing.co2Emissions ?? null,
  consumption: listing.consumption ?? null,
  vin: listing.vin ?? null,
  first_registration: listing.firstRegistration ?? null,
  technical_inspection: listing.technicalInspection ?? null,
  last_service: listing.lastService ?? null,
  main_features: listing.mainFeatures ?? null,
  badges: listing.badges ?? null,
  highlight_tags: listing.highlightTags ?? null,
  images: listing.images ?? null,
  main_image: listing.images?.[0]?.url ?? null,
  location_label: listing.seller?.location?.shortAddress ?? listing.seller?.city ?? null,
  description: listing.description ?? null,
  details: listing.details ?? null,
  feature_groups: listing.featureGroups ?? null,
  technical_specs: listing.technicalSpecs ?? null,
  seller: listing.seller ?? null,
  financing_options: listing.financingOptions ?? null,
  payload: listing,
};

const { error } = await supabase.from('autovit_listings').upsert(payload, {
  onConflict: 'autovit_id',
});

if (error) {
  console.error('Failed to seed listing', error);
  process.exit(1);
}

console.log('Sample listing seeded successfully.');
