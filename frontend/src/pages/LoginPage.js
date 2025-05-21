import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Attempting login with:', formData.email);
      const response = await auth.login(formData.email, formData.password);
      
      console.log('Login response:', response);
      
      // The response structure might be different than expected
      // Make sure we're storing the token correctly
      let token = null;
      
      if (response.data) {
        if (typeof response.data === 'string') {
          token = response.data;
        } else if (response.data.token) {
          token = response.data.token;
        } else if (response.data.accessToken) {
          token = response.data.accessToken;
        }
      }
      
      if (!token) {
        console.error('No token found in response:', response);
        setError('Invalid response from server. Token not found.');
        setIsLoading(false);
        return;
      }
      
      console.log('Extracted token:', token);
      localStorage.setItem('token', token);
      
      // Force a reload to update the navbar state
      window.location.href = '/';
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.response) {
        console.log('Error response data:', err.response.data);
        
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow">
          <div className="card-body p-5">
            <h2 className="text-center mb-4">Sign In</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </button>
              </div>
            </form>
            
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </div>
            
            <hr className="my-4" />
            
            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 