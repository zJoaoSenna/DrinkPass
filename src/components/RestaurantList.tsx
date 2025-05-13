import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  logo_url?: string;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name, location, cuisine, logo_url');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setRestaurants(data);
        }
      } catch (error: any) {
        console.error('Erro ao buscar restaurantes:', error);
        setError('Não foi possível carregar os restaurantes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Restaurantes</h1>
        <Link to="/admin/restaurants/new">
          <Button>Adicionar Novo</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-8">Carregando restaurantes...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : restaurants.length === 0 ? (
        <p className="text-center py-8">Nenhum restaurante cadastrado.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cozinha
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {restaurant.logo_url && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={restaurant.logo_url} 
                            alt={restaurant.name} 
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {restaurant.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {restaurant.cuisine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/restaurants/edit/${restaurant.id}`}>
                      <Button variant="outline" size="sm" className="mr-2">
                        Editar
                      </Button>
                    </Link>
                    <Link to={`/restaurants/${restaurant.id}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        Visualizar
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;