import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Product from './pages/Product';
import Checkout from './pages/checkout';
import Profile from './pages/Profile';
import OrderSummary from './pages/OrderSummary';
import Header from './pages/Navar';
import Carts from './pages/Carts';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/carts" element={<Carts />} />
      </Routes>
    </Router>
  );
}

export default App;