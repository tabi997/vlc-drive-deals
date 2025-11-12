import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  Palette,
  CheckCircle,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
} from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useListing } from '@/hooks/useListing';
import { parseDescription } from '@/lib/description';
import { APP_CONFIG } from '@/lib/config';
import type { ListingDetail, ListingFeatureGroup } from '@/types/listing';

const priceFormatter = new Intl.NumberFormat('ro-RO', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('ro-RO');

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549921296-3c48d285d0c5?auto=format&fit=crop&w=1200&q=80';

const DETAIL_GROUP_LABELS: Record<string, string> = {
  basic_information: 'Informații de bază',
  technical_specs: 'Specificații tehnice',
  comfort_and_addons: 'Confort și echipamente',
  electronics_and_driver_assistance: 'Electronice și sisteme de asistență',
  security: 'Siguranță',
  history: 'Istoric',
  documents: 'Documente',
};

const groupDetails = (details?: ListingDetail[]) => {
  if (!details) return [] as { key: string; label: string; items: ListingDetail[] }[];
  const map = new Map<string, { key: string; label: string; items: ListingDetail[] }>();
  details.forEach((detail) => {
    const key = detail.group ?? 'other';
    if (!map.has(key)) {
      const fallbackLabel = detail.group
        ? detail.group.replace(/_/g, ' ').toUpperCase()
        : 'Detalii';
      map.set(key, {
        key,
        label: DETAIL_GROUP_LABELS[key] ?? fallbackLabel,
        items: [],
      });
    }
    map.get(key)?.items.push(detail);
  });
  return Array.from(map.values()).map((group) => ({
    ...group,
    items: group.items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
  }));
};

const formatMileage = (value?: number | null) => {
  if (value == null) return null;
  return `${numberFormatter.format(value)} km`;
};

const formatEngine = (cc?: number | null, hp?: number | null) => {
  if (cc == null && hp == null) return null;
  const parts = [];
  if (cc != null) parts.push(`${numberFormatter.format(cc)} cm³`);
  if (hp != null) parts.push(`${hp} CP`);
  return parts.join(' • ');
};

const getBadgeVariant = (code: string) => {
  switch (code) {
    case 'dealer':
      return 'secondary';
    case 'fast-reply':
      return 'outline';
    default:
      return 'default';
  }
};

const featureGroupsToTabs = (groups?: ListingFeatureGroup[]) => {
  if (!groups?.length) return null;
  return groups.map((group) => ({
    key: group.key,
    label: group.label,
    items: group.items,
  }));
};

const CarDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data: listing, isLoading } = useListing({ id });
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [listing?.id]);

  useEffect(() => {
    if (searchParams.get('action') === 'contact') {
      document.getElementById('contact-card')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  const groupedDetails = useMemo(() => groupDetails(listing?.details), [listing?.details]);
  const descriptionBlocks = useMemo(() => parseDescription(listing?.description), [listing?.description]);
  const images = useMemo(() => (listing?.images?.length ? listing.images : [{ url: FALLBACK_IMAGE, isPrimary: true }]), [listing]);
  const quickStats = useMemo(() => {
    if (!listing) return [];
    return [
      {
        icon: Calendar,
        label: 'An fabricație',
        value: listing.registrationYear ? String(listing.registrationYear) : null,
      },
      {
        icon: Gauge,
        label: 'Kilometraj',
        value: formatMileage(listing.mileageKm),
      },
      {
        icon: Fuel,
        label: 'Combustibil',
        value: listing.fuelType ?? null,
      },
      {
        icon: Settings,
        label: 'Cutie viteze',
        value: listing.gearbox ?? null,
      },
      {
        icon: Gauge,
        label: 'Motor',
        value: formatEngine(listing.engineCapacityCc, listing.enginePowerHp),
      },
      {
        icon: Palette,
        label: 'Culoare',
        value: listing.color ?? null,
      },
    ].filter((stat) => Boolean(stat.value));
  }, [listing]);

  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () => setActiveSlide(carouselApi.selectedScrollSnap());
    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleSelect);
    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!listing?.id) return;
    setActiveSlide(0);
    setIsLightboxOpen(false);
    carouselApi?.scrollTo(0, true);
  }, [listing?.id, carouselApi]);

  const handleOpenImage = (index: number) => {
    carouselApi?.scrollTo(index, true);
    setActiveSlide(index);
    setIsLightboxOpen(true);
  };

  const handleLightboxNavigate = (direction: 'prev' | 'next') => {
    if (!images.length) return;
    setActiveSlide((prev) => {
      const nextIndex = direction === 'next' ? (prev + 1) % images.length : (prev - 1 + images.length) % images.length;
      carouselApi?.scrollTo(nextIndex, true);
      return nextIndex;
    });
  };

  const activeImage = images[activeSlide] ?? images[0];

  if (isLoading && !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 animate-pulse">
              <div className="h-96 w-full bg-muted" />
            </Card>
            <Card className="animate-pulse">
              <div className="h-64 bg-muted" />
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Mașina nu a fost găsită</h1>
          <p className="mb-8 text-muted-foreground">Anunțul pe care îl căutați nu există sau a fost șters.</p>
          <Button asChild>
            <Link to="/cumpara">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la Lista de Mașini
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const price = priceFormatter.format(listing.price.value);
  const basicInfoGroup = groupedDetails.find((group) => group.key === 'basic_information');
  const technicalGroup = groupedDetails.find((group) => group.key === 'technical_specs');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">Acasă</Link>
          <span>/</span>
          <Link to="/cumpara" className="transition-colors hover:text-foreground">Cumpără</Link>
          {basicInfoGroup?.items?.find((item) => item.key === 'make') && (
            <>
              <span>/</span>
              <span className="text-foreground">{listing.title}</span>
            </>
          )}
        </div>

        <Button variant="outline" asChild className="mb-6">
          <Link to="/cumpara">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la Lista de Mașini
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <Carousel
                  setApi={setCarouselApi}
                  opts={{ align: 'start', loop: hasMultipleImages }}
                  className="w-full"
                >
                  <CarouselContent className="ml-0">
                    {images.map((image, index) => (
                      <CarouselItem key={image.url} className="pl-0">
                        <button
                          type="button"
                          onClick={() => handleOpenImage(index)}
                          aria-label={`Deschide imaginea ${index + 1}`}
                          className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:cursor-zoom-in"
                        >
                          <AspectRatio ratio={16 / 9} className="relative overflow-hidden bg-muted md:rounded-lg">
                            <img
                              src={image.url}
                              alt={`${listing.title} ${index + 1}`}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
                          </AspectRatio>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {hasMultipleImages ? (
                    <>
                      <CarouselPrevious className="hidden md:flex -left-4 top-1/2 -translate-y-1/2 border-none bg-card/80 text-foreground shadow-lg backdrop-blur-sm hover:bg-card" />
                      <CarouselNext className="hidden md:flex -right-4 top-1/2 -translate-y-1/2 border-none bg-card/80 text-foreground shadow-lg backdrop-blur-sm hover:bg-card" />
                    </>
                  ) : null}
                </Carousel>
                {hasMultipleImages ? (
                  <div className="mt-3 flex justify-center gap-2 md:hidden">
                    {images.map((_, index) => (
                      <span
                        key={`${listing.id}-dot-${index}`}
                        className={`h-2 w-2 rounded-full transition ${
                          index === activeSlide ? 'bg-accent' : 'bg-muted-foreground/40'
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
                {hasMultipleImages ? (
                  <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 transform rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white md:flex">
                    {activeSlide + 1} / {images.length}
                  </div>
                ) : null}
                <div className="absolute right-4 top-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsFavorite((prev) => !prev)}
                    className="bg-card/80 backdrop-blur-sm"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-card/80 backdrop-blur-sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                {listing.registrationYear ? (
                  <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                    {listing.registrationYear}
                  </Badge>
                ) : null}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Prezentare generală</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border p-4">
                      <stat.icon className="mb-2 h-5 w-5 text-accent" />
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-base font-semibold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {listing.mainFeatures?.length ? (
                  <div className="rounded-xl bg-muted/40 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-foreground">Caracteristici cheie</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {listing.mainFeatures.map((feature) => (
                        <div key={feature.label} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span className="font-medium text-foreground">{feature.label}:</span>
                          <span className="text-muted-foreground">{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Descriere</h3>
                  {descriptionBlocks.length ? (
                    <div className="space-y-3 text-muted-foreground">
                      {descriptionBlocks.map((block, index) => {
                        if (block.type === 'list') {
                          return (
                            <ul key={`list-${index}`} className="list-disc space-y-1 pl-5 text-left">
                              {block.items.map((item, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={`paragraph-${index}`} className="leading-relaxed">
                            {block.content}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Descriere indisponibilă pentru acest vehicul.</p>
                  )}
                </div>
              </CardContent>
            </Card>


            {technicalGroup?.items?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Specificații tehnice detaliate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {technicalGroup.items.map((detail) => (
                      <div key={detail.key} className="rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">{detail.label}</p>
                        <p className="text-base font-semibold text-foreground">{detail.value ?? '—'}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {groupedDetails.filter((group) => group.key !== 'technical_specs' && group.key !== 'basic_information').length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalii suplimentare</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {groupedDetails
                    .filter((group) => group.key !== 'technical_specs' && group.key !== 'basic_information')
                    .map((group) => (
                      <div key={group.key}>
                        <h3 className="text-lg font-semibold text-foreground">{group.label}</h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {group.items.map((item) => (
                            <div key={item.key} className="rounded-lg border border-border p-4 text-sm">
                              <p className="text-muted-foreground">{item.label}</p>
                              <p className="font-medium text-foreground">{item.value ?? '—'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs uppercase tracking-wide">
                      {listing.status ?? 'Disponibil'}
                    </Badge>
                    <CardTitle className="text-3xl leading-tight text-foreground">{listing.title}</CardTitle>
                    {listing.subtitle && (
                      <p className="text-muted-foreground">{listing.subtitle}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-accent">{price}</p>
                  {listing.price.oldValue ? (
                    <p className="text-sm text-muted-foreground line-through">
                      {priceFormatter.format(listing.price.oldValue)}
                    </p>
                  ) : null}
                  {listing.price.labels?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {listing.price.labels.map((label) => (
                        <Badge key={label} variant="secondary">{label}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                {listing.highlightTags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {listing.highlightTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <Separator />

                {listing.seller?.location?.shortAddress && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Locație</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-sm text-foreground">
                        {listing.seller.location.shortAddress}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {listing.seller && (
              <Card id="contact-card">
                <CardHeader>
                  <CardTitle>Contactează vânzătorul</CardTitle>
                  <p className="text-sm text-muted-foreground">{listing.seller.name}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {listing.seller.badges?.map((badge) => (
                      <Badge key={badge.code} variant={getBadgeVariant(badge.code)}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <a href={`tel:${APP_CONFIG.contact.phone.uri}`}>
                        <Phone className="mr-2 h-4 w-4" /> Sună {APP_CONFIG.contact.phone.display}
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <a
                        href={`${APP_CONFIG.contact.phone.whatsapp}?text=${encodeURIComponent('Bună ziua! Aș dori mai multe informații despre mașina listată pe VLC Car Deals.')}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> Trimite mesaj WhatsApp
                      </a>
                    </Button>
                    {listing.seller.email ? (
                      <Button variant="outline" className="w-full" size="lg" asChild>
                        <a href={`mailto:${listing.seller.email}`}>
                          <Mail className="mr-2 h-4 w-4" /> Trimite email
                        </a>
                      </Button>
                    ) : null}
                  </div>

                  {listing.seller.workingHours?.length ? (
                    <div className="rounded-lg bg-muted/40 p-4 text-sm">
                      <p className="mb-2 font-semibold text-foreground">Program dealer</p>
                      <ul className="space-y-1">
                        {listing.seller.workingHours.map((slot) => (
                          <li key={slot.day} className="flex justify-between">
                            <span className="capitalize text-muted-foreground">
                              {['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'][slot.day]}
                            </span>
                            <span className="text-foreground">
                              {slot.isOpen ? `${slot.openAt} - ${slot.closeAt}` : 'Închis'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {listing.seller?.location?.latitude && listing.seller.location.longitude ? (
              <Card>
                <CardHeader>
                  <CardTitle>Locația pe hartă</CardTitle>
                </CardHeader>
                <CardContent>
                  <iframe
                    title="Hartă dealer"
                    className="h-64 w-full rounded-lg border"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${listing.seller.location.latitude},${listing.seller.location.longitude}&z=13&output=embed`}
                    allowFullScreen
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {listing.seller.location.shortAddress}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {basicInfoGroup?.items?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Informații de bază</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {basicInfoGroup.items.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value ?? '—'}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {(listing.firstRegistration || listing.lastService || listing.technicalInspection || listing.vin) && (
              <Card>
                <CardHeader>
                  <CardTitle>Istoric vehicul</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {listing.firstRegistration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prima înmatriculare</span>
                      <span className="font-medium text-foreground">{listing.firstRegistration}</span>
                    </div>
                  )}
                  {listing.lastService && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ultimul service</span>
                      <span className="font-medium text-foreground">{listing.lastService}</span>
                    </div>
                  )}
                  {listing.technicalInspection && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Următoarea ITP</span>
                      <span className="font-medium text-foreground">{listing.technicalInspection}</span>
                    </div>
                  )}
                  {listing.vin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VIN</span>
                      <span className="font-mono text-xs text-foreground">{listing.vin}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 text-white shadow-none">
          <div className="relative flex items-center justify-center bg-black/90">
            {hasMultipleImages ? (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleLightboxNavigate('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Imaginea anterioară</span>
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleLightboxNavigate('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Imaginea următoare</span>
                </Button>
              </>
            ) : null}
            <img
              src={activeImage?.url}
              alt={`${listing.title} - imagine ${activeSlide + 1}`}
              className="max-h-[85vh] w-full object-contain bg-black"
            />
          </div>
          {hasMultipleImages ? (
            <div className="bg-black/75 px-6 py-4 text-center text-sm text-white">
              {activeSlide + 1} / {images.length}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarDetail;
