from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
from models import User, db, Vehicle, Trip, Driver
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

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
    if request.method == 'POST':
        data = request.get_json()
        # TODO: Insert new vehicle into DB
        return jsonify({"message": "Vehicle registered successfully"}), 201
    
    # GET logic
    return jsonify([
        {"id": 1, "reg_number": "GJ01AB4521", "model": "VAN-05", "type": "Van", "status": "Available"}
    ]), 200

@app.route('/api/vehicles/dispatch-pool', methods=['GET'])
def get_vehicle_dispatch_pool():
    #Return all eligible vehicles for dispatch
    return jsonify([{"id": 1, "model": "VAN-05", "max_capacity_kg": 500}]), 200



@app.route('/api/drivers', methods=['GET', 'POST'])
def handle_drivers():
    if request.method == 'POST':
        #TODO: Insert new driver in DB
        return jsonify({"message": "Driver registered successfully"}), 201
    #TODO: If GET requst return all drivers list
    return jsonify([
        {"id": 1, "name": "John", "license_number": "DL-44120", "status": "Available", "safety_score": 81}
    ]), 200

@app.route('/api/drivers/<int:driver_id>/status', methods=['PUT'])
def update_driver_status(driver_id):
    data = request.get_json()
    return jsonify({"message": f"Driver {driver_id} status updated to {data.get('status')}"}), 200

@app.route('/api/drivers/dispatch-pool', methods=['GET'])
def get_driver_dispatch_pool():
    return jsonify([{"id": 3, "name": "Driver Bob"}]), 200



@app.route('/api/trips/draft', methods=['POST'])
def create_draft_trip():
    return jsonify({"message": "Draft trip created successfully", "trip_id": 101}), 201

@app.route('/api/trips/<int:trip_id>/dispatch', methods=['POST'])
def dispatch_trip(trip_id):
    # TODO: Implement strict checks (Cargo Weight <= Max Capacity)
    return jsonify({"message": "Trip successfully dispatched!", "status": "Dispatched"}), 200

@app.route('/api/trips/<int:trip_id>/complete', methods=['POST'])
def complete_trip(trip_id):
    return jsonify({"message": "Trip completed, metrics updated"}), 200

@app.route('/api/trips/<int:trip_id>/cancel', methods=['POST'])
def cancel_trip(trip_id):
    return jsonify({"message": "Trip cancelled, assets set to Available"}), 200



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