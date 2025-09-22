import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Fuel, Calendar, Settings, Heart, Eye } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for cars
const mockCars = [
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
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    make: 'Volkswagen',
    model: 'Golf',
    year: 2018,
    price: 18500,
    mileage: 120000,
    fuel: 'Benzină',
    transmission: 'Manuală',
    color: 'Roșu',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    make: 'Ford',
    model: 'Focus',
    year: 2019,
    price: 16500,
    mileage: 98000,
    fuel: 'Benzină',
    transmission: 'Manuală',
    color: 'Gri',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const Cumpara = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filter, setFilter] = useState('all');

  const toggleFavorite = (carId: number) => {
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const filteredCars = filter === 'all' 
    ? mockCars 
    : mockCars.filter(car => car.make.toLowerCase() === filter);

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

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Toate
          </Button>
          <Button 
            variant={filter === 'bmw' ? 'default' : 'outline'}
            onClick={() => setFilter('bmw')}
          >
            BMW
          </Button>
          <Button 
            variant={filter === 'audi' ? 'default' : 'outline'}
            onClick={() => setFilter('audi')}
          >
            Audi
          </Button>
          <Button 
            variant={filter === 'mercedes-benz' ? 'default' : 'outline'}
            onClick={() => setFilter('mercedes-benz')}
          >
            Mercedes-Benz
          </Button>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-card-custom transition-smooth group">
              <div className="relative">
                <Link to={`/car/${car.id}`}>
                  <img 
                    src={car.image} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-smooth cursor-pointer"
                  />
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleFavorite(car.id)}
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
          ))}
        </div>

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
