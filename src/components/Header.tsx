import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/drinkpass-logo.png" alt="DrinkPass" className="h-8 w-8" />
            <span className="text-xl font-bold">
              <span className="text-primary-drink">Drink</span>
              <span className="text-primary-pass">Pass</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/restaurants" className="text-sm font-medium transition-colors hover:text-primary">
              Estabelecimentos
            </Link>
            <Link to="/membership" className="text-sm font-medium transition-colors hover:text-primary">
              Planos
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              Como Funciona
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              0
            </span>
          </button>
          <button className="p-2 hover:text-primary">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 