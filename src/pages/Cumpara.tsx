import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Car, Fuel, Calendar, Settings, Gauge, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useListings } from '@/hooks/useListings';
import type { ListingSummary } from '@/types/listing';

const priceFormatter = new Intl.NumberFormat('ro-RO', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const formatMileage = (mileage?: number | null) => {
  if (mileage == null) return '—';
  return `${new Intl.NumberFormat('ro-RO').format(mileage)} km`;
};

const getPrimaryBadge = (listing: ListingSummary) => listing.badges?.[0]?.label;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549921296-3c48d285d0c5?auto=format&fit=crop&w=1200&q=80';

const Cumpara = () => {
  const { data: listings = [], isLoading } = useListings();
  const [activeFuel, setActiveFuel] = useState<string>('all');

  const availableFuelFilters = useMemo(() => {
    const fuels = new Set<string>();
    listings.forEach((listing) => {
      if (listing.fuelType) {
        fuels.add(listing.fuelType);
      }
    });
    return Array.from(fuels);
  }, [listings]);

  const filteredListings = useMemo(() => {
    if (activeFuel === 'all') return listings;
    return listings.filter((listing) => listing.fuelType?.toLowerCase() === activeFuel.toLowerCase());
  }, [listings, activeFuel]);

  const renderCard = (listing: ListingSummary) => {
    const badge = getPrimaryBadge(listing);
    return (
            <Card key={listing.id} className="group overflow-hidden transition-smooth hover:shadow-card-custom">
              <div className="relative">
                <Link to={`/car/${listing.id}`} className="block">
                  <img
                    src={listing.mainImage ?? FALLBACK_IMAGE}
                    alt={listing.title}
                    loading="lazy"
                    className="h-48 w-full object-cover transition-smooth group-hover:scale-105 sm:h-56"
                  />
                </Link>
                {badge && (
                  <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                    {badge}
            </Badge>
          )}
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="line-clamp-2 text-left text-lg font-semibold text-foreground sm:text-xl">
                {listing.title}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {listing.location ?? 'Disponibil în stoc' }
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">
                {priceFormatter.format(listing.priceValue)}
              </p>
              <p className="text-xs text-muted-foreground uppercase">{listing.priceCurrency}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {listing.year ?? '—'}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="h-4 w-4" />
              {formatMileage(listing.mileageKm)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Fuel className="h-4 w-4" />
              {listing.fuelType ?? '—'}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings className="h-4 w-4" />
              {listing.gearbox ?? '—'}
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" variant="default" asChild>
              <Link to={`/car/${listing.id}`}>Detalii</Link>
            </Button>
            <Button className="flex-1" variant="outline" asChild>
              <Link to={`/car/${listing.id}?action=contact`}>Contactează</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Car className="text-accent" />
            Cumpără Mașina Perfectă
          </h1>
          <p className="text-xl text-muted-foreground">
            Descoperă selecția noastră de vehicule second-hand de calitate
          </p>
        </div>

        {/* Quick Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            variant={activeFuel === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFuel('all')}
            className="w-full sm:w-auto"
          >
            Toate combustibilele
          </Button>
          {availableFuelFilters.map((fuel) => (
            <Button
              key={fuel}
              variant={activeFuel === fuel ? 'default' : 'outline'}
              onClick={() => setActiveFuel(fuel)}
              className="w-full sm:w-auto"
            >
              {fuel}
            </Button>
          ))}
        </div>

        {/* Car Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 w-full bg-muted" />
                <CardHeader>
                  <div className="h-5 w-3/4 bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map(renderCard)}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-automotive rounded-2xl p-8 shadow-automotive">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Nu găsești ce cauți?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Explorează opțiunile noastre de mașini la comandă sau vinde-ne vehiculul tău actual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg" className="shadow-glow">
              <Link to="/masini-la-comanda">
                Mașini la Comandă
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-glow"
            >
              <Link to="/vinde">
                Vinde Mașina Ta
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cumpara;
