import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="flex-grow-1 container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
          <Route path="/products/category/:categoryName" element={<ProductsPage addToCart={addToCart} />} />
          <Route path="/products/:id" element={<ProductDetailPage addToCart={addToCart} />} />
          <Route 
            path="/cart" 
            element={
              <CartPage 
                cartItems={cartItems} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity} 
              />
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about-us" element={<div className="p-4"><h2>About Us</h2><p>We are a premier clothing store dedicated to providing high-quality apparel for all occasions.</p></div>} />
          <Route path="/contact" element={<div className="p-4"><h2>Contact Us</h2><p>Email: contact@clothingstore.com<br/>Phone: (123) 456-7890</p></div>} />
          <Route path="/careers" element={<div className="p-4"><h2>Careers</h2><p>Join our team! We're always looking for talented individuals.</p></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 