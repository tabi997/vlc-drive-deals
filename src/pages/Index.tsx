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
      <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-32">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center text-primary-foreground">
          <h1 className="text-4xl font-bold leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
            VLC <span className="text-accent">CAR DEALS</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed drop-shadow-md sm:text-lg md:text-xl">
            Găsește mașina perfectă din selecția noastră premium de vehicule second-hand verificate și garantate.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
              <Link to="/cumpara">
                Vezi Mașinile <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary"
            >
              <Link to="/vinde">
                Vinde Mașina Ta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              De Ce Să Alegi VLC Car Deals?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Suntem mai mult decât un dealer auto - suntem partenerii tăi de încredere în călătoria către mașina ideală.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group h-full text-center transition-smooth hover:shadow-card-custom">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-accent p-4 transition-transform group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Carousel */}
      <FeaturedCarsCarousel />

      {/* Services Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center sm:mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Serviciile Noastre
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
              Soluții complete pentru toate nevoile tale auto
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <Card className="h-full transition-smooth hover:shadow-card-custom">
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

            <Card className="h-full transition-smooth hover:shadow-card-custom">
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

            <Card className="h-full transition-smooth hover:shadow-card-custom">
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
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 space-y-3 text-center sm:mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Ce Spun Clienții Noștri</h2>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
              Peste 5000 de șoferi mulțumiți ne recomandă
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="h-full transition-smooth hover:shadow-card-custom">
                <CardHeader>
                  <div className="mb-2 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`${testimonial.name}-${i}`} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardTitle className="text-lg text-foreground sm:text-xl">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground italic sm:text-base">
                    „{testimonial.text}”
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-automotive py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Gata să Găsești Mașina Perfectă?
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-2xl text-base text-primary-foreground/80 sm:text-lg md:text-xl">
            Începe călătoria către următorul tău vehicul cu cel mai de încredere dealer din România
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto shadow-glow">
              <Link to="/cumpara">
                Explorează Mașinile <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary"
            >
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
