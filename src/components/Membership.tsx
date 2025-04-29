import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';

interface Plan {
  id: string;
  name: ReactNode;
  description: string;
  price: string;
  features: string[];
  popular: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: (
      <span>
        <span className="text-primary-drink">Drink</span>
        <span className="text-primary-pass">Pass</span>
      </span>
    ),
    description: 'O plano perfeito para os amantes de drinks',
    price: 'R$ 199,90',
    features: [
      'Drinks exclusivos',
      'Válido por 1 ano',
      'Mais de 1.000 bares',
      'Presente exclusivo',
      'App para iOS e Android',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: (
      <span>
        <span className="text-primary-drink">Drink</span>
        <span className="text-primary-pass">Pass</span>
        <span className="text-primary-drink"> Premium</span>
      </span>
    ),
    description: 'Para quem quer ainda mais benefícios',
    price: 'R$ 299,90',
    features: [
      'Drinks exclusivos',
      'Válido por 1 ano',
      'Mais de 1.000 bares',
      'Presente exclusivo',
      'App para iOS e Android',
      'Descontos especiais',
      'Atendimento prioritário',
    ],
    popular: false,
  },
];

const Membership = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Escolha seu Plano
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Encontre o plano perfeito para você e comece a aproveitar os melhores bares.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                plan.popular ? 'bg-primary/5' : ''
              }`}
            >
              <h3 className="text-lg font-semibold leading-8 text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  /ano
                </span>
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/checkout"
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.popular
                    ? 'bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:outline-primary'
                    : 'text-primary ring-1 ring-inset ring-primary hover:ring-primary/50'
                }`}
              >
                Comprar agora
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership; 