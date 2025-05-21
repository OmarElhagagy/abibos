import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { products } from '../services/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Product form state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    price: '',
    color: '',
    size: '',
    description: '',
    isActive: true
  });

  // Check if user is admin on component mount
  useEffect(() => {
    checkAdminStatus();
    fetchProducts();
  }, []);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError("You must be logged in to access this page");
      setIsAdmin(false);
      return;
    }
    
    try {
      console.log('Checking admin status in AdminPage with token:', token);
      
      // Try to parse the JWT token
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format');
        setError("Invalid authentication token format");
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
      let hasAdminRole = false;
      if (typeof authorities === 'string') {
        hasAdminRole = authorities.includes('ADMIN') || authorities.includes('admin');
      } else if (Array.isArray(authorities)) {
        hasAdminRole = authorities.some(auth => 
          auth.includes('ADMIN') || auth.includes('admin'));
      }
      
      if (hasAdminRole) {
        setIsAdmin(true);
        setError(null);
      } else {
        setError("You do not have permission to access this page");
        setIsAdmin(false);
        // Redirect after 3 seconds if not admin
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError("Error verifying permissions: " + err.message);
      setIsAdmin(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await products.getAll();
      setProductList(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      brand: '',
      price: '',
      color: '',
      size: '',
      description: '',
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      brand: product.brand,
      price: product.price.toString(),
      color: product.color,
      size: product.size,
      description: product.description,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingProduct) {
        // Update existing product
        await products.update(editingProduct.id, {
          ...formData,
          price: parseFloat(formData.price)
        });
      } else {
        // Create new product
        await products.create({
          ...formData,
          price: parseFloat(formData.price)
        });
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(`Failed to ${editingProduct ? 'update' : 'create'} product`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await products.delete(productId);
        fetchProducts();
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && productList.length === 0) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!isAdmin) {
    return (
      <div className="container py-5">
        <Alert variant="danger">
          {error || "Access denied. You must have admin privileges to view this page."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Product Management</h1>
        <Button variant="primary" onClick={openAddModal}>Add New Product</Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Color</th>
            <th>Size</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.productName}</td>
              <td>{product.brand}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.color}</td>
              <td>{product.size}</td>
              <td>{product.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => openEditModal(product)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Select 
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="One Size">One Size</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;