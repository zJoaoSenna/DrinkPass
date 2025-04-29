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
    id: 'monthly',
    name: 'Mensal',
    description: 'Assinatura mensal com flexibilidade.',
    price: 'R$ 89,90',
    features: [
      'Acesso a todos os bares',
      'Cancelamento a qualquer momento',
    ],
    popular: false,
  },
  {
    id: 'semiannual',
    name: 'Semestral',
    description: 'Assinatura semestral com desconto.',
    price: 'R$ 69,90',
    features: [
      'Acesso a todos os bares',
      'Cancelamento a qualquer momento',
    ],
    popular: false,
  },
  {
    id: 'annual',
    name: 'Anual',
    description: 'Assinatura anual com o melhor preço.',
    price: 'R$ 49,90',
    features: [
      'Acesso a todos os bares',
      'Cancelamento a qualquer momento',
      'Benefícios exclusivos',
    ],
    popular: true,
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
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {plans.map((plan) => (
    <div
      key={plan.id}
      className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
        plan.popular ? 'bg-primary/5' : ''
      }`}
    >
      <h3 className="text-lg font-semibold leading-8 text-gray-900">
        {plan.name}
        {plan.popular && (
          <span className="ml-2 text-sm text-green-500">Recomendado</span> // Adiciona "Recomendado" ao plano popular
        )}
      </h3>
      <p className="mt-4 text-sm leading-6 text-gray-600">
        {plan.description}
      </p>
      <p className="mt-6 flex items-baseline gap-x-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900">
          {plan.price}
        </span>
        <span className="text-sm font-semibold leading-6 text-gray-600">
          /mês
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
      <p className="mt-4 text-sm text-gray-600">
        Este plano é automaticamente renovado a cada {plan.id === 'annual' ? '12 meses' : plan.id === 'semiannual' ? '6 meses' : 'mês'}.
      </p>
      <Link
        to="/checkout"
        className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          plan.popular
            ? 'bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:outline-primary'
            : 'text-primary ring-1 ring-inset ring-primary hover:ring-primary/50'
        }`}
      >
        Assinar
      </Link>
    </div>
  ))}
      </div>
      </div>
    </section>
  );
};

export default Membership; 