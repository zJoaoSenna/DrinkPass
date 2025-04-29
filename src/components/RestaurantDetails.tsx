import { MapPin, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const RestaurantDetails = ({
  cuisine = "Churrascaria",
  address = "R. Rio de Janeiro, 2107 - Lourdes, Belo Horizonte - MG",
  phone = "(31) 99188-3570",
  description = "Tradição em carnes nobres desde 1993. Ambiente aconchegante e serviço de excelência.",
  promotion = "Rodada dupla em drinks e chopps!",
  availability = defaultAvailability,
}: Partial<RestaurantDetailsProps>) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Dark Background */}
      <div className="bg-black py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/public/assacabrasa-logo.jpg"
                alt="Assacabrasa"
                className="h-32 mx-auto"
              />
              <p className="text-white/80 mt-2 text-sm italic">Desde 1993</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-white mb-4">{promotion}</h2>
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
                <p className="text-gray-600">{address}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="text-primary" />
                  Contato
                </h3>
                <p className="text-gray-600">{phone}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sobre o estabelecimento</h3>
                <p className="text-gray-600">{description}</p>
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
                      {Object.entries(availability).map(([day, times]) => (
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
                  {cuisine}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails; 