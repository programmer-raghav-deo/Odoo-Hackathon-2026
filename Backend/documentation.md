# TransitOps API Endpoints Specification

This file contains the strict REST API data contracts between the Flask backend and the React frontend. All endpoints send and receive JSON payloads, enforcing role-based access control (RBAC) and business workflows.

---

## 🔐 1. Authentication & RBAC

### Register New User
* URL: /api/auth/register
* Method: POST
* Request Body:
  {
    "name": "Raven K.",
    "email": "raven.k@transitops.in",
    "password": "securepassword123",
    "role": "Dispatcher"
  }
*(Note: role must match exactly: 'Fleet Manager', 'Dispatcher', 'Safety Officer', or 'Financial Analyst')*
* Success Response (201 Created):
  {
    "message": "User created successfully",
    "user": {
      "name": "Raven K.",
      "email": "raven.k@transitops.in",
      "role": "Dispatcher"
    }
  }
* Error Response (400 Bad Request):
  {
    "error": "Duplicate Entry",
    "message": "Email is already registered."
  }

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
* Query Parameters:
  * `limit` (optional, default: 5): The number of recent trips to return.
* Success Response (200 OK):
  [
    {
      "trip_code": "TR001",
      "vehicle": "VAN-05",
      "driver": "Alex",
      "status": "On Trip"
    },
    {
      "trip_code": "TR004",
      "vehicle": "TRK-12",
      "driver": "John",
      "status": "Completed"
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
    "odometer": 0,
    "acquisition_cost": 620000.00
  }
* Success Response (201 Created):
  {
    "message": "Vehicle registered successfully"
  }
* Error Response (400 Bad Request):
  {
    "error": "Duplicate Entry",
    "message": "Vehicle registration number must be unique."
  }

### Fetch Vehicles for Dispatch Selection Dropdown
* URL: /api/vehicles/dispatch-pool
* Method: GET
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
* URL: /api/drivers/<driver_id>/status
* Method: PUT
* Request Body:
  {
    "status": "Suspended"
  }
* Success Response (200 OK):
  {
    "message": "Driver status updated successfully to Suspended"
  }
* Error Response (400 Bad Request):
  {
    "message": "Invalid status. Must be one of ['Available', 'On Trip', 'Off Duty', 'Suspended']"
  }

### Fetch Drivers for Dispatch Selection Dropdown
* URL: /api/drivers/dispatch-pool
* Method: GET
* Success Response (200 OK): Filters out 'Suspended', 'Off Duty', 'On Trip', and expired licenses automatically.
  [
    {
      "id": 1,
      "name": "Alex",
      "license_number": "DL-98765432",
      "license_category": "Heavy Commercial",
      "license_expiry_date": "2028-11-15",
      "contact_number": "+1234567890",
      "safety_score": 95,
      "status": "Available"
    }
  ]

---

## 🗺️ 5. Trip Management

### Create Draft Trip
* URL: /api/trips/draft
* Method: POST
* Request Body:
  {
    "vehicle_id": 1,
    "driver_id": 3,
    "source": "Warehouse A",
    "destination": "Hub B",
    "planned_distance_km": 120,
    "cargo_weight_kg": 450
  }
* Success Response (201 Created):
  {
    "message": "Draft trip created successfully",
    "trip_id": 101,
    "trip_code": "TR-B2C3D4"
  }

### Dispatch Trip
* URL: /api/trips/<trip_id>/dispatch
* Method: POST
* Success Response (200 OK):
  {
    "message": "Trip successfully dispatched!",
    "status": "Dispatched"
  }

### Complete Trip
* URL: /api/trips/<trip_id>/complete
* Method: POST
* Success Response (200 OK):
  {
    "message": "Trip completed, metrics updated"
  }

### Cancel Trip
* URL: /api/trips/<trip_id>/cancel
* Method: POST
* Success Response (200 OK):
  {
    "message": "Trip cancelled, assets set to Available"
  }


---

## 🛠️ 6. Maintenance Management

### Log Maintenance Event
* URL: /api/maintenance/log
* Method: POST
* Request Body:
  {
    "vehicle_id": 1,
    "service_type": "Brake Replacement",
    "cost": 3500.00,
    "date": "2026-07-15"
  }
* Success Response (201 Created):
  { "message": "Maintenance logged. Vehicle shifted to In Shop." }

### Close Maintenance Event
* URL: /api/maintenance/<log_id>/close
* Method: POST
* Success Response (200 OK):
  { "message": "Maintenance closed. Vehicle is Available." }

---

## 💳 7. Expense Management

### Log Fuel Entry
* URL: /api/expenses/fuel
* Method: POST
* Request Body:
  {
    "trip_id": 12,
    "vehicle_id": 1,
    "liters": 45,
    "fuel_cost": 4100.00
  }
* Success Response (201 Created):
  { "message": "Fuel entry logged" }

### Log Tolls & Other Expenses
* URL: /api/expenses/other
* Method: POST
* Request Body:
  {
    "trip_id": 12,
    "vehicle_id": 1,
    "toll": 250.00,
    "other_cost": 150.00
  }
* Success Response (201 Created):
  { "message": "Expense logged" }

---

## 📊 8. Analytics & Dashboard

### Get Analytics KPI Summary
* URL: /api/analytics/summary
* Method: GET
* Success Response (200 OK):
  {
    "fuel_efficiency_km_l": 8.4,
    "fleet_utilization_pct": 25.0,
    "total_operational_cost": 34070.00
  }

### Get Vehicle Asset ROI Metrics
* URL: /api/analytics/roi
* Method: GET
* Success Response (200 OK):
  [
    {
      "model": "VAN-05",
      "roi_pct": 14.2
    }
  ]

### Export Analytical Data to CSV
* URL: /api/analytics/export
* Method: GET
* Success Response (200 OK): Streams a raw file attachment streaming `fleet_analytics_report.csv` directly into the client's file downloads.