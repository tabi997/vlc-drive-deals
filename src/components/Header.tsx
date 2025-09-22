import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Acasă', path: '/' },
    { name: 'Cumpără', path: '/cumpara' },
    { name: 'Mașini la Comandă', path: '/masini-la-comanda' },
    { name: 'Vinde', path: '/vinde' },
  ];

  return (
    <header className="bg-gradient-automotive shadow-automotive sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-accent p-2 rounded-lg shadow-glow group-hover:scale-110 transition-smooth">
              <Car className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground sm:text-2xl">VLC CAR DEALS</h1>
              <p className="text-xs text-primary-foreground/80 sm:text-sm">Dealeri de încredere</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-smooth hover:bg-primary-foreground/10 ${
                  location.pathname === item.path
                    ? 'bg-accent text-accent-foreground shadow-glow'
                    : 'text-primary-foreground/90 hover:text-primary-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
                aria-label="Deschide meniul"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs border-l border-border/50 bg-background/95 backdrop-blur">
              <nav className="mt-10 flex flex-col gap-4">
                {navItems.map((item) => (
                  <SheetClose key={item.path} asChild>
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 text-base font-medium transition-smooth hover:bg-muted ${
                        location.pathname === item.path ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
