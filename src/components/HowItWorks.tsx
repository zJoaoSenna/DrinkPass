import { Beer, Wine, PartyPopper, Users } from 'lucide-react';

const features = [
  {
    icon: Beer,
    title: 'Rodadas Duplas',
    description: 'Aproveite rodadas duplas em diversos estabelecimentos parceiros.',
  },
  {
    icon: Wine,
    title: 'Rolha Gratuita',
    description: 'Traga seu vinho favorito sem taxa de rolha em bares selecionados.',
  },
  {
    icon: PartyPopper,
    title: 'Descontos Progressivos',
    description: 'Quanto mais você aproveita, mais você economiza.',
  },
  {
    icon: Users,
    title: 'Conecte-se',
    description: 'Participe de promoções exclusivas e eventos especiais.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
            Como Funciona
          </h2>
          <p className="text-lg leading-8 text-gray-600 font-medium">
            Com o <span className="text-primary-drink">Drink</span>
            <span className="text-primary-pass">Pass</span>, você terá acesso a rodadas 
            duplas em restaurantes, bares e butecos parceiros, além de se conectar com outras 
            promoções de bebidas, como rolha gratuita, descontos progressivos, etc.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative p-6 bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-6 bg-primary/10 rounded-lg">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 