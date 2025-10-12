import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../config/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);



  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error">
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <Link to="/products" className="back-button">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>
      
      <div className="product-detail">
        <div className="product-image-large">
          <img 
            src={product.image} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop&crop=center';
            }}
          />
        </div>
        
        <div className="product-info-detailed">
          <span className="product-category-badge">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price-large">{formatPrice(product.price)}</div>
          
          <div className="product-description-full">
            <h3>About this Plant</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-details">
            <div className="detail-item">
              <strong>Category:</strong> {product.category}
            </div>
            <div className="detail-item">
              <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </div>
          </div>
          
          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <select 
                id="quantity"
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="add-to-cart-btn-large"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </button>
          </div>
          
          <div className="care-tips">
            <h3>Care Tips</h3>
            <div className="care-grid">
              <div className="care-item">
                <span className="care-icon">💧</span>
                <div>
                  <strong>Watering</strong>
                  <p>Water when soil is dry to touch</p>
                </div>
              </div>
              <div className="care-item">
                <span className="care-icon">☀️</span>
                <div>
                  <strong>Light</strong>
                  <p>Bright, indirect sunlight</p>
                </div>
              </div>
              <div className="care-item">
                <span className="care-icon">🌡️</span>
                <div>
                  <strong>Temperature</strong>
                  <p>65-75°F (18-24°C)</p>
                </div>
              </div>
              <div className="care-item">
                <span className="care-icon">💨</span>
                <div>
                  <strong>Humidity</strong>
                  <p>Moderate to high humidity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;