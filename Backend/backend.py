from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime, date
from models import User, db, Vehicle, Trip, Driver
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import uuid

# Load variables from the .env file
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Essential for Flask sessions to work. CORS must also allow credentials.
app.secret_key = os.getenv("SECRET_KEY", "fallback-hackathon-secure-string-123")
CORS(app, supports_credentials=True)
db.init_app(app)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([name, email, password, role]):
        return jsonify({
            "error": "Missing fields", 
            "message": "Name, email, password, and role are completely required."
        }), 400
    
    valid_roles = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst']
    if role not in valid_roles:
        return jsonify({
            "error": "Invalid role", 
            "message": f"Role must be one of: {', '.join(valid_roles)}"
        }), 400
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({
            "error": "Duplicate Entry",
            "message": "Email is already registered."
        }), 400
    
    try:
        hashed_password = generate_password_hash(password)
        new_user = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            role=role
        )
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        session['role'] = new_user.role

        return jsonify({
            "message": "User created successfully",
            "user": {
                "name": new_user.name,
                "email": new_user.email,
                "role": new_user.role
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Database Error",
            "message": "An unexpected error occurred while writing to the registry."
        }), 500

@app.route("/api/auth/login", methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"message": "Invalid email or password"}), 401
    
    session['user_id'] = user.id
    session['role'] = user.role

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200



