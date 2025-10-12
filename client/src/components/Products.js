import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../config/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let url = '/products';
        if (selectedCategory && selectedCategory !== 'All') {
          url += `/category/${encodeURIComponent(selectedCategory)}`;
        }
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get(url),
          api.get('/categories')
        ]);
        
        setProducts(productsResponse.data);
        setCategories(['All', ...categoriesResponse.data]);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/products';
      if (selectedCategory && selectedCategory !== 'All') {
        url += `/category/${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await api.get(url);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading plants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Plants Collection</h1>
        <p>Discover the perfect plants for your space</p>
      </div>

      <div className="products-filters">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select 
          id="category-filter"
          value={selectedCategory} 
          onChange={(e) => {
            const category = e.target.value;
            const url = category === 'All' ? '/products' : `/products?category=${category}`;
            window.history.pushState({}, '', url);
            window.location.reload();
          }}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No plants found in this category.</p>
          <Link to="/products" className="back-button">
            View All Products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-link">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop&crop=center';
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">
                    {product.description && product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </p>
                </div>
              </Link>
              <div className="product-actions">
                <div className="product-price">{formatPrice(product.price)}</div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;