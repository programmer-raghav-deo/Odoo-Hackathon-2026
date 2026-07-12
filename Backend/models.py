from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    
    # Exclude password hash from serialization loops for security
    serialize_rules = ('-password_hash',)

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'), nullable=False)

class Vehicle(db.Model, SerializerMixin):
    __tablename__ = "vehicles"
    
    # Avoid recursive relationship depth when serializing
    serialize_rules = ('-trips.vehicle', '-maintenance_logs.vehicle', '-fuel_expenses.vehicle',)

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    reg_number = db.Column(db.String(50), unique=True, nullable=False)
    model = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    max_capacity_kg = db.Column(db.Integer, nullable=False)
    odometer = db.Column(db.Integer, nullable=False, default=0)
    acquisition_cost = db.Column(db.Numeric(12, 2), nullable=False)
    revenue = db.Column(db.Numeric(12, 2), default=0.00)
    status = db.Column(db.Enum('Available', 'On Trip', 'In Shop', 'Retired'), default='Available')

    # Relationships
    trips = db.relationship('Trip', backref='vehicle', lazy=True)
    maintenance_logs = db.relationship('MaintenanceLog', backref='vehicle', lazy=True)
    fuel_expenses = db.relationship('FuelExpense', backref='vehicle', lazy=True)

class Driver(db.Model, SerializerMixin):
    __tablename__ = "drivers"
    
    serialize_rules = ('-trips.driver',)

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    license_category = db.Column(db.String(20), nullable=False)
    license_expiry = db.Column(db.Date, nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    safety_score = db.Column(db.Integer, default=100)
    status = db.Column(db.Enum('Available', 'On Trip', 'Off Duty', 'Suspended'), default='Available')

    # Relationships
    trips = db.relationship('Trip', backref='driver', lazy=True)

class Trip(db.Model, SerializerMixin):
    __tablename__ = "trips"
    
    serialize_rules = ('-vehicle.trips', '-driver.trips', '-fuel_expenses.trip',)

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    trip_code = db.Column(db.String(20), unique=True, nullable=False)
    source = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    
    vehicle_id = db.Column(db.BigInteger, db.ForeignKey('vehicles.id'), nullable=True)
    driver_id = db.Column(db.BigInteger, db.ForeignKey('drivers.id'), nullable=True)
    
    cargo_weight_kg = db.Column(db.Integer, nullable=False)
    planned_distance_km = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Enum('Draft', 'Dispatched', 'Completed', 'Cancelled'), default='Draft')

    # Relationships
    fuel_expenses = db.relationship('FuelExpense', backref='trip', lazy=True)

class MaintenanceLog(db.Model, SerializerMixin):
    __tablename__ = "maintenance_logs"
    
    serialize_rules = ('-vehicle.maintenance_logs',)

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    vehicle_id = db.Column(db.BigInteger, db.ForeignKey('vehicles.id'), nullable=True)
    service_type = db.Column(db.String(255), nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

class FuelExpense(db.Model, SerializerMixin):
    __tablename__ = "fuel_expenses"
    
    serialize_rules = ('-trip.fuel_expenses', '-vehicle.fuel_expenses',)

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    trip_id = db.Column(db.BigInteger, db.ForeignKey('trips.id'), nullable=True)
    vehicle_id = db.Column(db.BigInteger, db.ForeignKey('vehicles.id'), nullable=True)
    liters = db.Column(db.Integer, nullable=True)
    fuel_cost = db.Column(db.Numeric(10, 2), default=0.00)
    toll = db.Column(db.Numeric(10, 2), default=0.00)
    other_cost = db.Column(db.Numeric(10, 2), default=0.00)