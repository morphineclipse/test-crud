CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category TEXT NOT NULL DEFAULT 'misc',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL DEFAULT '',
  total INTEGER NOT NULL DEFAULT 0,
  promo TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL
);

-- seed users (passwords hashed for admin123 / user123 via bcrypt 10 rounds)
-- hash admin123: $2a$10$9Q8FzG0ZxQ8FzG0ZxQ8FzeeJ9Q8FzG0ZxQ8FzG0ZxQ8Fzeestring (replaced on reset API)
-- real seed happens in /api/test/reset, here only demo products
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@test.com', '$2a$10$wHkR8vKzQhKzQhKzQhKzQeuJ9vKzQhKzQhKzQhKzQhKzQhKzQhK.', 'admin'),
  ('user@test.com', '$2a$10$wHkR8vKzQhKzQhKzQhKzQeuJ9vKzQhKzQhKzQhKzQhKzQhKzQhK.', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (title, price, stock, category, description, image) VALUES
  ('Keyboard K1', 2999, 10, 'tech', 'Mechanical keyboard, test fixture', ''),
  ('Mouse M1', 1499, 25, 'tech', 'Optical mouse', ''),
  ('Notebook', 499, 100, 'books', 'Paper notebook 96 pages', ''),
  ('QA Handbook', 1299, 5, 'books', 'Manual + automated testing guide', ''),
  ('T-shirt', 999, 50, 'clothes', 'Cotton t-shirt', ''),
  ('Jeans', 3499, 0, 'clothes', 'Out of stock fixture for negative cases', ''),
  ('Coffee Mug', 599, 30, 'home', 'Ceramic mug 350ml', ''),
  ('Lamp', 1999, 7, 'home', 'Desk lamp', ''),
  ('USB Cable', 299, 200, 'tech', 'USB-C cable 1m', ''),
  ('Backpack', 2799, 12, 'clothes', 'City backpack 20l', ''),
  ('Pen', 99, 500, 'books', 'Ballpoint pen, min price fixture', ''),
  ('Monitor 27', 18999, 3, 'tech', 'Expensive fixture for boundary totals', '')
ON CONFLICT DO NOTHING;
