import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Calendar, 
  Fuel, 
  Settings, 
  Gauge, 
  Palette, 
  Shield, 
  CheckCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

// Extended mock car data
const mockCarDetails = {
  1: {
    id: 1,
    make: 'BMW',
    model: 'Seria 3',
    year: 2019,
    price: 28500,
    mileage: 95000,
    fuel: 'Diesel',
    transmission: 'Automată',
    color: 'Negru',
    engine: '2.0L Diesel',
    power: '190 CP',
    doors: 4,
    seats: 5,
    category: 'Sedan',
    vin: 'WBAPB9C50AD123456',
    firstRegistration: '15.03.2019',
    lastService: '12.01.2024',
    nextTechnicalInspection: '15.03.2025',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Climatizare automată',
      'Navigație GPS',
      'Scaune din piele',
      'Sistem audio premium',
      'Senzori parcare',
      'Camera marsarier',
      'Cruise control',
      'Xenon'
    ],
    description: 'BMW Seria 3 în stare excelentă, revizii la zi, fără accidente. Vehiculul a fost întreținut meticulos și prezintă un istoric complet de service. Perfectă pentru cei care caută un sedan premium cu performanțe excepționale.',
    warranty: '12 luni garanție',
    financing: true,
    exchange: true
  },
  2: {
    id: 2,
    make: 'Audi',
    model: 'A4',
    year: 2020,
    price: 32000,
    mileage: 67000,
    fuel: 'Benzină',
    transmission: 'Manuală',
    color: 'Alb',
    engine: '2.0L TFSI',
    power: '190 CP',
    doors: 4,
    seats: 5,
    category: 'Sedan',
    vin: 'WAUZZZ8K5DA123456',
    firstRegistration: '10.07.2020',
    lastService: '20.02.2024',
    nextTechnicalInspection: '10.07.2025',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Virtual Cockpit',
      'MMI Navigation',
      'Scaune sportive',
      'LED Matrix',
      'Asistent parcare',
      'Quattro AWD',
      'Sport diferențial'
    ],
    description: 'Audi A4 cu echipare completă, în stare impecabilă. Vehiculul beneficiază de toate opțiunile premium și a fost condus responsabil.',
    warranty: '12 luni garanție',
    financing: true,
    exchange: true
  }
  // Add more cars as needed
};

const CarDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const carId = Number(id);
  const car = mockCarDetails[carId as keyof typeof mockCarDetails];

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Mașina nu a fost găsită</h1>
          <p className="text-muted-foreground mb-8">Anunțul pe care îl căutați nu există sau a fost șters.</p>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Acasă</Link>
          <span>/</span>
          <Link to="/cumpara" className="hover:text-foreground transition-colors">Cumpără</Link>
          <span>/</span>
          <span className="text-foreground">{car.make} {car.model}</span>
        </div>

        {/* Back Button */}
        <Button variant="outline" asChild className="mb-6">
          <Link to="/cumpara">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la Lista de Mașini
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={car.images[currentImageIndex]} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-card/80 backdrop-blur-sm"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-card/80 backdrop-blur-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {car.year}
                </Badge>
              </div>
              
              {/* Thumbnail Gallery */}
              {car.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {car.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-smooth ${
                          currentImageIndex === index ? 'border-accent' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${car.make} ${car.model} ${index + 1}`}
                          className="w-20 h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Car Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-2xl">Detalii Tehnice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Motor</p>
                      <p className="font-medium">{car.engine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Putere</p>
                      <p className="font-medium">{car.power}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kilometraj</p>
                      <p className="font-medium">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Combustibil</p>
                      <p className="font-medium">{car.fuel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transmisie</p>
                      <p className="font-medium">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Culoare</p>
                      <p className="font-medium">{car.color}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Descriere</h3>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Dotări</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{car.make} {car.model}</CardTitle>
                    <p className="text-muted-foreground">{car.year} • {car.color}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-accent">€{car.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">TVA inclus</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {car.warranty && (
                    <div className="flex items-center gap-2 text-accent">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">{car.warranty}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {car.financing && (
                      <Badge variant="secondary">Finanțare</Badge>
                    )}
                    {car.exchange && (
                      <Badge variant="secondary">Accept schimb</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contactează Vânzătorul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Sună Acum
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Trimite Mesaj
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </CardContent>
            </Card>

            {/* Vehicle History */}
            <Card>
              <CardHeader>
                <CardTitle>Istoric Vehicul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prima înmatriculare</p>
                  <p className="font-medium">{car.firstRegistration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ultimul service</p>
                  <p className="font-medium">{car.lastService}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Următoarea ITP</p>
                  <p className="font-medium">{car.nextTechnicalInspection}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-mono text-xs">{car.vin}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarDetail;