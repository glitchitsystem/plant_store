# Plant Store Test Cases

This document contains comprehensive test cases for the Plant Store e-commerce web application, covering both manual testing scenarios and API endpoint testing.

## Manual Test Cases

### Test Case 1: User Registration and Login Flow

**Objective**: Verify complete user authentication workflow  
**Prerequisites**: Fresh browser session, no existing account

**Steps**:

1. Navigate to `http://localhost:3000`
2. Click "Register" or "Sign Up" link in header
3. Fill registration form:
   - Name: "John Doe"
   - Email: "john.doe@test.com"
   - Password: "SecurePass123"
4. Submit registration form
5. Verify automatic login and redirect to home page
6. Check user name appears in header
7. Logout using logout button
8. Login again using same credentials
9. Verify successful login

**Expected Results**:

- Registration creates new account successfully
- User automatically logged in after registration
- User name displayed in header when authenticated
- Logout clears session
- Login works with created credentials
- Authentication persists on page refresh

---

### Test Case 2: Product Browsing and Search

**Objective**: Test product catalog functionality  
**Prerequisites**: Server running with sample products loaded

**Steps**:

1. Navigate to Products page (`/products`)
2. Verify all sample products are displayed (Snake Plant, Fiddle Leaf Fig, etc.)
3. Click on "Snake Plant" product card
4. Verify product detail page loads with:
   - Product name, price, description
   - Product image from Unsplash
   - Stock quantity
   - "Add to Cart" button
5. Navigate back to products page
6. Test category filtering if available
7. Verify responsive design on different screen sizes

**Expected Results**:

- Products page displays all available plants
- Product cards show name, price, and image
- Product detail page shows complete information
- Images load correctly from Unsplash
- Navigation works smoothly
- Layout is responsive

---

### Test Case 3: Shopping Cart Operations

**Objective**: Test complete shopping cart functionality  
**Prerequisites**: Products available in catalog

**Steps**:

1. Navigate to Products page
2. Add "Snake Plant" ($29.99) to cart
3. Verify cart icon updates with item count
4. Add "Monstera Deliciosa" ($39.99) to cart
5. Add another "Snake Plant" (should increase quantity)
6. Navigate to Cart page (`/cart`)
7. Verify cart contents:
   - Snake Plant: Qty 2, Subtotal $59.98
   - Monstera Deliciosa: Qty 1, Subtotal $39.99
   - Total: $99.97
8. Update Snake Plant quantity to 1
9. Remove Monstera from cart
10. Verify cart persists on page refresh

**Expected Results**:

- Items added to cart successfully
- Cart counter updates correctly
- Cart page shows accurate quantities and prices
- Quantity updates work correctly
- Item removal works
- Cart data persists in localStorage
- Total calculations are accurate

---

### Test Case 4: Checkout Process (End-to-End)

**Objective**: Test complete order placement workflow  
**Prerequisites**: Items in cart, products have sufficient stock

**Steps**:

1. Add products to cart (total ~$50)
2. Navigate to Cart page
3. Click "Proceed to Checkout"
4. Fill checkout form:
   - Name: "Jane Smith"
   - Email: "jane@test.com"
   - Address: "123 Main St"
   - City: "Anytown"
   - State: "CA"
   - ZIP: "12345"
5. Review order summary
6. Submit order
7. Verify success message with order ID
8. Check cart is cleared after successful order
9. Verify stock quantities decreased on products

**Expected Results**:

- Checkout form validates required fields
- Order total calculated correctly
- Order submission successful
- Order ID generated and displayed
- Cart cleared after order
- Product stock decremented
- Success confirmation shown

---

## API Test Cases

### API Test Case 1: User Registration and Authentication

**Endpoint**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`  
**Objective**: Test complete authentication API workflow

**Test Steps**:

```javascript
// 1. Register new user
POST /api/auth/register
Content-Type: application/json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "TestPass123"
}

// Expected: 201 Created
// Response should include: user object, JWT token

// 2. Login with created credentials
POST /api/auth/login
Content-Type: application/json
{
  "email": "testuser@example.com",
  "password": "TestPass123"
}

// Expected: 200 OK
// Response should include: user object, JWT token

// 3. Get user profile with token
GET /api/auth/me
Authorization: Bearer <token_from_login>

// Expected: 200 OK
// Response should include: user details (id, name, email)

// 4. Test invalid credentials
POST /api/auth/login
Content-Type: application/json
{
  "email": "testuser@example.com",
  "password": "WrongPassword"
}

// Expected: 401 Unauthorized
// Response: { "error": "Invalid credentials" }

// 5. Test duplicate registration
POST /api/auth/register
Content-Type: application/json
{
  "name": "Another User",
  "email": "testuser@example.com",  // Same email
  "password": "AnotherPass123"
}

// Expected: 400 Bad Request
// Response: { "error": "User already exists" }
```

---

### API Test Case 2: Product Catalog API

**Endpoints**: `GET /api/products`, `GET /api/products/:id`, `GET /api/categories`  
**Objective**: Test product retrieval functionality

**Test Steps**:

```javascript
// 1. Get all products
GET /api/products

// Expected: 200 OK
// Response: Array of products with id, name, price, description, category, image, stock

// 2. Get specific product by ID
GET /api/products/1

// Expected: 200 OK
// Response: Single product object with all details

// 3. Get non-existent product
GET /api/products/999

// Expected: 404 Not Found
// Response: { "error": "Product not found" }

// 4. Get products by category
GET /api/products/category/Indoor%20Plants

// Expected: 200 OK
// Response: Array of products filtered by "Indoor Plants" category

// 5. Get all categories
GET /api/categories

// Expected: 200 OK
// Response: Array of unique category names ["Indoor Plants", "Outdoor Plants"]

// 6. Test invalid category
GET /api/products/category/NonExistentCategory

// Expected: 200 OK
// Response: Empty array []
```

---

### API Test Case 3: Order Creation and Stock Management

**Endpoint**: `POST /api/orders`  
**Objective**: Test order placement and inventory management

**Test Steps**:

```javascript
// 1. Create valid order with sufficient stock
POST /api/orders
Content-Type: application/json
{
  "items": [
    { "id": 1, "name": "Snake Plant", "price": 29.99, "quantity": 2 },
    { "id": 3, "name": "Monstera Deliciosa", "price": 39.99, "quantity": 1 }
  ],
  "total": 99.97,
  "shipping": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}

// Expected: 200 OK
// Response: { "id": <order_id>, "message": "Order placed successfully", "orderId": <id> }
// Stock should be decremented for ordered items

// 2. Test order with insufficient stock
POST /api/orders
Content-Type: application/json
{
  "items": [
    { "id": 2, "name": "Fiddle Leaf Fig", "price": 49.99, "quantity": 20 }  // More than stock
  ],
  "total": 999.80,
  "shipping": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}

// Expected: 400 Bad Request
// Response: { "errors": ["Not enough stock..."], "adjustedItems": [...] }

// 3. Test order with missing required fields
POST /api/orders
Content-Type: application/json
{
  "items": [],
  "total": 0
  // Missing shipping info
}

// Expected: 400 Bad Request
// Response: { "error": "Missing required order information" }

// 4. Verify stock was decremented after successful order
GET /api/products/1

// Expected: Stock count should be reduced by quantity ordered
```
