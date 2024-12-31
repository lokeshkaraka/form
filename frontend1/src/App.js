import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Product from './components/Product';
import NavBar from './components/NavBar';
import OfferLetter from './components/OfferLetter';

const App = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <NavBar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/offer-letter" element={<OfferLetter />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
