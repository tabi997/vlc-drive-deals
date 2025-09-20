import { Link, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Acasă', path: '/' },
    { name: 'Cumpără', path: '/cumpara' },
    { name: 'Mașini la Comandă', path: '/masini-la-comanda' },
    { name: 'Vinde', path: '/vinde' },
  ];

  return (
    <header className="bg-gradient-automotive shadow-automotive sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-accent p-2 rounded-lg shadow-glow group-hover:scale-110 transition-smooth">
              <Car className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">VLC CAR DEALS</h1>
              <p className="text-sm text-primary-foreground/80">Dealeri de încredere</p>
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
                    : 'text-primary-foreground hover:text-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button className="text-primary-foreground p-2 rounded-lg hover:bg-primary-foreground/10 transition-smooth">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;