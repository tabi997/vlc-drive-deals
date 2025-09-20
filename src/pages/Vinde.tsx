import { useState } from 'react';
import { Upload, DollarSign, CheckCircle, Phone, Car, Send } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Vinde = () => {
  const [formData, setFormData] = useState({
    // Essential Vehicle Details
    brand: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    expectedPrice: '',
    additionalInfo: '',
    
    // Contact
    ownerName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Solicitarea de evaluare a fost trimisă! Te vom contacta în cel mai scurt timp pentru a programa o vizualizare.');
    console.log('Sell form submitted:', formData);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Cele Mai Bune Prețuri',
      description: 'Oferim evaluări competitive'
    },
    {
      icon: CheckCircle,
      title: 'Proces Rapid',
      description: 'Răspuns în 24 de ore'
    },
    {
      icon: Car,
      title: 'Fără Bătăi de Cap',
      description: 'Ne ocupăm de tot'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Upload className="text-accent" />
            Vinde-ne Mașina Ta
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Primește o ofertă rapidă în doar 3 pași simpli
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-card-custom transition-smooth">
              <CardHeader className="pb-4">
                <div className="mx-auto bg-gradient-accent p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <benefit.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simple Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Evaluare Gratuită</CardTitle>
              <CardDescription>
                Completează formularul pentru o evaluare profesională
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Basics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Car className="h-5 w-5 text-accent" />
                    Informații Mașină
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Marca *</Label>
                      <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({...prev, brand: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bmw">BMW</SelectItem>
                          <SelectItem value="audi">Audi</SelectItem>
                          <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                          <SelectItem value="volkswagen">Volkswagen</SelectItem>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="ford">Ford</SelectItem>
                          <SelectItem value="renault">Renault</SelectItem>
                          <SelectItem value="peugeot">Peugeot</SelectItem>
                          <SelectItem value="other">Altă marcă</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="ex: Seria 3, A4, Golf"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Anul *</Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({...prev, year: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege anul" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 25}, (_, i) => 2024 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mileage">Kilometraj *</Label>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="150000"
                        value={formData.mileage}
                        onChange={(e) => setFormData(prev => ({...prev, mileage: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="condition">Starea generală *</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({...prev, condition: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Cum evaluezi starea mașinii?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelenta">Excelentă - ca nouă</SelectItem>
                        <SelectItem value="foarte-buna">Foarte bună - mici defecte cosmetice</SelectItem>
                        <SelectItem value="buna">Bună - funcționează perfect</SelectItem>
                        <SelectItem value="satisfacatoare">Satisfăcătoare - necesită mici reparații</SelectItem>
                        <SelectItem value="necesita-reparatii">Necesită reparații importante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expectedPrice">Prețul așteptat (€) - opțional</Label>
                    <Input
                      id="expectedPrice"
                      type="number"
                      placeholder="25000"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData(prev => ({...prev, expectedPrice: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo">Alte detalii importante - opțional</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="ex: istoric service, modificări, probleme cunoscute, etc."
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData(prev => ({...prev, additionalInfo: e.target.value}))}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Datele Tale de Contact</h3>
                  
                  <div>
                    <Label htmlFor="ownerName">Numele complet *</Label>
                    <Input
                      id="ownerName"
                      placeholder="Ioan Popescu"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({...prev, ownerName: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        placeholder="0721 123 456"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ioan.popescu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Solicită Evaluarea Gratuită
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-3">
                    * Te vom contacta în maximum 24 de ore
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Cum Funcționează?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Completezi Formularul</h3>
              <p className="text-muted-foreground text-sm">Îți ia doar 2 minute să completezi informațiile esențiale</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Te Contactăm</h3>
              <p className="text-muted-foreground text-sm">Expertul nostru te sună pentru detalii și programează vizualizarea</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Primești Oferta</h3>
              <p className="text-muted-foreground text-sm">Îți facem o ofertă pe loc și, dacă accepți, plata este imediată</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-automotive rounded-2xl p-8 text-center shadow-automotive">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Preferi să Vorbești Direct?
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Sună-ne pentru o evaluare rapidă prin telefon
          </p>
          <Button variant="secondary" size="lg" className="shadow-glow">
            <Phone className="w-4 h-4 mr-2" />
            0721 123 VLC
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Vinde;