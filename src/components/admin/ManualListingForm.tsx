import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AdminListingRecord, ListingMutationPayload } from '@/hooks/useAdminListings';

interface ManualListingFormProps {
  listing?: AdminListingRecord | null;
  onSubmit: (payload: ListingMutationPayload) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

type FormValues = {
  title: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  priceValue: string;
  priceCurrency: string;
  mileageKm: string;
  year: string;
  fuelType: string;
  gearbox: string;
  transmission: string;
  locationLabel: string;
  description: string;
  mainImage: string;
  gallery: string;
  highlightTags: string;
};

const defaultValues: FormValues = {
  title: '',
  status: 'ACTIVE',
  priceValue: '',
  priceCurrency: 'EUR',
  mileageKm: '',
  year: '',
  fuelType: '',
  gearbox: '',
  transmission: '',
  locationLabel: '',
  description: '',
  mainImage: '',
  gallery: '',
  highlightTags: '',
};

const parseGallery = (gallery: string) => {
  const urls = gallery
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return urls.length ? urls.map((url) => ({ url })) : [];
};

const parseTags = (value: string) => {
  const tags = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return tags.length ? tags : null;
};

const buildMainFeatures = (values: FormValues) => {
  const features: Array<{ label: string; value: string }> = [];
  if (values.year) features.push({ label: 'An fabricație', value: values.year });
  if (values.mileageKm) features.push({ label: 'Kilometraj', value: `${Number(values.mileageKm).toLocaleString('ro-RO')} km` });
  if (values.fuelType) features.push({ label: 'Combustibil', value: values.fuelType });
  return features.length ? features : null;
};

const ManualListingForm = ({ listing, onSubmit, onCancel, isSubmitting }: ManualListingFormProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    if (!listing) {
      reset(defaultValues);
      return;
    }

    reset({
      title: listing.title ?? '',
      status: (listing.status as FormValues['status']) ?? 'ACTIVE',
      priceValue: listing.price?.value ? String(listing.price.value) : '',
      priceCurrency: listing.price?.currency ?? 'EUR',
      mileageKm: listing.mileageKm != null ? String(listing.mileageKm) : '',
      year: listing.registrationYear != null ? String(listing.registrationYear) : '',
      fuelType: listing.fuelType ?? '',
      gearbox: listing.gearbox ?? '',
      transmission: listing.transmission ?? '',
      locationLabel: listing.seller?.location?.shortAddress ?? listing.location ?? '',
      description: listing.description ?? '',
      mainImage: listing.images?.[0]?.url ?? listing.raw?.main_image ?? '',
      gallery: listing.images?.slice(1).map((img) => img.url).join('\n') ?? '',
      highlightTags: listing.highlightTags?.join('\n') ?? '',
    });
  }, [listing, reset]);

  const submitForm = handleSubmit((values) => {
    if (!values.title.trim()) {
      alert('Titlul este obligatoriu.');
      return;
    }

    const priceValue = Number(values.priceValue);
    if (Number.isNaN(priceValue)) {
      alert('Prețul trebuie să fie un număr.');
      return;
    }

    const galleryImages = parseGallery(values.gallery);
    const allImages = values.mainImage ? [{ url: values.mainImage }, ...galleryImages] : galleryImages;
    const highlightTags = parseTags(values.highlightTags);

    const generatedId = listing?.autovitId ?? `manual-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now()}`;

    const payload: ListingMutationPayload = {
      id: listing?.id,
      autovit_id: generatedId,
      title: values.title.trim(),
      status: values.status,
      price_value: priceValue,
      price_currency: values.priceCurrency.trim() || 'EUR',
      mileage_km: values.mileageKm ? Number(values.mileageKm) : null,
      year: values.year ? Number(values.year) : null,
      fuel_type: values.fuelType || null,
      gearbox: values.gearbox || null,
      transmission: values.transmission || null,
      location_label: values.locationLabel || null,
      description: values.description || null,
      highlight_tags: highlightTags,
      images: allImages,
      main_image: values.mainImage || allImages[0]?.url || null,
      main_features: buildMainFeatures(values),
    };

    onSubmit(payload);
  });

  return (
    <form onSubmit={submitForm} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Titlu *</label>
          <Input placeholder="Ex: Ford Fiesta Titanium" {...register('title')} required />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Status</label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('status')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Preț *</label>
          <Input type="number" min="0" step="0.01" {...register('priceValue')} required />
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
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Locație</label>
          <Input {...register('locationLabel')} placeholder="Cluj-Napoca" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Imagine principală</label>
          <Input {...register('mainImage')} placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Galerie (un URL pe linie)</label>
          <Textarea rows={3} {...register('gallery')} placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-foreground">Tag-uri evidențiate (câte unul pe linie)</label>
          <Textarea rows={2} {...register('highlightTags')} placeholder="Dealer\nVerificat" />
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
          {isSubmitting ? 'Se salvează...' : listing ? 'Actualizează anunțul' : 'Salvează anunțul'}
        </Button>
      </div>
    </form>
  );
};

export default ManualListingForm;
