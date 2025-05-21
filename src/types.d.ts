// Define the FormData interface for RestaurantRegistrationForm
interface FormData {
  name: string;
  features: string[];
  location: string;
  cuisine: string;
  address: string;
  phone: string;
  description: string;
  promotion: string;
  logo?: FileList;
  availability?: any;
}