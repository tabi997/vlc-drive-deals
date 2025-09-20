import { useState } from 'react';
import { Upload, DollarSign, CheckCircle, Camera, FileText, Phone } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Vinde = () => {
  const [formData, setFormData] = useState({
    // Vehicle Details
    brand: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    engineCapacity: '',
    power: '',
    color: '',
    bodyType: '',
    
    // Condition & History
    condition: '',
    accidents: '',
    owners: '',
    serviceHistory: false,
    technicalInspection: '',
    registration: '',
    
    // Documentation
    hasDocuments: [] as string[],
    additionalInfo: '',
    
    // Contact
    ownerName: '',
    email: '',
    phone: '',
    location: '',
    
    // Pricing
    expectedPrice: '',
    urgentSale: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Solicitarea de evaluare a fost trimisă! Te vom contacta în cel mai scurt timp pentru a programa o vizualizare.');
    console.log('Sell form submitted:', formData);
  };

  const handleDocumentChange = (document: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasDocuments: checked 
        ? [...prev.hasDocuments, document]
        : prev.hasDocuments.filter(d => d !== document)
    }));
  };

  const requiredDocuments = [
    'Certificat de înmatriculare',
    'Carte de identitate',
    'Carnet service',
    'Facturi service recente',
    'Asigurare valabilă',
    'ITP valabil'
  ];

  const whyChooseUs = [
    {
      icon: DollarSign,
      title: 'Cele Mai Bune Prețuri',
      description: 'Oferim evaluări competitive bazate pe piața actuală'
    },
    {
      icon: CheckCircle,
      title: 'Proces Rapid',
      description: 'Evaluare și finalizare în maxim 24 de ore'
    },
    {
      icon: FileText,
      title: 'Formalități Complete',
      description: 'Ne ocupăm de toate documentele necesare'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Upload className="text-accent" />
            Vinde-ne Mașina Ta
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Primește o ofertă competitivă pentru vehiculul tău. Completează formularul de mai jos pentru o evaluare profesională.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-card-custom transition-smooth">
                <CardHeader>
                  <div className="mx-auto bg-gradient-accent p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <item.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Process Steps */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Procesul de Vânzare
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Completezi Formularul</h3>
                    <p className="text-sm text-muted-foreground">Oferi toate detaliile importante despre mașină</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Evaluare Profesională</h3>
                    <p className="text-sm text-muted-foreground">Expertul nostru inspectează vehiculul</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Primești Oferta</h3>
                    <p className="text-sm text-muted-foreground">Îți facem o ofertă competitivă în 24h</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Plata Imediată</h3>
                    <p className="text-sm text-muted-foreground">Dacă accepți, primești banii pe loc</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detaliile Mașinii Tale</CardTitle>
                <CardDescription>
                  Cu cât oferi mai multe informații, cu atât mai precisă va fi evaluarea noastră
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Vehicle Info */}
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
                          <SelectItem value="other">Altă marcă</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="ex: Seria 3, A4, C-Class"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="year">Anul fabricației *</Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({...prev, year: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege anul" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 30}, (_, i) => 2024 - i).map(year => (
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

                    <div>
                      <Label htmlFor="color">Culoarea</Label>
                      <Input
                        id="color"
                        placeholder="Negru, Alb, etc."
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({...prev, color: e.target.value}))}
                      />
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fuelType">Combustibil *</Label>
                      <Select value={formData.fuelType} onValueChange={(value) => setFormData(prev => ({...prev, fuelType: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege tipul" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="benzina">Benzină</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hibrid">Hibrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="gpl">GPL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="transmission">Transmisia *</Label>
                      <Select value={formData.transmission} onValueChange={(value) => setFormData(prev => ({...prev, transmission: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege tipul" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manuala">Manuală</SelectItem>
                          <SelectItem value="automata">Automată</SelectItem>
                          <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="engineCapacity">Capacitatea motorului (cm³)</Label>
                      <Input
                        id="engineCapacity"
                        placeholder="2000"
                        value={formData.engineCapacity}
                        onChange={(e) => setFormData(prev => ({...prev, engineCapacity: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="power">Puterea (CP)</Label>
                      <Input
                        id="power"
                        placeholder="150"
                        value={formData.power}
                        onChange={(e) => setFormData(prev => ({...prev, power: e.target.value}))}
                      />
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Starea Vehiculului</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="condition">Starea generală *</Label>
                        <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({...prev, condition: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Evaluează starea" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excelenta">Excelentă</SelectItem>
                            <SelectItem value="foarte-buna">Foarte bună</SelectItem>
                            <SelectItem value="buna">Bună</SelectItem>
                            <SelectItem value="satisfacatoare">Satisfăcătoare</SelectItem>
                            <SelectItem value="necesita-reparatii">Necesită reparații</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="accidents">Istoric accidente</Label>
                        <Select value={formData.accidents} onValueChange={(value) => setFormData(prev => ({...prev, accidents: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="A fost în accidente?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nu">Nu, niciodată</SelectItem>
                            <SelectItem value="minore">Accidente minore</SelectItem>
                            <SelectItem value="majore">Accidente majore</SelectItem>
                            <SelectItem value="necunoscut">Nu știu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="owners">Numărul de proprietari</Label>
                        <Select value={formData.owners} onValueChange={(value) => setFormData(prev => ({...prev, owners: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Câți proprietari?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Primul proprietar</SelectItem>
                            <SelectItem value="2">Al doilea proprietar</SelectItem>
                            <SelectItem value="3">Al treilea proprietar</SelectItem>
                            <SelectItem value="4+">Peste 3 proprietari</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="technicalInspection">ITP valabil până</Label>
                        <Input
                          id="technicalInspection"
                          type="date"
                          value={formData.technicalInspection}
                          onChange={(e) => setFormData(prev => ({...prev, technicalInspection: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="serviceHistory"
                        checked={formData.serviceHistory}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, serviceHistory: checked as boolean}))}
                      />
                      <Label htmlFor="serviceHistory">
                        Are istoric complet de service la reprezentanță
                      </Label>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <Label className="text-base font-semibold">Documente disponibile</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {requiredDocuments.map((document) => (
                        <div key={document} className="flex items-center space-x-2">
                          <Checkbox
                            id={document}
                            checked={formData.hasDocuments.includes(document)}
                            onCheckedChange={(checked) => handleDocumentChange(document, checked as boolean)}
                          />
                          <Label htmlFor={document} className="text-sm font-normal">
                            {document}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <Label htmlFor="additionalInfo">Informații suplimentare</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Menționează orice alte detalii importante: modificări, probleme cunoscute, istoric reparații, etc."
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData(prev => ({...prev, additionalInfo: e.target.value}))}
                      rows={4}
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedPrice">Prețul așteptat (€)</Label>
                      <Input
                        id="expectedPrice"
                        type="number"
                        placeholder="25000"
                        value={formData.expectedPrice}
                        onChange={(e) => setFormData(prev => ({...prev, expectedPrice: e.target.value}))}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-8">
                      <Checkbox
                        id="urgentSale"
                        checked={formData.urgentSale}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, urgentSale: checked as boolean}))}
                      />
                      <Label htmlFor="urgentSale">
                        Vânzare urgentă (sunt flexibil cu prețul)
                      </Label>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Datele Tale de Contact</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                      <div>
                        <Label htmlFor="location">Localitatea *</Label>
                        <Input
                          id="location"
                          placeholder="București, Cluj-Napoca, etc."
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-6">
                    <Button type="submit" size="lg" className="px-8">
                      <Camera className="w-4 h-4 mr-2" />
                      Solicită Evaluarea
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-automotive rounded-2xl p-8 text-center shadow-automotive">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Preferi să Vorbești Direct cu Un Expert?
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Sună-ne acum pentru o evaluare rapidă prin telefon
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