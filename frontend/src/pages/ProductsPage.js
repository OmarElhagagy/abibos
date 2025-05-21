import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { products, categories } from '../services/api';
import ProductCard from '../components/ProductCard';

// Sample product data for fallback
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    productName: "Classic T-Shirt",
    brand: "Fashion Brand",
    price: 24.99,
    color: "Black",
    size: "M",
    description: "A comfortable classic t-shirt",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/300", isPrimary: true}]
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
    images: [{imageUrl: "https://via.placeholder.com/300", isPrimary: true}]
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
    images: [{imageUrl: "https://via.placeholder.com/300", isPrimary: true}]
  },
  {
    id: 4,
    productName: "Hooded Sweatshirt",
    brand: "Urban Wear",
    price: 39.99,
    color: "Gray",
    size: "L",
    description: "Warm and comfortable hooded sweatshirt",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/300", isPrimary: true}]
  },
  {
    id: 5,
    productName: "Summer Dress",
    brand: "Elle",
    price: 64.99,
    color: "Floral",
    size: "S",
    description: "Light and elegant summer dress",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/300", isPrimary: true}]
  },
  {
    id: 6,
    productName: "Leather Wallet",
    brand: "Accessorize",
    price: 29.99,
    color: "Brown",
    size: "One Size",
    description: "Genuine leather wallet with multiple card slots",
    isActive: true,
    images: [{imageUrl: "https://via.placeholder.com/300", isPrimary: true}]
  }
];

// Sample category data for fallback
const SAMPLE_CATEGORIES = [
  { id: 1, name: "Men", description: "Men's clothing" },
  { id: 2, name: "Women", description: "Women's clothing" },
  { id: 3, name: "Accessories", description: "Fashion accessories" }
];

const ProductsPage = ({ addToCart }) => {
  const [searchParams] = useSearchParams();
  const { categoryName } = useParams();
  const [productList, setProductList] = useState(SAMPLE_PRODUCTS);  // Initialize with sample data
  const [categoryList, setCategoryList] = useState(SAMPLE_CATEGORIES);  // Initialize with sample data
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'latest');
  
  // Available filter options derived from products
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Attempt to fetch real data, but fall back to sample data if anything fails
      try {
        // Fetch categories
        try {
          const categoriesResponse = await categories.getAll();
          if (categoriesResponse.data && categoriesResponse.data.length > 0) {
            setCategoryList(categoriesResponse.data);
          }
        } catch (err) {
          console.log('Using sample category data:', err);
        }
        
        // Determine what products to fetch
        const searchQuery = searchParams.get('search');
        let categoryId = null;
        
        // Handle category from URL parameter
        if (categoryName) {
          const category = categoryList.find(
            c => c.name.toLowerCase() === categoryName.toLowerCase()
          );
          if (category) {
            categoryId = category.id;
            setSelectedCategory(category.id.toString());
          }
        }
        
        // Try to fetch products based on parameters
        let fetchedProducts = [];
        
        try {
          let productsResponse;
          if (searchQuery) {
            productsResponse = await products.search(searchQuery);
          } else if (categoryId) {
            productsResponse = await products.getByCategory(categoryId);
          } else {
            productsResponse = await products.getAll();
          }
          
          if (productsResponse.data && productsResponse.data.length > 0) {
            fetchedProducts = productsResponse.data;
            setProductList(fetchedProducts);
          }
        } catch (err) {
          console.log('Using sample product data:', err);
          
          // Filter sample products if we have a category name
          if (categoryName) {
            const filteredProducts = SAMPLE_PRODUCTS.filter(p => {
              if (categoryName.toLowerCase() === 'men') {
                return p.productName.includes('T-Shirt') || p.productName.includes('Jeans') || p.productName.includes('Sweatshirt');
              } else if (categoryName.toLowerCase() === 'women') {
                return p.productName.includes('Dress');
              } else if (categoryName.toLowerCase() === 'accessories') {
                return p.productName.includes('Wallet') || p.productName.includes('Sneakers');
              }
              return true;
            });
            setProductList(filteredProducts.length > 0 ? filteredProducts : SAMPLE_PRODUCTS);
          }
        }
        
        // Extract available filter options
        const products = productList.length > 0 ? productList : SAMPLE_PRODUCTS;
        const brands = [...new Set(products.map(p => p.brand))];
        const colors = [...new Set(products.map(p => p.color))];
        const sizes = [...new Set(products.map(p => p.size))];
        
        setAvailableBrands(brands);
        setAvailableColors(colors);
        setAvailableSizes(sizes);
      } catch (err) {
        console.error('Error in data fetching flow:', err);
        // We're already using sample data as fallback, so no need to do anything special here
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [searchParams, categoryName, categoryList]);

  // Apply filters and sorting to products
  const filteredProducts = productList.filter(product => {
    // Apply category filter
    if (selectedCategory && !product.categories?.some(cat => cat.id.toString() === selectedCategory)) {
      return false;
    }
    
    // Apply brand filter
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }
    
    // Apply color filter
    if (selectedColor && product.color !== selectedColor) {
      return false;
    }
    
    // Apply size filter
    if (selectedSize && product.size !== selectedSize) {
      return false;
    }
    
    // Apply price range filter
    if (priceRange.min && product.price < parseFloat(priceRange.min)) {
      return false;
    }
    
    if (priceRange.max && product.price > parseFloat(priceRange.max)) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

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
    <div className="row">
      {/* Filters Sidebar */}
      <div className="col-md-3 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Filters</h5>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Category</label>
              <select 
                className="form-select" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Brand Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Brand</label>
              <select 
                className="form-select" 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Color Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Color</label>
              <select 
                className="form-select" 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">All Colors</option>
                {availableColors.map(color => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Size Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Size</label>
              <select 
                className="form-select" 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">All Sizes</option>
                {availableSizes.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Price Range</label>
              <div className="d-flex align-items-center">
                <input 
                  type="number" 
                  className="form-control me-2" 
                  placeholder="Min" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span className="mx-1">-</span>
                <input 
                  type="number" 
                  className="form-control ms-2" 
                  placeholder="Max" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>
            
            {/* Reset Filters Button */}
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSelectedCategory('');
                setSelectedBrand('');
                setSelectedColor('');
                setSelectedSize('');
                setPriceRange({ min: '', max: '' });
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="col-md-9">
        {/* Sort Options and Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-muted">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
            </span>
          </div>
          <div className="d-flex align-items-center">
            <label className="me-2">Sort by:</label>
            <select 
              className="form-select form-select-sm" 
              style={{ width: 'auto' }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="alert alert-info">
            No products found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {sortedProducts.map(product => (
              <div key={product.id} className="col">
                <ProductCard product={product} addToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 