const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(bodyParser.json());

// Database connection and initialization
const db = new sqlite3.Database('./ecommerce.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables and sample data
function initializeDatabase() {
  // Create products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    category TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('Error creating products table:', err.message);
    } else {
      // Check if products exist, if not, insert sample data
      db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) {
          console.error('Error checking products:', err.message);
        } else if (row.count === 0) {
          insertSampleProducts();
        }
      });
    }
  });

  // Create orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

// Insert sample products
function insertSampleProducts() {
  const sampleProducts = [
    {
      name: 'Snake Plant',
      price: 29.99,
      description: 'Low-maintenance indoor plant perfect for beginners',
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
      stock: 15
    },
    {
      name: 'Fiddle Leaf Fig',
      price: 49.99,
      description: 'Popular indoor tree with large, glossy leaves',
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400',
      stock: 8
    },
    {
      name: 'Monstera Deliciosa',
      price: 39.99,
      description: 'Trendy plant with unique split leaves',
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1585598117791-876ce25c1884?w=400',
      stock: 12
    },
    {
      name: 'Lavender Plant',
      price: 24.99,
      description: 'Fragrant outdoor plant perfect for gardens',
      category: 'Outdoor Plants',
      image: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400',
      stock: 20
    }
  ];

  const stmt = db.prepare('INSERT INTO products (name, price, description, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)');
  
  sampleProducts.forEach(product => {
    stmt.run([product.name, product.price, product.description, product.category, product.image, product.stock]);
  });
  
  stmt.finalize();
  console.log('Sample products inserted');
}

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  console.log('Fetching all products...');
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`Found ${rows.length} products`);
    res.json(rows);
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => row.category));
  });
});

// Create order
app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, items, total } = req.body;
  
  db.run(
    'INSERT INTO orders (customerName, customerEmail, items, total, status) VALUES (?, ?, ?, ?, ?)',
    [customerName, customerEmail, JSON.stringify(items), total, 'pending'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID,
        message: 'Order created successfully'
      });
    }
  );
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      // Parse items JSON
      row.items = JSON.parse(row.items);
      res.json(row);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
    app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});