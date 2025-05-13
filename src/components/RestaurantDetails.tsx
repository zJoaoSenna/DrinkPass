import { MapPin, Phone, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface RestaurantDetailsProps {
  name: string;
  location: string;
  cuisine: string;
  address: string;
  phone: string;
  description: string;
  promotion: string;
  availability: {
    [key: string]: {
      morning?: string;
      evening?: string;
    };
  };
  features?: string[];
  logo_url?: string;
}

const defaultAvailability = {
  'Hoje, quinta': { evening: '17:00 - 22:00' },
  'Sexta': { morning: '11:30 - 14:30' },
  'Sábado': { morning: '11:30 - 16:00' },
  'Domingo': { morning: '11:30 - 16:00' },
  'Segunda': {},
  'Terça': { morning: '11:30 - 14:30', evening: '17:00 - 22:00' },
  'Quarta': { evening: '17:00 - 22:00' },
};

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID do restaurante não fornecido');
        }
        
        // Buscar dados do restaurante específico no Supabase
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transformar os dados para o formato esperado pelo componente
          const restaurantData: RestaurantDetailsProps = {
            name: data.name || 'Nome não disponível',
            location: data.location || 'Localização não disponível',
            cuisine: data.cuisine || 'Tipo de cozinha não disponível',
            address: data.address || 'Endereço não disponível',
            phone: data.phone || 'Telefone não disponível',
            description: data.description || 'Descrição não disponível',
            promotion: data.promotion || 'Promoção não disponível',
            availability: data.availability || defaultAvailability,
            features: data.features || [],
            logo_url: data.logo_url || '/assacabrasa-logo.jpg', // Imagem padrão se não houver logo
          };
          
          setRestaurant(restaurantData);
        } else {
          throw new Error('Restaurante não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do restaurante:', error);
        setError('Não foi possível carregar os detalhes do restaurante. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Carregando detalhes do restaurante...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error || 'Restaurante não encontrado'}</p>
          <Link to="/restaurants" className="text-primary hover:underline">
            Voltar para lista de restaurantes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Dark Background */}
      <div className="bg-black py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-48 mx-auto object-contain"
              />
              <h1 className="text-white text-2xl font-bold mt-4">{restaurant.name}</h1>
              <p className="text-white/80 mt-2 text-sm italic">Localização: {restaurant.location}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-white mb-4">{restaurant.promotion}</h2>
              <Link
                to="/membership"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Assinar DrinkPass
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="text-primary" />
                  Endereço
                </h3>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="text-primary" />
                  Contato
                </h3>
                <p className="text-gray-600">{restaurant.phone}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sobre o estabelecimento</h3>
                <p className="text-gray-600">{restaurant.description}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="text-primary" />
                  Dias e Horários Disponíveis
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 border-b text-left font-medium">Dia</th>
                        <th className="p-3 border-b text-left font-medium">Manhã/Tarde</th>
                        <th className="p-3 border-b text-left font-medium">Noite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(restaurant.availability).map(([day, times]) => (
                        <tr key={day} className="border-b last:border-b-0">
                          <td className="p-3 font-medium">
                            {day}
                          </td>
                          <td className="p-3">
                            {times.morning || '-'}
                          </td>
                          <td className="p-3">
                            {times.evening || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Cozinha</h3>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {restaurant.cuisine}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Características Adicionais</h3>
                {restaurant.features && restaurant.features.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600">
                    {restaurant.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Nenhuma característica adicional disponível.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;