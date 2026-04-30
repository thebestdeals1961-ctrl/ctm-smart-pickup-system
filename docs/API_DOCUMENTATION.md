# CTM Smart Pickup - API Documentation

## Base URL
```
Local:   http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

**Response:**
```json
{
  "status": "OK",
  "message": "CTM Smart Pickup API is running",
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

---

### Authentication

#### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "role": "admin"  // or "dispatcher" or "driver"
}
```

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "admin"
  },
  "token": "jwt-token-here"
}
```

#### Get Current User
```
GET /api/auth/me
```
Requires authentication.

---

### Users (Admin Only)

#### Get All Users
```
GET /api/users
```

#### Get User by ID
```
GET /api/users/:id
```

#### Update User Status
```
PUT /api/users/:id/status
```
**Body:**
```json
{
  "status": "active"  // or "inactive", "suspended"
}
```

---

### Drivers

#### Get All Drivers
```
GET /api/drivers
```

#### Get Available Drivers
```
GET /api/drivers/available
```

#### Register Driver (Admin Only)
```
POST /api/drivers/register
```
**Body:**
```json
{
  "user_id": "uuid",
  "vehicle_type": "Sedan",
  "vehicle_plate": "ABC-1234",
  "license_number": "DL001"
}
```

#### Update Driver Status
```
PUT /api/drivers/:id/status
```
**Body:**
```json
{
  "status": "available",
  "is_online": true,
  "current_location": { "lat": 40.7128, "lng": -74.0060 }
}
```

---

### Passengers

#### Get All Passengers
```
GET /api/passengers
```

#### Register Passenger
```
POST /api/passengers/register
```
**Body:**
```json
{
  "user_id": "uuid",
  "home_address": "123 Main St",
  "work_address": "456 Business Ave"
}
```

---

### Rides

#### Get All Rides
```
GET /api/rides
```
**Query Parameters:**
- `status` - Filter by status
- `driver_id` - Filter by driver
- `passenger_id` - Filter by passenger
- `limit` - Number of results (default: 50)

#### Get Ride by ID
```
GET /api/rides/:id
```

#### Create Ride
```
POST /api/rides
```
**Body:**
```json
{
  "passenger_id": "uuid",
  "pickup_location": "123 Main St",
  "dropoff_location": "456 Airport Rd",
  "pickup_lat": 40.7128,
  "pickup_lng": -74.0060,
  "dropoff_lat": 40.7589,
  "dropoff_lng": -73.9851,
  "estimated_fare": 25.00,
  "notes": "Flight at 3pm"
}
```

#### Assign Driver to Ride
```
PUT /api/rides/:id/assign
```
**Body:**
```json
{
  "driver_id": "uuid"
}
```

#### Update Ride Status
```
PUT /api/rides/:id/status
```
**Body:**
```json
{
  "status": "completed",
  "actual_fare": 28.50,
  "cancellation_reason": "optional reason"
}
```

**Valid statuses:** `picked_up`, `in_progress`, `completed`, `cancelled`

---

### Dashboard (Admin Only)

#### Get Dashboard Statistics
```
GET /api/dashboard/stats
```

#### Get Recent Rides
```
GET /api/dashboard/recent-rides
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message here"
}
```

**Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
