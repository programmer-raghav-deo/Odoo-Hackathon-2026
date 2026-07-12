from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from models import db

app = Flask(__name__)
CORS(app)
db.init_app(app)

@app.route("/api/auth/login", methods=['POST'])
def login():
    data = request.get_json()
    # TODO: Add database validation & 5-attempt lockout logic
    return jsonify({
        "message": "Login successful",
        "user": {"name": "Raven K.", "email": data.get('email'), "role": "Dispatcher"}
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200



@app.route('/api/dashboard/kpis', methods=['GET'])
def get_dashboard_kpis():
    # TODO: Aggregate database counts
    return jsonify({
        "active_vehicles": 53, "available_vehicles": 42, "vehicles_in_maintenance": 5,
        "active_trips": 18, "pending_trips": 9, "drivers_on_duty": 26, "fleet_utilization_pct": 81.0
    }), 200

@app.route('/api/dashboard/recent-trips', methods=['GET'])
def get_recent_trips():
    return jsonify([
        {"trip_code": "TR001", "vehicle": "VAN-05", "driver": "Alex", "status": "On Trip", "eta_or_notes": "45 min"}
    ]), 200



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