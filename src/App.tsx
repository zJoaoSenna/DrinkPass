import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Features from './components/Features';
import Restaurants from './components/Restaurants';
import Membership from './components/Membership';
import HowItWorks from './components/HowItWorks';
import RestaurantDetails from './components/RestaurantDetails';
import RestaurantList from './components/RestaurantList';
import RestaurantRegistrationForm from './components/RestaurantRegistrationForm';
import Checkout from './components/Checkout';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <>
                <Hero />
                <Features />
                <HowItWorks />
                <Restaurants />
                <Membership />
              </>
            }
          />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurants/:id" element={<RestaurantDetails />} />
          <Route path="membership" element={<Membership />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<div>Sobre</div>} />
          <Route path="contact" element={<Contact />} />
          <Route path="register-restaurant" element={<RestaurantRegistrationForm />} />
          
          {/* Add all checkout routes */}
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/payment" element={<PaymentPage />} />
          <Route path="checkout/success" element={<PaymentSuccess />} />
        </Route>
        
        {/* Rotas de administração de restaurantes */}
        <Route path="/admin/restaurants" element={<RestaurantList />} />
        <Route path="/admin/restaurants/new" element={<RestaurantRegistrationForm />} />
        <Route path="/admin/restaurants/edit/:id" element={<RestaurantRegistrationForm isEditMode={true} />} />
      </Routes>
    </Router>
  );
}

export default App;
