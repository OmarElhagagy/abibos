import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <h2>Your Cart is Empty</h2>
        <p className="lead mb-4">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setCheckoutLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutSuccess(true);
      
      // Redirect to confirmation after checkout
      setTimeout(() => {
        navigate('/');
        // This would be where you'd clear the cart in a real application
      }, 2000);
    }, 1500);
  };

  if (checkoutSuccess) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h2>Thank You for Your Order!</h2>
        <p className="lead mb-4">Your order has been placed successfully.</p>
        <p>You will receive a confirmation email shortly.</p>
        <p className="text-muted">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      <div className="row">
        <div className="col-lg-8">
          {/* Cart Items */}
          <div className="card mb-4">
            <div className="card-body">
              {cartItems.map(item => (
                <div key={item.id} className="row mb-3 border-bottom pb-3">
                  <div className="col-md-3 mb-2 mb-md-0">
                    <img 
                      src={item.images?.[0]?.imageUrl || "https://via.placeholder.com/100"} 
                      alt={item.productName} 
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-6 mb-2 mb-md-0">
                    <h5>{item.productName}</h5>
                    <p className="text-muted">
                      {item.brand} - {item.color} - {item.size}
                    </p>
                    <p className="fw-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex flex-column">
                      <div className="input-group mb-3">
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          className="form-control text-center" 
                          value={item.quantity}
                          readOnly
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-end">
                <Link to="/products" className="btn btn-outline-primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          {/* Order Summary */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                className="btn btn-primary w-100" 
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
          
          {/* Accepted Payment Methods */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title">We Accept</h6>
              <div className="d-flex gap-2 mt-2">
                <i className="bi bi-credit-card fs-4"></i>
                <i className="bi bi-paypal fs-4"></i>
                <i className="bi bi-wallet2 fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 