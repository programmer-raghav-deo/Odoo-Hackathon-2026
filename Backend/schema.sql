-- Enums for Statuses
CREATE TYPE vehicle_status AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');
CREATE TYPE driver_status AS ENUM ('Available', 'On Trip', 'Off Duty', 'Suspended');
CREATE TYPE trip_status AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');
CREATE TYPE user_role AS ENUM ('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst');

-- 1. Users & Roles (RBAC)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL -- Enforces exact matches for RBAC
);

-- 2. Vehicle Registry
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    reg_number VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Van', 'Truck', 'Mini'
    max_capacity_kg INT NOT NULL,
    odometer INT NOT NULL DEFAULT 0,
    acquisition_cost NUMERIC(12, 2) NOT NULL,
    revenue NUMERIC(12, 2) DEFAULT 0.00,
    status vehicle_status DEFAULT 'Available'
);

-- 3. Driver Management
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL, -- 'LMV', 'HMV'
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    safety_score INT DEFAULT 100,
    status driver_status DEFAULT 'Available'
);

-- 4. Trip Management
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    trip_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'TR001'
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    vehicle_id INT REFERENCES vehicles(id),
    driver_id INT REFERENCES drivers(id),
    cargo_weight_kg INT NOT NULL,
    planned_distance_km INT NOT NULL,
    status trip_status DEFAULT 'Draft'
);

-- 5. Maintenance Logs
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id),
    service_type VARCHAR(255) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Fuel & Expense Tracking
CREATE TABLE fuel_expenses (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id),
    vehicle_id INT REFERENCES vehicles(id),
    liters INT,
    fuel_cost NUMERIC(10, 2) DEFAULT 0.00,
    toll NUMERIC(10, 2) DEFAULT 0.00,
    other_cost NUMERIC(10, 2) DEFAULT 0.00
);
