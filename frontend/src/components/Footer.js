import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Clothing Store</h5>
            <p className="text-muted">
              Your one-stop shop for quality clothing and accessories.
            </p>
          </div>
          
          <div className="col-md-2 mb-3 mb-md-0">
            <h5>Shop</h5>
            <ul className="list-unstyled">
              <li><Link className="text-muted text-decoration-none" to="/products">All Products</Link></li>
              <li><Link className="text-muted text-decoration-none" to="/products/category/men">Men</Link></li>
              <li><Link className="text-muted text-decoration-none" to="/products/category/women">Women</Link></li>
              <li><Link className="text-muted text-decoration-none" to="/products/category/accessories">Accessories</Link></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-3 mb-md-0">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li><Link className="text-muted text-decoration-none" to="/about-us">About Us</Link></li>
              <li><Link className="text-muted text-decoration-none" to="/contact">Contact</Link></li>
              <li><Link className="text-muted text-decoration-none" to="/careers">Careers</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5>Stay Connected</h5>
            <div className="d-flex gap-2 mb-3">
              <a href="#" className="text-muted fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-muted fs-5"><i className="bi bi-pinterest"></i></a>
            </div>
            <p className="text-muted small">
              Subscribe to our newsletter for updates on new arrivals and promotions.
            </p>
          </div>
        </div>
        
        <hr className="my-3 border-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} Clothing Store. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link className="text-muted small" to="/about-us">Terms</Link>
              </li>
              <li className="list-inline-item">
                <span className="text-muted">|</span>
              </li>
              <li className="list-inline-item">
                <Link className="text-muted small" to="/about-us">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 