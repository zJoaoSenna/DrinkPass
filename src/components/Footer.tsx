import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const navigation = {
  main: [
    { name: 'Sobre', href: '/about' },
    { name: 'Restaurantes', href: '/restaurants' },
    { name: 'Planos', href: '/membership' },
    { name: 'Como Funciona', href: '/how-it-works' },
    { name: 'Contato', href: '/contact' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/joaopedro_senna/',
      icon: Instagram,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                to={item.href}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} DrinkPass. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;