import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AdminListingRecord, ListingMutationPayload } from '@/hooks/useAdminListings';

interface ListingFormProps {
  listing?: AdminListingRecord | null;
  onSubmit: (payload: ListingMutationPayload) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface ListingFormState {
  id?: string;
  autovitId: string;
  title: string;
  status: string;
  priceValue: string;
  priceCurrency: string;
  mileageKm: string;
  year: string;
  fuelType: string;
  gearbox: string;
  transmission: string;
  bodyType: string;
  color: string;
  locationLabel: string;
  description: string;
  mainImage: string;
  imageUrls: string;
  mainFeatures: string;
  highlightTags: string;
  subtitle: string;
}

const defaultFormState: ListingFormState = {
  id: undefined,
  autovitId: '',
  title: '',
  status: 'ACTIVE',
  priceValue: '',
  priceCurrency: 'EUR',
  mileageKm: '',
  year: '',
  fuelType: '',
  gearbox: '',
  transmission: '',
  bodyType: '',
  color: '',
  locationLabel: '',
  description: '',
  mainImage: '',
  imageUrls: '',
  mainFeatures: '',
  highlightTags: '',
  subtitle: '',
};

const formatFeatures = (listing?: AdminListingRecord | null) => {
  if (!listing?.mainFeatures?.length) return '';
  return listing.mainFeatures
    .map((feature) => `${feature.label ?? feature.value ?? ''}:${feature.value ?? ''}`.trim())
    .filter(Boolean)
    .join('\n');
};

const formatImages = (listing?: AdminListingRecord | null) => {
  if (!listing?.images?.length) return '';
  return listing.images
    .map((image) => image.url)
    .filter(Boolean)
    .join('\n');
};

const formatTags = (listing?: AdminListingRecord | null) => {
  if (!listing?.highlightTags?.length) return '';
  return listing.highlightTags.join('\n');
};

const parseFeatures = (features: string) => {
  if (!features.trim()) return null;
  const items = features
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value] = line.split(':');
      return {
        label: (label ?? '').trim(),
        value: (value ?? '').trim(),
      };
    })
    .filter((item) => item.label || item.value);

  return items.length ? items : null;
};

const parseImageUrls = (value: string) => {
  const urls = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return urls.length ? urls.map((url) => ({ url })) : null;
};

const parseHighlightTags = (value: string) => {
  const tags = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return tags.length ? tags : null;
};

export const ListingForm = ({ listing, onSubmit, onCancel, isSubmitting }: ListingFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ListingFormState>({
    defaultValues: defaultFormState,
  });

  useEffect(() => {
    if (!listing) {
      reset(defaultFormState);
      return;
    }

    reset({
      id: listing.id,
      autovitId: listing.autovitId ?? '',
      title: listing.title ?? '',
      status: listing.status ?? 'ACTIVE',
      priceValue: listing.price?.value ? String(listing.price.value) : '',
      priceCurrency: listing.price?.currency ?? 'EUR',
      mileageKm: listing.mileageKm != null ? String(listing.mileageKm) : '',
      year: listing.registrationYear != null ? String(listing.registrationYear) : '',
      fuelType: listing.fuelType ?? '',
      gearbox: listing.gearbox ?? '',
      transmission: listing.transmission ?? '',
      bodyType: listing.bodyType ?? '',
      color: listing.color ?? '',
      locationLabel: listing.seller?.location?.shortAddress ?? listing.location ?? '',
      description: listing.description ?? '',
      mainImage: listing.images?.[0]?.url ?? listing.raw?.main_image ?? '',
      imageUrls: formatImages(listing),
      mainFeatures: formatFeatures(listing),
      highlightTags: formatTags(listing),
      subtitle: listing.subtitle ?? '',
    });
  }, [listing, reset]);

  const submitForm = handleSubmit((values) => {
    if (!values.autovitId.trim()) {
      toast.error('Autovit ID este obligatoriu.');
      return;
    }

    const priceValue = Number(values.priceValue);

    if (Number.isNaN(priceValue) || priceValue < 0) {
      toast.error('Prețul nu este valid.');
      return;
    }

    const combinedImages = [values.mainImage, values.imageUrls]
      .filter((part) => part && part.trim())
      .join('\n');

    const parsedImages = parseImageUrls(combinedImages);
    const firstParsedImage = parsedImages && parsedImages.length ? parsedImages[0].url : null;
    const parsedFeatures = parseFeatures(values.mainFeatures ?? '');
    const parsedTags = parseHighlightTags(values.highlightTags ?? '');

    const payload: ListingMutationPayload = {
      id: values.id,
      autovit_id: values.autovitId.trim(),
      title: values.title.trim(),
      status: values.status || 'ACTIVE',
      subtitle: values.subtitle.trim() || null,
      price_value: priceValue,
      price_currency: values.priceCurrency.trim() || 'EUR',
      mileage_km: values.mileageKm ? Number(values.mileageKm) : null,
      year: values.year ? Number(values.year) : null,
      fuel_type: values.fuelType || null,
      gearbox: values.gearbox || null,
      transmission: values.transmission || null,
      body_type: values.bodyType || null,
      color: values.color || null,
      location_label: values.locationLabel || null,
      description: values.description || null,
      main_features: parsedFeatures ?? null,
      highlight_tags: parsedTags ?? null,
      images: parsedImages ?? [],
      main_image: values.mainImage || firstParsedImage || null,
    };

    onSubmit(payload);
  });

  return (
    <form onSubmit={submitForm} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-foreground">Autovit ID *</label>
          <Input placeholder="ID7HGHRB" {...register('autovitId')} required />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('status')}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Titlu *</label>
          <Input placeholder="Titlul anunțului" {...register('title')} required />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Subtitlu</label>
          <Input placeholder="Subtitlu" {...register('subtitle')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Preț (valoare) *</label>
          <Input type="number" step="0.01" min="0" {...register('priceValue')} required />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Monedă</label>
          <Input {...register('priceCurrency')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Kilometraj</label>
          <Input type="number" min="0" {...register('mileageKm')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">An fabricație</label>
          <Input type="number" {...register('year')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Combustibil</label>
          <Input {...register('fuelType')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Cutie de viteze</label>
          <Input {...register('gearbox')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Tracțiune</label>
          <Input {...register('transmission')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Caroserie</label>
          <Input {...register('bodyType')} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Culoare</label>
          <Input {...register('color')} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Locație</label>
          <Input placeholder="Cluj-Napoca" {...register('locationLabel')} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Imagine principală</label>
          <Input placeholder="URL imagine" {...register('mainImage')} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Imagini suplimentare (un URL pe linie)</label>
          <Textarea rows={4} {...register('imageUrls')} placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Caracteristici cheie (format Label:Valoare pe linie)</label>
          <Textarea rows={4} {...register('mainFeatures')} placeholder="An fabricație: 2015" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Tag-uri evidențiate (câte unul pe linie)</label>
          <Textarea rows={3} {...register('highlightTags')} placeholder="Dealer\nVerificat" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Descriere</label>
          <Textarea rows={6} {...register('description')} placeholder="Detalii despre mașină" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Anulează
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Se salvează...' : 'Salvează anunțul'}
        </Button>
      </div>
    </form>
  );
};

export default ListingForm;
