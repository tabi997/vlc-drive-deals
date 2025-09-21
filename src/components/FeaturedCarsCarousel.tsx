import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Eye, Calendar, Fuel, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

// Mock data for featured cars (subset of main car data)
const featuredCars = [
  {
    id: 1,
    make: 'BMW',
    model: 'Seria 3',
    year: 2019,
    price: 28500,
    mileage: 95000,
    fuel: 'Diesel',
    transmission: 'Automată',
    color: 'Negru',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 2,
    make: 'Audi',
    model: 'A4',
    year: 2020,
    price: 32000,
    mileage: 67000,
    fuel: 'Benzină',
    transmission: 'Manuală',
    color: 'Alb',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 3,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    price: 45000,
    mileage: 45000,
    fuel: 'Hibrid',
    transmission: 'Automată',
    color: 'Argintiu',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 5,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 26000,
    mileage: 78000,
    fuel: 'Hibrid',
    transmission: 'Automată',
    color: 'Albastru',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  }
];

const FeaturedCarsCarousel = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (carId: number) => {
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Mașini Recomandate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecția noastră de vehicule premium, verificate și garantate
          </p>
        </div>

        <div className="relative">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredCars.map((car) => (
                <CarouselItem key={car.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden hover:shadow-card-custom transition-smooth group h-full">
                    <div className="relative">
                      <img 
                        src={car.image} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-smooth cursor-pointer"
                        onClick={() => window.location.href = `/car/${car.id}`}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(car.id);
                          }}
                          className="p-2 bg-card/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          <Heart 
                            className={`h-4 w-4 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="p-2 bg-card/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          <Link to={`/car/${car.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                        {car.year}
                      </Badge>
                      {car.featured && (
                        <Badge className="absolute bottom-4 left-4 bg-destructive text-destructive-foreground animate-pulse">
                          Recomandat
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {car.make} {car.model}
                          </h3>
                          <p className="text-muted-foreground">{car.color}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent">
                            €{car.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {car.mileage.toLocaleString()} km
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Fuel className="h-4 w-4" />
                          {car.fuel}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <Settings className="h-4 w-4" />
                          {car.transmission}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1" variant="default">
                          Contactează
                        </Button>
                        <Button variant="outline" className="flex-1" asChild>
                          <Link to={`/car/${car.id}`}>
                            Detalii
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground transition-smooth" />
            <CarouselNext className="hidden md:flex -right-12 bg-card/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground transition-smooth" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="hover:bg-accent hover:text-accent-foreground">
            <Link to="/cumpara">
              Vezi Toate Mașinile
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarsCarousel;