import { useState } from 'react';
import { Search, DollarSign, Calendar, Settings, Send } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const MasiniLaComanda = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    fuelType: '',
    transmission: '',
    mileageMax: '',
    color: '',
    features: [] as string[],
    additionalRequirements: '',
    contactName: '',
    email: '',
    phone: '',
    urgency: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cererea ta a fost trimisă cu succes! Te vom contacta în cel mai scurt timp.');
    console.log('Form submitted:', formData);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const features = [
    'Aer condiționat',
    'Geamuri electrice',
    'Sistem de navigație',
    'Bluetooth',
    'Scaune încălzite',
    'Senzori de parcare',
    'Camera marsarier',
    'Plafon panoramic',
    'Jante aliaj',
    'Lumini LED'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Search className="text-accent" />
            Mașini la Comandă
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nu găsești ce cauți în stocul nostru? Completează formularul de mai jos cu cerințele tale și noi vom găsi mașina perfectă pentru tine!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Process Steps */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  Cum Funcționează
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Completezi Formularul</h3>
                    <p className="text-sm text-muted-foreground">Specifici toate detaliile dorite pentru mașina ideală</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Căutăm Pentru Tine</h3>
                    <p className="text-sm text-muted-foreground">Echipa noastră caută vehiculul perfect în rețeaua noastră</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Te Contactăm</h3>
                    <p className="text-sm text-muted-foreground">În maxim 48h îți prezentăm opțiunile disponibile</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detaliile Mașinii Dorite</CardTitle>
                <CardDescription>
                  Cu cât oferi mai multe detalii, cu atât mai precis putem căuta pentru tine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vehicle Details */}
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
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        placeholder="ex: Seria 3, A4, C-Class"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yearFrom">An fabricație de la</Label>
                      <Select value={formData.yearFrom} onValueChange={(value) => setFormData(prev => ({...prev, yearFrom: value}))}>
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
                      <Label htmlFor="yearTo">An fabricație până la</Label>
                      <Select value={formData.yearTo} onValueChange={(value) => setFormData(prev => ({...prev, yearTo: value}))}>
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
                  </div>

                  {/* Price Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priceFrom">Preț de la (€)</Label>
                      <Input
                        id="priceFrom"
                        type="number"
                        placeholder="10000"
                        value={formData.priceFrom}
                        onChange={(e) => setFormData(prev => ({...prev, priceFrom: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="priceTo">Preț până la (€)</Label>
                      <Input
                        id="priceTo"
                        type="number"
                        placeholder="30000"
                        value={formData.priceTo}
                        onChange={(e) => setFormData(prev => ({...prev, priceTo: e.target.value}))}
                      />
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fuelType">Combustibil</Label>
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
                      <Label htmlFor="transmission">Transmisie</Label>
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

                    <div>
                      <Label htmlFor="mileageMax">Kilometraj maxim</Label>
                      <Input
                        id="mileageMax"
                        type="number"
                        placeholder="100000"
                        value={formData.mileageMax}
                        onChange={(e) => setFormData(prev => ({...prev, mileageMax: e.target.value}))}
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <Label htmlFor="color">Culoare preferată</Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({...prev, color: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alege culoarea" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="negru">Negru</SelectItem>
                        <SelectItem value="alb">Alb</SelectItem>
                        <SelectItem value="gri">Gri</SelectItem>
                        <SelectItem value="argintiu">Argintiu</SelectItem>
                        <SelectItem value="albastru">Albastru</SelectItem>
                        <SelectItem value="rosu">Roșu</SelectItem>
                        <SelectItem value="other">Altă culoare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Features */}
                  <div>
                    <Label className="text-base font-semibold">Dotări dorite</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={formData.features.includes(feature)}
                            onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                          />
                          <Label htmlFor={feature} className="text-sm font-normal">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div>
                    <Label htmlFor="additionalRequirements">Cerințe suplimentare</Label>
                    <Textarea
                      id="additionalRequirements"
                      placeholder="Alte detalii importante: istoric service, numărul de proprietari anteriori, etc."
                      value={formData.additionalRequirements}
                      onChange={(e) => setFormData(prev => ({...prev, additionalRequirements: e.target.value}))}
                      rows={4}
                    />
                  </div>

                  {/* Contact Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Datele Tale de Contact</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">Numele complet *</Label>
                        <Input
                          id="contactName"
                          placeholder="Ioan Popescu"
                          value={formData.contactName}
                          onChange={(e) => setFormData(prev => ({...prev, contactName: e.target.value}))}
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

                    <div className="mt-4">
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

                    <div className="mt-4">
                      <Label htmlFor="urgency">Urgența cererii</Label>
                      <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cât de urgent ai nevoie?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Foarte urgent (în următoarele zile)</SelectItem>
                          <SelectItem value="medium">Mediu (în următoarele 2 săptămâni)</SelectItem>
                          <SelectItem value="low">Nu mă grăbesc (când găsiți ceva potrivit)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-6">
                    <Button type="submit" size="lg" className="px-8">
                      <Send className="w-4 h-4 mr-2" />
                      Trimite Cererea
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gradient-automotive rounded-2xl p-8 text-center shadow-automotive">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            De Ce Să Alegi Serviciul Nostru de Comandă?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-primary-foreground">
              <DollarSign className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-2">Fără Costuri Suplimentare</h3>
              <p className="text-sm text-primary-foreground/80">Serviciul de căutare este complet gratuit</p>
            </div>
            <div className="text-primary-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-2">Rețea Extinsă</h3>
              <p className="text-sm text-primary-foreground/80">Accesăm sute de dealeri din toată Europa</p>
            </div>
            <div className="text-primary-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-2">Răspuns Rapid</h3>
              <p className="text-sm text-primary-foreground/80">Te contactăm în maxim 48 de ore</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MasiniLaComanda;