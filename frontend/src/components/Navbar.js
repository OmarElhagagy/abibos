import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

const Navbar = ({ cartItemsCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  useEffect(() => {
    // Check admin status whenever auth state changes
    const checkAuthAndAdmin = () => {
      checkAdminStatus();
    };
    
    checkAuthAndAdmin();
    // Add event listener for storage changes (login/logout)
    window.addEventListener('storage', checkAuthAndAdmin);
    
    return () => {
      window.removeEventListener('storage', checkAuthAndAdmin);
    };
  }, []);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, not admin');
      setIsAdmin(false);
      return;
    }
    
    try {
      console.log('Checking admin status with token:', token);
      
      // Try to parse the JWT token
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format');
        setIsAdmin(false);
        return;
      }
      
      const encodedPayload = parts[1];
      const decodedPayload = atob(encodedPayload);
      const tokenPayload = JSON.parse(decodedPayload);
      
      console.log('Token payload:', tokenPayload);
      
      // Different JWT implementations might have different fields
      // Check various common authority/role fields
      const authorities = 
        tokenPayload.auth || 
        tokenPayload.authorities || 
        tokenPayload.roles ||
        tokenPayload.scope ||
        '';
      
      console.log('Found authorities:', authorities);
      
      // Check if any of these contain ADMIN
      if (typeof authorities === 'string') {
        setIsAdmin(authorities.includes('ADMIN') || authorities.includes('admin'));
      } else if (Array.isArray(authorities)) {
        setIsAdmin(authorities.some(auth => 
          auth.includes('ADMIN') || auth.includes('admin')));
      } else {
        setIsAdmin(false);
      }
      
      console.log('Is admin:', isAdmin);
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Clothing Store</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">Products</NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Admin Dashboard</NavLink>
              </li>
            )}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Categories
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/products/category/men">Men</Link></li>
                <li><Link className="dropdown-item" to="/products/category/women">Women</Link></li>
                <li><Link className="dropdown-item" to="/products/category/accessories">Accessories</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Company
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/about-us">About Us</Link></li>
                <li><Link className="dropdown-item" to="/contact">Contact</Link></li>
                <li><Link className="dropdown-item" to="/careers">Careers</Link></li>
              </ul>
            </li>
          </ul>
          
          <form className="d-flex me-2 mb-2 mb-lg-0" onSubmit={handleSearch}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-light" type="submit">Search</button>
          </form>
          
          <div className="d-flex">
            <Link to="/cart" className="btn btn-outline-light me-2 position-relative">
              <i className="bi bi-cart"></i> Cart
              {cartItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="dropdown">
                <button className="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
                  Account
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                <Link to="/register" className="btn btn-light">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;