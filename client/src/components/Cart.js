import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any plants to your cart yet.</p>
          <Link to="/products" className="shop-now-button">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button onClick={clearCart} className="clear-cart-button">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop&crop=center';
                  }}
                />
              </div>
              
              <div className="cart-item-details">
                <Link to={`/products/${item.id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-category">{item.category}</p>
                <p className="cart-item-price">{formatPrice(item.price)} each</p>
              </div>
              
              <div className="cart-item-quantity">
                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="quantity-button"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="cart-item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-button"
                aria-label={`Remove ${item.name} from cart`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-content">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({cart.reduce((count, item) => count + item.quantity, 0)} items)</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>
            
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;