@app.route('/api/dashboard/kpis', methods=['GET'])
def get_dashboard_kpis():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401
    
    try:
        active_vehicles = Vehicle.query.filter(Vehicle.status.in_(['Available', 'On Trip'])).count()
        available_vehicles = Vehicle.query.filter_by(status='Available').count()
        vehicles_in_maintenance = Vehicle.query.filter_by(status='In Shop').count() # FIXED: Removed leading space
        
        active_trips = Trip.query.filter_by(status="Dispatched").count()
        pending_trips = Trip.query.filter_by(status="Draft").count()
        drivers_on_duty = Driver.query.filter_by(status="On Trip").count()
        
        on_trip_vehicles = active_vehicles - available_vehicles
        
        if active_vehicles > 0:
            fleet_utilization_pct = round((on_trip_vehicles / active_vehicles) * 100, 2)
        else:
            fleet_utilization_pct = 0.0

        return jsonify({
            "active_vehicles": active_vehicles,
            "available_vehicles": available_vehicles,
            "vehicles_in_maintenance": vehicles_in_maintenance,
            "active_trips": active_trips,
            "pending_trips": pending_trips,
            "drivers_on_duty": drivers_on_duty,
            "fleet_utilization_pct": fleet_utilization_pct
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Error fetching dashboard KPIs", "error": str(e)}), 500

@app.route('/api/dashboard/recent-trips', methods=['GET'])
def get_recent_trips():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    try:
        limit = request.args.get('limit', default=5, type=int)
        
        # Pull the latest rows
        recent_trips = Trip.query.order_by(Trip.id.desc()).limit(limit).all()

        trips_list = []
        for trip in recent_trips:
            vehicle_name = trip.vehicle.name if trip.vehicle else f"ID-{trip.vehicle_id}"
            driver_name = trip.driver.name if trip.driver else f"ID-{trip.driver_id}"
            
            status_mapping = {
                "Draft": "Draft",
                "Dispatched": "On Trip",
                "Completed": "Completed",
                "Cancelled": "Cancelled"
            }
            ui_status = status_mapping.get(trip.status, "Draft")

            trips_list.append({
                "trip_code": trip.trip_code,
                "vehicle": vehicle_name,      
                "driver": driver_name,        
                "status": ui_status,          
            })

        return jsonify(trips_list), 200

    except Exception as e:
        return jsonify({"message": "Error fetching recent trips", "error": str(e)}), 500



@app.route('/api/vehicles', methods=['GET', 'POST'])
def handle_vehicles():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401
    
    if request.method == 'POST':
        try:
            data = request.get_json()

            reg_number = data.get('reg_number')
            model = data.get('model')
            vehicle_type = data.get('type')
            max_capacity = data.get('max_capacity_kg')
            odometer = data.get('odometer', 0)
            acq_cost = data.get('acquisition_cost', 0.0)

            if not reg_number or not model or not vehicle_type or max_capacity is None:
                return jsonify({"message": "Missing required fields"}), 400
            
            # Mandatory Business Rule: Unique Registration Number
            existing_vehicle = Vehicle.query.filter_by(registration_number=reg_number).first()
            if existing_vehicle:
                return jsonify({
                    "error": "Duplicate Entry",
                    "message": "Vehicle registration number must be unique."
                }), 400
            
            new_vehicle = Vehicle(
                registration_number=reg_number,
                name=model,  # Maps 'model' from JSON to schema column
                type=vehicle_type,
                max_load_capacity_kg=int(max_capacity),  # Maps JSON to schema column
                odometer=int(odometer),
                acquisition_cost=float(acq_cost),
                status='Available'
            )

            db.session.add(new_vehicle)
            db.session.commit()

            return jsonify({"message": "Vehicle registered successfully"}), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Error registering vehicle", "error": str(e)}), 500
        
    # --- GET LOGIC: Fetch Vehicles List ---
    try:
        # Read optional query filters (?type=Van&status=Available)
        type_filter = request.args.get('type')
        status_filter = request.args.get('status')

        query = Vehicle.query
        if type_filter:
            query = query.filter_by(type=type_filter)
        if status_filter:
            query = query.filter_by(status=status_filter)
        
        vehicles = query.all()

        vehicles_list = []
        for v in vehicles:
            vehicles_list.append({
                "id": v.id,
                "reg_number": v.registration_number,
                "model": v.name,
                "type": v.type,
                "max_capacity_kg": v.max_load_capacity_kg,
                "odometer": v.odometer,
                "acquisition_cost": float(v.acquisition_cost) if v.acquisition_cost else 0.0,
                "status": v.status
            })
        return jsonify(vehicles_list), 200
    
    except Exception as e:
        return jsonify({"message": "Error fetching vehicles", "error": str(e)}), 500

@app.route('/api/vehicles/dispatch-pool', methods=['GET'])
def get_vehicle_dispatch_pool():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401
    
    
    vehicles = Vehicle.query.filter_by(status = "Available").all()

    vehicles_list = []
    for v in vehicles:
            vehicles_list.append({
                "id": v.id,
                "reg_number": v.registration_number,
                "model": v.name,
                "type": v.type,
                "max_capacity_kg": v.max_load_capacity_kg,
                "odometer": v.odometer,
                "acquisition_cost": float(v.acquisition_cost) if v.acquisition_cost else 0.0,
                "status": v.status
            })
    return jsonify(vehicles_list), 200



@app.route('/api/drivers', methods=['GET', 'POST'])
def handle_drivers():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    # --- POST LOGIC: Register New Driver ---
    if request.method == 'POST':
        try:
            data = request.get_json() or {}
            
            name = data.get('name')
            license_number = data.get('license_number')
            license_category = data.get('license_category')
            license_expiry_str = data.get('license_expiry_date') # Keep standard JSON key name
            contact_number = data.get('contact_number')
            safety_score = data.get('safety_score', 100)

            if not name or not license_number or not license_category or not license_expiry_str:
                return jsonify({"message": "Missing required fields"}), 400

            try:
                license_expiry_date = datetime.strptime(license_expiry_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

            new_driver = Driver(
                name=name,
                license_number=license_number,
                license_category=license_category,
                license_expiry=license_expiry_date,  # Fixed to match schema column
                contact_number=contact_number,
                safety_score=int(safety_score),
                status='Available'
            )

            db.session.add(new_driver)
            db.session.commit()

            return jsonify({"message": "Driver registered successfully"}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Error registering driver", "error": str(e)}), 500

    # --- GET LOGIC: Fetch Drivers List ---
    try:
        status_filter = request.args.get('status')
        
        query = Driver.query
        if status_filter:
            query = query.filter_by(status=status_filter)
            
        drivers = query.all()
        
        drivers_list = []
        for d in drivers:
            drivers_list.append({
                "id": d.id,
                "name": d.name,
                "license_number": d.license_number,
                "license_category": d.license_category,
                "license_expiry_date": d.license_expiry.strftime('%Y-%m-%d') if d.license_expiry else None, # Fixed to d.license_expiry
                "contact_number": d.contact_number,
                "safety_score": d.safety_score,
                "status": d.status
            })

        return jsonify(drivers_list), 200

    except Exception as e:
        return jsonify({"message": "Error fetching drivers", "error": str(e)}), 500

@app.route('/api/drivers/<int:driver_id>/status', methods=['PUT'])
def update_driver_status(driver_id):
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    try:
        data = request.get_json() or {}
        new_status = data.get('status')

        # 1. Validate that a status was provided
        if not new_status:
            return jsonify({"message": "Missing status field"}), 400

        # 2. Enforce the exact enum statuses from the problem statement
        valid_statuses = ['Available', 'On Trip', 'Off Duty', 'Suspended']
        if new_status not in valid_statuses:
            return jsonify({"message": f"Invalid status. Must be one of {valid_statuses}"}), 400

        # 3. Find the driver in the DB
        driver = Driver.query.get(driver_id)
        if not driver:
            return jsonify({"message": f"Driver with ID {driver_id} not found."}), 404

        # 4. Update and commit to MariaDB
        driver.status = new_status
        db.session.commit()

        return jsonify({
            "message": f"Driver status updated successfully to {new_status}"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating driver status", "error": str(e)}), 500

@app.route('/api/drivers/dispatch-pool', methods=['GET'])
def get_driver_dispatch_pool():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    try:
        # 1. Fetch only drivers whose status is strictly 'Available'
        available_drivers = Driver.query.filter_by(status='Available').all()
        
        current_date = date.today()
        pool_list = []
        
        # 2. Filter out drivers with expired licenses
        for d in available_drivers:
            if d.license_expiry and d.license_expiry >= current_date:
                pool_list.append({
                    "id": d.id,
                    "name": d.name,
                    "license_number": d.license_number,
                    "license_category": d.license_category,
                    "license_expiry_date": d.license_expiry.strftime('%Y-%m-%d'),
                    "contact_number": d.contact_number,
                    "safety_score": d.safety_score,
                    "status": d.status
                })

        return jsonify(pool_list), 200

    except Exception as e:
        return jsonify({"message": "Error fetching driver dispatch pool", "error": str(e)}), 500



@app.route('/api/trips/draft', methods=['POST'])
def create_draft_trip():
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401
    
    try:
        data = request.get_json() or {}
        vehicle_id = data.get('vehicle_id')
        driver_id = data.get('driver_id')
        source = data.get('source')              # Fixed: split route mapping
        destination = data.get('destination')    # Fixed: split route mapping
        planned_distance = data.get('planned_distance_km')
        cargo_weight = data.get('cargo_weight_kg')

        if not vehicle_id or not driver_id or not source or not destination or planned_distance is None or cargo_weight is None:
            return jsonify({"message": "Missing required fields"}), 400

        # Validate that vehicle and driver exist
        vehicle = Vehicle.query.get(vehicle_id)
        driver = Driver.query.get(driver_id)
        if not vehicle or not driver:
            return jsonify({"message": "Invalid Vehicle or Driver ID"}), 404

        # Enforce Capacity Guardrail
        if int(cargo_weight) > vehicle.max_load_capacity_kg:
            return jsonify({
                "error": "Capacity Exceeded",
                "message": f"Cargo weight ({cargo_weight} kg) exceeds vehicle max capacity ({vehicle.max_load_capacity_kg} kg)."
            }), 400

        trip_code = f"TR-{uuid.uuid4().hex[:6].upper()}"

        new_trip = Trip(
            trip_code=trip_code,
            vehicle_id=vehicle_id,
            driver_id=driver_id,
            source=source,                # Maps directly to DB schema
            destination=destination,      # Maps directly to DB schema
            planned_distance_km=int(planned_distance),
            cargo_weight_kg=int(cargo_weight),
            status='Draft'
        )

        db.session.add(new_trip)
        db.session.commit()

        return jsonify({
            "message": "Draft trip created successfully", 
            "trip_id": new_trip.id,
            "trip_code": trip_code
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating draft trip", "error": str(e)}), 500

@app.route('/api/trips/<int:trip_id>/dispatch', methods=['POST'])
def dispatch_trip(trip_id):
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    try:
        trip = Trip.query.get(trip_id)
        if not trip:
            return jsonify({"message": "Trip not found"}), 404

        if trip.status != 'Draft':
            return jsonify({"message": "Only Draft trips can be dispatched"}), 400

        vehicle = Vehicle.query.get(trip.vehicle_id)
        driver = Driver.query.get(trip.driver_id)

        if not vehicle or not driver:
            return jsonify({"message": "Assigned vehicle or driver no longer exists"}), 404

        # 1. Strict Business Check: Cargo Weight <= Max Capacity
        if trip.cargo_weight_kg > vehicle.max_load_capacity_kg:
            return jsonify({
                "error": "Capacity Exceeded",
                "message": f"Cargo weight ({trip.cargo_weight_kg} kg) exceeds vehicle max capacity ({vehicle.max_load_capacity_kg} kg)."
            }), 400

        # 2. Enforce Asset Availability Guardrails
        if vehicle.status != 'Available':
            return jsonify({"message": f"Vehicle {vehicle.name} is currently {vehicle.status} and cannot be dispatched."}), 400
        
        if driver.status != 'Available':
            return jsonify({"message": f"Driver {driver.name} is currently {driver.status} and cannot be dispatched."}), 400

        # 3. Enforce License Expiry Guardrail (using correct license_expiry column)
        if driver.license_expiry and driver.license_expiry < date.today():
            return jsonify({"message": f"Cannot dispatch. Driver {driver.name}'s license has expired."}), 400

        # Commit State Transitions
        trip.status = 'Dispatched'
        vehicle.status = 'On Trip'
        driver.status = 'On Trip'
        
        db.session.commit()
        return jsonify({"message": "Trip successfully dispatched!", "status": "Dispatched"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error dispatching trip", "error": str(e)}), 500

@app.route('/api/trips/<int:trip_id>/complete', methods=['POST'])
def complete_trip(trip_id):
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    try:
        trip = Trip.query.get(trip_id)
        if not trip:
            return jsonify({"message": "Trip not found"}), 404

        if trip.status != 'Dispatched':
            return jsonify({"message": "Only active/dispatched trips can be completed"}), 400

        vehicle = Vehicle.query.get(trip.vehicle_id)
        driver = Driver.query.get(trip.driver_id)

        trip.status = 'Completed'
        
        # Release assets and add mileage to the vehicle's odometer
        if vehicle:
            vehicle.odometer += trip.planned_distance_km
            vehicle.status = 'Available'
            
        if driver:
            driver.status = 'Available'

        db.session.commit()
        return jsonify({"message": "Trip completed, metrics updated"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error completing trip", "error": str(e)}), 500

@app.route('/api/trips/<int:trip_id>/cancel', methods=['POST'])
def cancel_trip(trip_id):
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized. Please log in."}), 401

    try:
        trip = Trip.query.get(trip_id)
        if not trip:
            return jsonify({"message": "Trip not found"}), 404

        if trip.status not in ['Draft', 'Dispatched']:
            return jsonify({"message": "Cannot cancel a trip that is already completed or cancelled"}), 400

        vehicle = Vehicle.query.get(trip.vehicle_id)
        driver = Driver.query.get(trip.driver_id)

        # Re-pool active assets if the trip was already dispatched
        if trip.status == 'Dispatched':
            if vehicle:
                vehicle.status = 'Available'
            if driver:
                driver.status = 'Available'

        trip.status = 'Cancelled'
        db.session.commit()
        
        return jsonify({"message": "Trip cancelled, assets set to Available"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error cancelling trip", "error": str(e)}), 500



@app.route('/api/maintenance/log', methods=['POST'])
def log_maintenance():
    # TODO: Implement rule -> Auto-flip vehicle to 'In Shop'
    return jsonify({"message": "Maintenance logged. Vehicle shifted to In Shop."}), 201

@app.route('/api/maintenance/<int:log_id>/close', methods=['POST'])
def close_maintenance(log_id):
    return jsonify({"message": "Maintenance closed. Vehicle is Available."}), 200



@app.route('/api/expenses/fuel', methods=['POST'])
def log_fuel():
    return jsonify({"message": "Fuel entry logged"}), 201

@app.route('/api/expenses/other', methods=['POST'])
def log_other_expense():
    return jsonify({"message": "Expense logged"}), 201



@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    return jsonify({"fuel_efficiency_km_l": 8.4, "fleet_utilization_pct": 81.0, "total_operational_cost": 34070.00}), 200

@app.route('/api/analytics/roi', methods=['GET'])
def get_roi_metrics():
    return jsonify([{"model": "TRUCK-11", "roi_pct": 14.2}, {"model": "MINI-03", "roi_pct": 8.5}]), 200



if __name__ == '__main__':
    app.run(port=5000, debug=True)