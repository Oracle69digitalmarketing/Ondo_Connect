-- Users (shared across modules)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  language VARCHAR(2) DEFAULT 'en',
  role VARCHAR(20), -- 'farmer', 'artisan', 'buyer', 'collector'
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP
);

-- Locations
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lga VARCHAR(50),
  coordinates POINT,
  is_primary BOOLEAN DEFAULT false
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  type VARCHAR(20), -- 'sale', 'booking', 'collection'
  status VARCHAR(20),
  reference_id UUID, -- Links to specific module
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agri Module: Farmers and Crops
CREATE TABLE farmers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  subscription_status BOOLEAN DEFAULT true
);

CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmers(user_id) ON DELETE CASCADE,
  type VARCHAR(20), -- 'cocoa'|'cassava'|'maize'
  hectares DECIMAL(10,2),
  planted_at TIMESTAMP
);

-- Market Module: Listings
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20), -- 'product'|'service'|'waste'
  category VARCHAR(50),
  title VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  unit VARCHAR(10), -- 'kg'|'unit'|'hour'
  status VARCHAR(20) DEFAULT 'active',
  lga VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service Module: Artisans
CREATE TABLE artisans (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(100),
  category VARCHAR(50), -- 'mechanic'|'tailor'|'hairdresser'|'electrician'
  qr_code VARCHAR(100) UNIQUE
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES artisans(user_id),
  customer_id UUID REFERENCES users(id),
  service_name VARCHAR(100),
  price DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Circular Module: Collections
CREATE TABLE waste_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id),
  collector_id UUID REFERENCES users(id),
  waste_type VARCHAR(20), -- 'plastic'|'agricultural'|'e-waste'
  estimated_kg DECIMAL(10,2),
  actual_kg DECIMAL(10,2),
  points_awarded INTEGER,
  status VARCHAR(20) DEFAULT 'requested',
  created_at TIMESTAMP DEFAULT NOW()
);
