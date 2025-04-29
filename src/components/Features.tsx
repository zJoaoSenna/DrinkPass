import { Beer, MapPin, CreditCard, Gift } from 'lucide-react';

const features = [
  {
    name: 'Estabelecimentos Parceiros',
    description: 'Mais de 1.000 bares em todo o Brasil para você escolher.',
    icon: Beer,
  },
  {
    name: 'Válido em Todo o Brasil',
    description: 'Use seu voucher em qualquer bar da rede, em qualquer cidade.',
    icon: MapPin,
  },
  {
    name: 'Pagamento Único',
    description: 'Pague apenas uma vez e aproveite drinks incríveis durante todo o ano.',
    icon: CreditCard,
  },
  {
    name: 'Presente Perfeito',
    description: 'Presenteie alguém especial com experiências únicas em bares.',
    icon: Gift,
  },
];

const Features = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Por que escolher o DrinkPass?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Descubra os benefícios exclusivos que tornam o DrinkPass a melhor escolha para quem ama bons drinks.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Features; 