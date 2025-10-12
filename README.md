# 🌱 GreenThumb Garden - Plant Ecommerce Website

A full-stack ecommerce website for plants and garden accessories built with React, Express.js, and SQLite.

## Features

- **User Authentication**: Register, login, and user profiles
- **Product Catalog**: Browse plants by categories (Indoor Plants, Herbs, Succulents, Accessories)
- **Product Details**: View detailed information about each plant
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout System**: Place orders with customer information
- **Order History**: Authenticated users can view their past orders
- **Guest Checkout**: Non-registered users can still place orders
- **Responsive Design**: Works on desktop and mobile devices
- **Free Stock Images**: Uses Unsplash for beautiful plant photography

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for HTTP requests
- CSS3 for styling

### Backend
- Node.js & Express.js
- SQLite database
- JWT for authentication
- bcrypt for password hashing
- CORS enabled for cross-origin requests

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2. Initialize Database

```bash
# From the server directory
cd server
npm run init-db
```

This will create the SQLite database and populate it with sample plant products.

### 3. Start the Application

```bash
# From the root directory
npm run dev
```

This will start both the backend server (port 5000) and the React frontend (port 3000).

Alternatively, you can run them separately:

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm start
```

## Usage

1. **Browse Products**: Visit http://localhost:3000 to see the homepage
2. **Shop**: Navigate to the Products page to browse all plants
3. **Filter**: Use the category dropdown to filter products
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Checkout**: Review your cart and proceed to checkout
6. **Place Order**: Fill in shipping information and place your order

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/categories` - Get all categories

### Orders
- `POST /api/orders` - Create new order (optional auth)
- `GET /api/orders/:id` - Get order by ID (optional auth)
- `GET /api/orders/my-orders` - Get user's order history (requires auth)

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` - User email (unique)
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `createdAt` - Account creation timestamp

### Products Table
- `id` (Primary Key)
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `category` - Product category
- `image` - Image URL
- `stock` - Available quantity

### Orders Table
- `id` (Primary Key)
- `userId` - Foreign key to users table (nullable for guest orders)
- `customerName` - Customer full name
- `customerEmail` - Customer email
- `items` - JSON string of ordered items
- `total` - Order total amount
- `status` - Order status
- `createdAt` - Order creation timestamp

## Sample Products

The database includes sample products:
- **Indoor Plants**: Monstera Deliciosa, Snake Plant, Fiddle Leaf Fig, Peace Lily
- **Outdoor Plants**: Lavender
- **Herbs**: Rosemary, Basil
- **Succulents**: Succulent Mix, Aloe Vera
- **Accessories**: Ceramic Pots, Plant Care Kit, Potting Soil

## Image Sources

All product images are sourced from Unsplash, a platform providing free high-quality stock photography:
- Unsplash.com - Free botanical and plant photography
- Images are used via Unsplash's API with proper attribution

## Development

### Adding New Products
Products can be added by:
1. Inserting directly into the SQLite database
2. Adding to the `initDatabase.js` file for permanent inclusion

### Styling
The application uses custom CSS with:
- CSS Grid for responsive layouts
- CSS Flexbox for component alignment
- CSS Variables for consistent theming
- Media queries for mobile responsiveness

### State Management
- React Context API for cart state
- Local component state for form inputs and loading states
- No external state management library required

## Future Enhancements

- Payment integration (Stripe, PayPal)
- Product reviews and ratings
- Wishlist functionality
- Inventory management admin panel
- Email confirmations
- Product search functionality
- More detailed product filters (price range, etc.)

## License

MIT License - feel free to use this project for learning or as a starting point for your own ecommerce application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for plant lovers everywhere! 🌿