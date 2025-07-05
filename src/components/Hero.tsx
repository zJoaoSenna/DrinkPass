import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Descubra os melhores bares com{' '}
            <span>
              <span className="text-primary-drink">Drink</span>
              <span className="text-primary-pass">Pass</span>
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Aproveite drinks incríveis em mais de 1.000 bares parceiros em todo o Brasil.
            Com o DrinkPass, você paga apenas uma vez e pode usar seu voucher em qualquer bar da rede.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/membership"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Conheça nossos planos
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Como funciona <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
    </section>
  );
};

export default Hero; 