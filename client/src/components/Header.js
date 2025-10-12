import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const cartItemCount = getCartItemCount();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌱</span>
          GreenThumb Garden
        </Link>
        
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className={`nav-link ${isActive('/products')}`}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className={`nav-link cart-link ${isActive('/cart')}`}>
                <span className="cart-icon">🛒</span>
                Cart
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;