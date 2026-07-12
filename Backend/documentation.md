# TransitOps API Endpoints Specification

This file contains the strict REST API data contracts between the Flask backend and the React frontend. All endpoints send and receive JSON payloads, enforcing role-based access control (RBAC) and business workflows.

---

## 🔐 1. Authentication & RBAC

### Log In User
* URL: /api/auth/login
* Method: POST
* Request Body:
  {
    "email": "raven.k@transitops.in",
    "password": "securepassword123"
  }
* Success Response (200 OK):
  {
    "message": "Login successful",
    "user": {
      "name": "Raven K.",
      "email": "raven.k@transitops.in",
      "role": "Dispatcher"
    }
  }
* Error Response (401 Unauthorized - Lockout Rule):
  {
    "error": "Invalid credentials",
    "message": "Invalid credentials. Account locked after 5 failed attempts."
  }

### Log Out User
* URL: /api/auth/logout
* Method: POST
* Success Response (200 OK):
  {
    "message": "Logged out successfully"
  }

---

## 📊 2. Dashboard Metrics

### Fetch KPI Summaries
* URL: /api/dashboard/kpis
* Method: GET
* Success Response (200 OK):
  {
    "active_vehicles": 53,
    "available_vehicles": 42,
    "vehicles_in_maintenance": 5,
    "active_trips": 18,
    "pending_trips": 9,
    "drivers_on_duty": 26,
    "fleet_utilization_pct": 81.0
  }

### Fetch Recent Trips Feed
* URL: /api/dashboard/recent-trips
* Method: GET
* Success Response (200 OK):
  [
    {
      "trip_code": "TR001",
      "vehicle": "VAN-05",
      "driver": "Alex",
      "status": "On Trip",
      "eta_or_notes": "45 min"
    },
    {
      "trip_code": "TR004",
      "vehicle": "TRK-12",
      "driver": "John",
      "status": "Completed",
      "eta_or_notes": "-"
    }
  ]

---

## 🚚 3. Vehicle Registry

### Fetch Vehicles List
* URL: /api/vehicles
* Method: GET
* Query Parameters (Optional): ?type=Van&status=Available
* Success Response (200 OK):
  [
    {
      "id": 1,
      "reg_number": "GJ01AB4521",
      "model": "VAN-05",
      "type": "Van",
      "max_capacity_kg": 500,
      "odometer": 74000,
      "acquisition_cost": 620000.00,
      "status": "Available"
    }
  ]

### Register New Vehicle
* URL: /api/vehicles
* Method: POST
* Request Body:
  {
    "reg_number": "GJ01AB4521",
    "model": "VAN-05",
    "type": "Van",
    "max_capacity_kg": 500,
    "acquisition_cost": 620000.00
  }
* Error Response (400 Bad Request):
  {
    "error": "Duplicate Entry",
    "message": "Vehicle registration number must be unique."
  }

### Fetch Vehicles for Dispatch Selection Dropdown
* URL: /api/vehicles/dispatch-pool
* Method: GET
* Success Response (200 OK): Filters out 'In Shop' or 'Retired' vehicles automatically.

---

## 👨‍✈️ 4. Driver Profiles

### Fetch Drivers List
* URL: /api/drivers
* Method: GET
* Success Response (200 OK):
  [
    {
      "id": 1,
      "name": "John",
      "license_number": "DL-44120",
      "license_category": "HMV",
      "license_expiry": "2026-03-15",
      "is_expired": true,
      "safety_score": 81,
      "status": "Suspended"
    }
  ]

### Register New Driver
* URL: /api/drivers
* Method: POST
* Request Body:
  {
    "name": "Alex",
    "license_number": "DL-88213",
    "license_category": "LMV",
    "license_expiry": "2028-12-31",
    "contact_number": "9876543210"
  }

### Update Driver Status
* URL: /api/drivers/<int:id>/status
* Method: PUT
* Request Body:
  {
    "status": "Suspended"
  }

### Fetch Drivers for Dispatch Selection Dropdown
* URL: /api/drivers/dispatch-pool
* Method: GET
* Success Response (200 OK): Excludes drivers with expired licenses or Suspended status.

---

## 🗺️ 5. Trip Dispatcher

### Fetch All Trips
* URL: /api/trips
* Method: GET

### Create Draft Trip
* URL: /api/trips/draft
* Method: POST
* Request Body:
  {
    "source": "Gandhinagar Depot",
    "destination": "Ahmedabad Hub",
    "vehicle_id": 1,
    "driver_id": 3,
    "cargo_weight_kg": 700,
    "planned_distance_km": 38
  }

### Dispatch Trip
* URL: /api/trips/<int:id>/dispatch
* Method: POST
* Success Response (200 OK): Transitions trip to Dispatched, changes vehicle/driver to On Trip.
* Error Response (400 Bad Request):
  {
    "error": "Dispatch Blocked",
    "message": "Vehicle Capacity: 500 kg. Cargo Weight: 700 kg. Capacity exceeded by 200 kg -> dispatch blocked."
  }

### Complete Trip
* URL: /api/trips/<int:id>/complete
* Method: POST
* Request Body:
  {
    "final_odometer": 74500,
    "fuel_consumed_liters": 42
  }

### Cancel Dispatched Trip
* URL: /api/trips/<int:id>/cancel
* Method: POST
* Success Response (200 OK): Reverts vehicle and driver statuses back to Available.

---

## 🔧 6. Maintenance Logs

### Fetch Maintenance Logs
* URL: /api/maintenance/logs
* Method: GET

### Log Service Record
* URL: /api/maintenance/log
* Method: POST
* Request Body:
  {
    "vehicle_id": 1,
    "service_type": "Oil Change",
    "cost": 2500.00,
    "date": "2026-07-12"
  }
* Success Response (201 Created): Automatically sets vehicle status to In Shop.

### Close Maintenance Log
* URL: /api/maintenance/<int:id>/close
* Method: POST
* Success Response (200 OK): Restores vehicle status to Available.

---

## ⛽ 7. Fuel & Expense Management

### Fetch Fuel and Expense Logs
* URL: /api/expenses
* Method: GET

### Log Fuel Entry
* URL: /api/expenses/fuel
* Method: POST
* Request Body:
  {
    "vehicle_id": 1,
    "date": "2026-07-12",
    "liters": 42,
    "fuel_cost": 3150.00
  }

### Log Other Trip Expenses
* URL: /api/expenses/other
* Method: POST
* Request Body:
  {
    "trip_id": 1,
    "vehicle_id": 1,
    "toll": 120.00,
    "other_cost": 0.00
  }

---

## 📈 8. Reports & Analytics

### Fetch Aggregated Analytical Summary
* URL: /api/analytics/summary
* Method: GET
* Success Response (200 OK): Returns Fuel Efficiency, Fleet Utilization, and Total Operational Cost.

### Fetch Vehicle ROI Metrics
* URL: /api/analytics/roi
* Method: GET
* Success Response (200 OK): Returns calculated vehicle ROI percentages formatted for graphing.

### Export Analytical Data to CSV
* URL: /api/analytics/export
* Method: GET
