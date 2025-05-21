import axios from 'axios';

const API_URL = '/api';
const AUTH_URL = `${API_URL}/auth`;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const auth = {
  login: (email, password) => 
    axios.post(`${AUTH_URL}/login`, { email, password }),
  
  register: (userData) => 
    axios.post(`${AUTH_URL}/register`, userData),
    
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Products services
export const products = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`)
};

// Categories services
export const categories = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`)
};

// Order services
export const orders = {
  create: (orderData) => 
    api.post('/customer-orders', orderData),
    
  getByCustomer: () => 
    api.get('/customer-orders/customer'),
  
  getById: (id) => 
    api.get(`/customer-orders/${id}`),
};

// Customer management
export const customers = {
  getProfile: () => 
    api.get('/customers/profile'),
    
  updateProfile: (profileData) => 
    api.put('/customers/profile', profileData),
    
  addAddress: (addressData) => 
    api.post('/addresses', addressData),
};

export default {
  auth,
  products,
  categories,
  orders,
  customers,
}; 