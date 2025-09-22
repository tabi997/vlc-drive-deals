import type { ListingPayload, ListingSummary } from '@/types/listing';
import sampleListingJson from '@/data/sample-listing.json';

const sampleListing = sampleListingJson as ListingPayload;

export const sampleListingSummary: ListingSummary = {
  id: sampleListing.id,
  autovitId: sampleListing.autovitId,
  title: sampleListing.title,
  slug: null,
  priceValue: sampleListing.price.value,
  priceCurrency: sampleListing.price.currency,
  year: sampleListing.registrationYear,
  mileageKm: sampleListing.mileageKm ?? undefined,
  fuelType: sampleListing.fuelType ?? undefined,
  gearbox: sampleListing.gearbox ?? undefined,
  mainImage: sampleListing.images[0]?.url ?? null,
  badges: sampleListing.badges,
  location: sampleListing.seller?.location?.shortAddress ?? null,
};

export const sampleListingPayload = sampleListing;
