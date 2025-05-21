import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../services/api';
import ProductCard from '../components/ProductCard';

// Sample featured products
const SAMPLE_FEATURED_PRODUCTS = [
  {
    id: 1,
    productName: "Classic T-Shirt",
    brand: "Fashion Brand",
    price: 24.99,
    color: "Black",
    size: "M",
    description: "A comfortable classic t-shirt",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/600x400?text=Classic+T-Shirt", isPrimary: true}]
  },
  {
    id: 2,
    productName: "Slim Fit Jeans",
    brand: "Denim Co",
    price: 49.99,
    color: "Blue",
    size: "32",
    description: "Premium quality slim fit jeans",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/600x400?text=Slim+Fit+Jeans", isPrimary: true}]
  },
  {
    id: 3,
    productName: "Casual Sneakers",
    brand: "Step Style",
    price: 59.99,
    color: "White",
    size: "42",
    description: "Comfortable casual sneakers for everyday wear",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/600x400?text=Casual+Sneakers", isPrimary: true}]
  },
  {
    id: 4,
    productName: "Summer Dress",
    brand: "Elle",
    price: 64.99,
    color: "Floral",
    size: "S",
    description: "Light and elegant summer dress",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/600x400?text=Summer+Dress", isPrimary: true}]
  }
];

// Sample categories
const SAMPLE_CATEGORIES = [
  { id: 1, name: "Men", description: "Men's clothing", imageUrl: "https://via.placeholder.com/300x200?text=Men's+Fashion" },
  { id: 2, name: "Women", description: "Women's clothing", imageUrl: "https://via.placeholder.com/300x200?text=Women's+Fashion" },
  { id: 3, name: "Accessories", description: "Fashion accessories", imageUrl: "https://via.placeholder.com/300x200?text=Accessories" }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(SAMPLE_FEATURED_PRODUCTS);
  const [popularCategories, setPopularCategories] = useState(SAMPLE_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Try to get real featured products
        try {
          const productsResponse = await products.getTopSelling(4);
          if (productsResponse.data && productsResponse.data.length > 0) {
            setFeaturedProducts(productsResponse.data);
          }
        } catch (err) {
          console.log('Using sample featured products:', err);
        }

        // Try to get real categories
        try {
          const categoriesResponse = await categories.getAll();
          if (categoriesResponse.data && categoriesResponse.data.length > 0) {
            const enhancedCategories = categoriesResponse.data.map(cat => ({
              ...cat,
              imageUrl: `https://via.placeholder.com/300x200?text=${cat.name}`
            })).slice(0, 3);
            setPopularCategories(enhancedCategories);
          }
        } catch (err) {
          console.log('Using sample categories:', err);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        // We're already using sample data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Summer Collection 2025</h1>
          <p className="col-md-8 fs-4">
            Discover our latest arrivals for the perfect summer wardrobe. 
            Fresh styles, vibrant colors, and breathable fabrics.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100">
                <img 
                  src={product.images?.[0]?.imageUrl || "https://via.placeholder.com/300"} 
                  className="card-img-top" 
                  alt={product.productName} 
                />
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text text-muted">{product.brand}</p>
                  <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                  <Link to={`/products/${product.id}`} className="btn btn-outline-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="row g-4">
          {popularCategories.map(category => (
            <div key={category.id} className="col-md-4">
              <div className="card text-center h-100">
                <img 
                  src={category.imageUrl} 
                  className="card-img-top" 
                  alt={category.name} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text">{category.description}</p>
                  <Link 
                    to={`/products/category/${category.name.toLowerCase()}`} 
                    className="btn btn-outline-dark mt-auto"
                  >
                    Shop {category.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="mb-5 bg-primary text-white p-5 rounded">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3>Get 20% Off Your First Purchase</h3>
            <p className="mb-0">
              Subscribe to our newsletter and receive a coupon code right in your inbox.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/products" className="btn btn-light">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 