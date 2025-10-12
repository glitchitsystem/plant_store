const sqlite3 = require('sqlite3').verbose();

// Create database and tables
const db = new sqlite3.Database('./ecommerce.db');

db.serialize(() => {
  // Create products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0
  )`);

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

  // Insert sample plant products
  const products = [
    {
      name: 'Monstera Deliciosa',
      description: 'A beautiful tropical plant with large, split leaves. Perfect for indoor decoration.',
      price: 35.99,
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1585598117791-876ce25c1884?w=400&h=400&fit=crop',
      stock: 15
    },
    {
      name: 'Snake Plant',
      description: 'Low-maintenance succulent that thrives in low light conditions.',
      price: 24.99,
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=400&h=400&fit=crop',
      stock: 20
    },
    {
      name: 'Fiddle Leaf Fig',
      description: 'A popular houseplant with large, violin-shaped leaves.',
      price: 45.99,
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=400&fit=crop',
      stock: 12
    },
    {
      name: 'Peace Lily',
      description: 'Elegant flowering plant that purifies the air.',
      price: 28.99,
      category: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      stock: 18
    },
    {
      name: 'Lavender',
      description: 'Fragrant herb perfect for gardens and aromatherapy.',
      price: 15.99,
      category: 'Outdoor Plants',
      image: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop',
      stock: 25
    },
    {
      name: 'Rosemary',
      description: 'Aromatic herb great for cooking and landscaping.',
      price: 12.99,
      category: 'Herbs',
      image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400&h=400&fit=crop',
      stock: 30
    },
    {
      name: 'Basil',
      description: 'Fresh basil for your kitchen garden.',
      price: 8.99,
      category: 'Herbs',
      image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&h=400&fit=crop',
      stock: 40
    },
    {
      name: 'Succulent Mix',
      description: 'A variety of small succulents perfect for beginners.',
      price: 19.99,
      category: 'Succulents',
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
      stock: 22
    },
    {
      name: 'Aloe Vera',
      description: 'Healing succulent with medicinal properties.',
      price: 16.99,
      category: 'Succulents',
      image: 'https://images.unsplash.com/photo-1509423350716-97f2360af889?w=400&h=400&fit=crop',
      stock: 28
    },
    {
      name: 'Ceramic Plant Pot',
      description: 'Beautiful ceramic pot for your favorite plants.',
      price: 22.99,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      stock: 35
    },
    {
      name: 'Plant Care Kit',
      description: 'Complete kit with fertilizer, pruning shears, and watering can.',
      price: 34.99,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      stock: 15
    },
    {
      name: 'Organic Potting Soil',
      description: 'Premium organic soil mix for healthy plant growth.',
      price: 14.99,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      stock: 50
    }
  ];

  const stmt = db.prepare('INSERT INTO products (name, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)');
  
  products.forEach(product => {
    stmt.run(product.name, product.description, product.price, product.category, product.image, product.stock);
  });
  
  stmt.finalize();

  console.log('Database initialized with sample data!');
});

db.close();