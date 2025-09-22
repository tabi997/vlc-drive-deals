export interface ListingImage {
  url: string;
  isPrimary?: boolean;
  caption?: string | null;
}

export interface ListingMainFeature {
  label: string;
  value: string;
}

export interface ListingDetail {
  key: string;
  label: string;
  value: string | null;
  description?: string | null;
  group: string;
  href?: string | null;
  order?: number | null;
}

export interface ListingFeatureGroup {
  key: string;
  label: string;
  items: string[];
}

export interface ListingTechnicalSpec {
  label: string;
  value: string;
  category?: string | null;
  order?: number | null;
}

export interface ListingSellerWorkingHours {
  day: number; // 0 = Sunday
  openAt: string;
  closeAt: string;
  isOpen: boolean;
}

export interface ListingSeller {
  id: string;
  name: string;
  type: 'PROFESSIONAL' | 'PRIVATE';
  phoneNumbers?: string[];
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  county?: string | null;
  badges?: { code: string; label: string }[];
  workingHours?: ListingSellerWorkingHours[];
  location?: {
    latitude?: number;
    longitude?: number;
    shortAddress?: string | null;
  } | null;
}

export interface ListingFinancingOption {
  partnerName: string;
  monthlyPayment: number;
  advancePayment?: number | null;
  currency: string;
  loanTermMonths?: number | null;
  apr?: number | null;
  description?: string | null;
}

export interface ListingPayload {
  id: string;
  autovitId?: string | null;
  slug?: string | null;
  status?: string | null;
  title: string;
  subtitle?: string | null;
  price: {
    value: number;
    currency: string;
    oldValue?: number | null;
    negotiable?: boolean;
    labels?: string[];
  };
  mileageKm?: number | null;
  registrationYear?: number | null;
  engineCapacityCc?: number | null;
  enginePowerHp?: number | null;
  fuelType?: string | null;
  gearbox?: string | null;
  transmission?: string | null;
  bodyType?: string | null;
  color?: string | null;
  emissionClass?: string | null;
  co2Emissions?: string | null;
  consumption?: {
    urban?: string | null;
    extraUrban?: string | null;
    combined?: string | null;
  };
  vin?: string | null;
  firstRegistration?: string | null;
  technicalInspection?: string | null;
  lastService?: string | null;
  mainFeatures?: ListingMainFeature[];
  badges?: { code: string; label: string }[];
  highlightTags?: string[];
  images: ListingImage[];
  description?: string | null;
  details?: ListingDetail[];
  featureGroups?: ListingFeatureGroup[];
  technicalSpecs?: ListingTechnicalSpec[];
  seller?: ListingSeller | null;
  financingOptions?: ListingFinancingOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListingSummary {
  id: string;
  autovitId?: string | null;
  title: string;
  slug?: string | null;
  priceValue: number;
  priceCurrency: string;
  year?: number | null;
  mileageKm?: number | null;
  fuelType?: string | null;
  gearbox?: string | null;
  mainImage?: string | null;
  badges?: { code: string; label: string }[];
  location?: string | null;
}
