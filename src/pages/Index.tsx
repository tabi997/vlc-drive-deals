import { Link } from 'react-router-dom';
import { Car, Award, Users, Shield, ArrowRight, Star } from 'lucide-react';
import Header from '@/components/Header';
import FeaturedCarsCarousel from '@/components/FeaturedCarsCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import heroImage from '@/assets/hero-cars.jpg';

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: 'Garanție de Calitate',
      description: 'Toate vehiculele sunt inspectate riguros și vin cu garanție extinsă.'
    },
    {
      icon: Award,
      title: 'Experiență de 15+ Ani',
      description: 'Suntem lideri pe piața auto second-hand din România.'
    },
    {
      icon: Users,
      title: 'Peste 5000 Clienți Mulțumiți',
      description: 'O comunitate mare de șoferi care ne-au ales pentru calitate.'
    }
  ];

  const testimonials = [
    {
      name: 'Ana Popescu',
      rating: 5,
      text: 'Serviciu excelent! Mi-am găsit mașina perfectă la un preț incredibil de bun.'
    },
    {
      name: 'Mihai Ionescu',
      rating: 5,
      text: 'Transparență totală în proces și suport complet. Recomand cu încredere!'
    },
    {
      name: 'Elena Radu',
      rating: 5,
      text: 'Au găsit exact mașina pe care o doream prin serviciul de comandă personalizată.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            VLC <span className="text-accent">CAR DEALS</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Găsește mașina perfectă din selecția noastră premium de vehicule second-hand verificate și garantate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow text-lg px-8 py-6">
              <Link to="/cumpara">
                Vezi Mașinile <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6">
              <Link to="/vinde">
                Vinde Mașina Ta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              De Ce Să Alegi VLC Car Deals?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Suntem mai mult decât un dealer auto - suntem partenerii tăi de încredere în călătoria către mașina ideală.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card-custom transition-smooth group">
                <CardHeader className="pb-4">
                  <div className="mx-auto bg-gradient-accent p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce">
                    <feature.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Carousel */}
      <FeaturedCarsCarousel />

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Serviciile Noastre
            </h2>
            <p className="text-xl text-muted-foreground">
              Soluții complete pentru toate nevoile tale auto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-card-custom transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Car className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl">Cumpără</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Explorează colecția noastră de mașini second-hand verificate și garantate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/cumpara">Vezi Mașinile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-custom transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl">Mașini la Comandă</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Nu găsești ce cauți? Completează formularul și noi o vom găsi pentru tine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/masini-la-comanda">Comandă Personalizat</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-custom transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl">Vinde</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Vinde-ne mașina ta rapid și la cel mai bun preț de pe piață
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/vinde">Solicită Evaluare</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ce Spun Clienții Noștri
            </h2>
            <p className="text-xl text-muted-foreground">
              Peste 5000 de șoferi mulțumiți ne recomandă
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-card-custom transition-smooth">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-automotive">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Gata să Găsești Mașina Perfectă?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Începe călătoria către următorul tău vehicul cu cel mai de încredere dealer din România
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="shadow-glow">
              <Link to="/cumpara">
                Explorează Mașinile <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/masini-la-comanda">
                Comandă Personalizat
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
