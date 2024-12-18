import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';  // Ensure the correct casing
import Home from './components/Home';
import Product from './components/Product';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/product" element={<Product />} />
            </Routes>
        </Router>
    );
};

export default App;

