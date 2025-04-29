import { Link } from 'react-router-dom';

const restaurants = [
  {
    id: 1,
    name: 'Assacabrasa',
    cuisine: 'Churrascaria',
    location: 'Lourdes, BH',
    image: 'public/assacabrasa-logo.jpg',
  },
  {
    id: 2,
    name: 'Bar do Afonso',
    cuisine: 'Comida de Buteco',
    location: 'Belo Horizonte, MG',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 3,
    name: 'A Casa do Chopp',
    cuisine: 'Brasileira',
    location: 'Belo Horizonte, MG',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
];

const Restaurants = () => {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nossos Restaurantes Parceiros
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Descubra uma seleção dos melhores restaurantes que aceitam o Duo Gourmet.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <article key={restaurant.id} className="flex flex-col items-start">
              <div className="relative w-full">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <span className="text-gray-500">{restaurant.cuisine}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{restaurant.location}</span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link to={`/restaurants/${restaurant.id}`}>
                      <span className="absolute inset-0" />
                      {restaurant.name}
                    </Link>
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            to="/restaurants"
            className="text-sm font-semibold leading-6 text-primary"
          >
            Ver todos os restaurantes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Restaurants; 