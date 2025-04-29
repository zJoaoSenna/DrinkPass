import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Features from './components/Features';
import Restaurants from './components/Restaurants';
import Membership from './components/Membership';
import HowItWorks from './components/HowItWorks';
import RestaurantDetails from './components/RestaurantDetails';

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
          <Route path="contact" element={<div>Contato</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
