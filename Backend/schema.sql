-- Enums for Statuses
CREATE TYPE vehicle_status AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');
CREATE TYPE driver_status AS ENUM ('Available', 'On Trip', 'Off Duty', 'Suspended');
CREATE TYPE trip_status AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');
CREATE TYPE user_role AS ENUM ('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst');

-- 1. Users & Roles (RBAC)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst') NOT NULL
);

-- 2. Vehicle Registry
CREATE TABLE vehicles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    max_capacity_kg INT NOT NULL,
    odometer INT NOT NULL DEFAULT 0,
    acquisition_cost NUMERIC(12, 2) NOT NULL,
    revenue NUMERIC(12, 2) DEFAULT 0.00,
    status ENUM('Available', 'On Trip', 'In Shop', 'Retired') DEFAULT 'Available'
);

-- 3. Driver Management
CREATE TABLE drivers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL,
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    safety_score INT DEFAULT 100,
    status ENUM('Available', 'On Trip', 'Off Duty', 'Suspended') DEFAULT 'Available'
);

-- 4. Trip Management
CREATE TABLE trips (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_code VARCHAR(20) UNIQUE NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    vehicle_id BIGINT UNSIGNED,
    driver_id BIGINT UNSIGNED,
    cargo_weight_kg INT NOT NULL,
    planned_distance_km INT NOT NULL,
    status ENUM('Draft', 'Dispatched', 'Completed', 'Cancelled') DEFAULT 'Draft',
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- 5. Maintenance Logs
CREATE TABLE maintenance_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT UNSIGNED,
    service_type VARCHAR(255) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- 6. Fuel & Expense Tracking
CREATE TABLE fuel_expenses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT UNSIGNED,
    vehicle_id BIGINT UNSIGNED,
    liters INT,
    fuel_cost NUMERIC(10, 2) DEFAULT 0.00,
    toll NUMERIC(10, 2) DEFAULT 0.00,
    other_cost NUMERIC(10, 2) DEFAULT 0.00,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
