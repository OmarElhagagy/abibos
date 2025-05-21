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

// Product services
export const products = {
  getAll: () => 
    api.get('/products'),
  
  getById: (id) => 
    api.get(`/products/${id}`),
  
  getByCategory: (categoryId) => 
    api.get(`/products/search/category`, { data: { id: categoryId } }),
  
  search: (keyword) => 
    api.get(`/products/search/name?keyword=${encodeURIComponent(keyword)}`),
    
  getLatest: () => 
    api.get('/products/latest'),
    
  getTopSelling: (limit = 10) => 
    api.get(`/products/top-selling?limit=${limit}`),
    
  // Admin methods
  create: (productData) => 
    api.post('/products', productData),
    
  update: (id, productData) => 
    api.put(`/products/${id}`, productData),
    
  updateStatus: (id, isActive) =>
    api.put(`/products/${id}/status?isActive=${isActive}`),
    
  updatePrice: (id, newPrice) =>
    api.put(`/products/${id}/price?newPrice=${newPrice}`),
    
  delete: (id) =>
    api.delete(`/products/${id}`),
    
  addImage: (productId, imageUrl, isPrimary = false) =>
    api.post(`/images?productId=${productId}&imageUrl=${encodeURIComponent(imageUrl)}&isPrimary=${isPrimary}`),
    
  deleteImage: (imageId) =>
    api.delete(`/images/${imageId}`),
    
  addToCategory: (productId, categoryId) =>
    api.post(`/products/${productId}/categories`, { id: categoryId }),
    
  removeFromCategory: (productId, categoryId) =>
    api.delete(`/products/${productId}/categories`, { data: { id: categoryId } })
};

// Category services
export const categories = {
  getAll: () => 
    api.get('/categories'),
    
  getById: (id) => 
    api.get(`/categories/${id}`),
};

// Cart services
export const cart = {
  getItems: () => 
    api.get('/cart'),
    
  addItem: (productId, quantity = 1) => 
    api.post('/cart', { productId, quantity }),
    
  updateItem: (productId, quantity) => 
    api.put('/cart', { productId, quantity }),
    
  removeItem: (productId) => 
    api.delete(`/cart/${productId}`),
    
  clear: () => 
    api.delete('/cart'),
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

// Customer services
export const customers = {
  getCurrent: () => 
    api.get('/customers/current'),
    
  update: (customerData) => 
    api.put('/customers/current', customerData),
    
  getAddresses: () => 
    api.get('/addresses'),
    
  addAddress: (addressData) => 
    api.post('/addresses', addressData),
};

export default {
  auth,
  products,
  categories,
  cart,
  orders,
  customers,
}; 