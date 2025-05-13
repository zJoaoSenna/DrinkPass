import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Definindo o tipo para os restaurantes
interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  logo_url: string;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        // Buscar dados da tabela 'restaurants' no Supabase
        const { data, error } = await supabase
          .from('restaurants')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transformar os dados para incluir URLs públicas
          const restaurantsWithPublicUrls = data.map(restaurant => {
            // Se o logo_url já for uma URL completa, use-a diretamente
            if (restaurant.logo_url && restaurant.logo_url.startsWith('http')) {
              return restaurant;
            }
            
            // Caso contrário, gere uma URL pública para o arquivo no Storage
            const { data: publicUrlData } = supabase.storage
              .from('restaurantlogos')
              .getPublicUrl(restaurant.logo_url);
              
            return {
              ...restaurant,
              logo_url: publicUrlData.publicUrl
            };
          });
          
          setRestaurants(restaurantsWithPublicUrls);
        }
      } catch (error) {
        console.error('Erro ao buscar restaurantes:', error);
        setError('Não foi possível carregar os restaurantes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filtra os restaurantes para mostrar apenas 3 na página principal
  const displayedRestaurants = isHomePage ? restaurants.slice(0, 3) : restaurants;

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nossos Restaurantes Parceiros
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Descubra uma seleção dos melhores restaurantes que aceitam o DrinkPass.
          </p>
        </div>
        
        {loading ? (
          <div className="text-center mt-16">
            <p>Carregando restaurantes...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-16 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {displayedRestaurants.map((restaurant) => (
              <article key={restaurant.id} className="flex flex-col items-start">
                <div className="relative w-full">
                  <img
                    src={restaurant.logo_url}
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
        )}
        
        {isHomePage && restaurants.length > 3 && (
          <div className="mt-16 text-center">
            <Link
              to="/restaurants"
              className="text-sm font-semibold leading-6 text-primary"
            >
              Ver todos os restaurantes <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Restaurants;