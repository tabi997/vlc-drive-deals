import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Calendar, Fuel, Settings, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useListings } from '@/hooks/useListings';
import type { ListingSummary } from '@/types/listing';

const priceFormatter = new Intl.NumberFormat('ro-RO', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549921296-3c48d285d0c5?auto=format&fit=crop&w=1200&q=80';

const formatMileage = (value?: number | null) => {
  if (value == null) return '—';
  return `${new Intl.NumberFormat('ro-RO').format(value)} km`;
};

const FeaturedCarsCarousel = () => {
  const { data: listings = [] } = useListings();
  const [favorites, setFavorites] = useState<string[]>([]);

  const featuredCars = listings.slice(0, 6);

  const toggleFavorite = (carId: string) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  if (!featuredCars.length) {
    return null;
  }

  const renderCard = (car: ListingSummary) => (
    <Card key={car.id} className="group h-full overflow-hidden transition-smooth hover:shadow-card-custom">
      <div className="relative">
        <Link to={`/car/${car.id}`}>
          <img
            src={car.mainImage ?? FALLBACK_IMAGE}
            alt={car.title}
            loading="lazy"
            className="h-48 w-full cursor-pointer object-cover transition-smooth group-hover:scale-105 sm:h-56"
          />
        </Link>
        <div className="absolute right-4 top-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(car.id);
            }}
            className="bg-card/80 p-2 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Heart className={`h-4 w-4 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            asChild
            className="bg-card/80 p-2 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Link to={`/car/${car.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {car.year && (
          <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">{car.year}</Badge>
        )}
        {car.badges?.[0]?.label && (
          <Badge className="absolute bottom-4 left-4 bg-destructive text-destructive-foreground animate-pulse">
            {car.badges[0].label}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="pr-4">
            <h3 className="line-clamp-2 text-left text-base font-semibold text-foreground sm:text-lg">{car.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{car.location ?? 'Disponibil imediat'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{priceFormatter.format(car.priceValue)}</p>
            <p className="text-xs uppercase text-muted-foreground">{car.priceCurrency}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {car.year ?? '—'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            {formatMileage(car.mileageKm)}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            {car.fuelType ?? '—'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="h-4 w-4" />
            {car.gearbox ?? '—'}
          </div>
        </div>
        <Button asChild className="w-full" variant="outline">
          <Link to={`/car/${car.id}`}>Vezi detalii</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Mașini Recomandate</h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Selecția noastră de vehicule premium, verificate și garantate
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredCars.map((car) => (
                <CarouselItem key={car.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  {renderCard(car)}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 hidden border-border bg-card/80 backdrop-blur-sm transition-smooth hover:bg-accent hover:text-accent-foreground md:flex" />
            <CarouselNext className="-right-12 hidden border-border bg-card/80 backdrop-blur-sm transition-smooth hover:bg-accent hover:text-accent-foreground md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarsCarousel;
