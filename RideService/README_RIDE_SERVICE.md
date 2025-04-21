# Ride Service API

This document describes the available endpoints for the Ride Service.

---

## Endpoints

### 1. Create Ride

- **URL:** `/createRide`
- **Method:** `POST`
- **Auth:** User must be logged in (JWT in `Authorization` header)

#### Request Example

```json
{
  "pickup": { "latitude": 12.9716, "longitude": 77.5946 },
  "drop": { "latitude": 12.2958, "longitude": 76.6394 }
}
```

#### Response Example

- **Success:**  
  `201 Created`
  ```json
  "ride created and published to queue"
  ```
- **Error:**  
  `400 Bad Request`
  ```json
  {
    "error": "Error details"
  }
  ```

---

### 2. Accept Ride

- **URL:** `/accept/:id`
- **Method:** `POST`
- **Auth:** Captain must be logged in (JWT in `Authorization` header)

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

No body required. `:id` is the ride ID.

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "_id": "rideId",
    "userId": "userId",
    "pickup": "Location A",
    "drop": "Location B",
    "status": "accepted",
    "captainId": "captainId"
    // ...other fields
  }
  ```
- **Error:**  
  `404 Not Found`
  ```json
  {}
  ```
  `400 Bad Request`
  ```json
  {
    "error": "Ride cannot be accepted"
  }
  ```

---

### 3. Cancel Ride

- **URL:** `/cancel/:id`
- **Method:** `POST`
- **Auth:** User or Captain must be logged in (JWT in `Authorization` header)

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

No body required. `:id` is the ride ID.

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "_id": "rideId",
    "status": "canceled"
    // ...other fields
  }
  ```
- **Error:**  
  `404 Not Found`
  ```json
  {}
  ```
  `400 Bad Request`
  ```json
  {
    "error": "Ride cannot be canceled"
  }
  ```

---

### 4. Complete Ride

- **URL:** `/complete/:id`
- **Method:** `POST`
- **Auth:** User or Captain must be logged in (JWT in `Authorization` header)

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

No body required. `:id` is the ride ID.

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "_id": "rideId",
    "status": "completed"
    // ...other fields
  }
  ```
- **Error:**  
  `404 Not Found`
  ```json
  {}
  ```
  `400 Bad Request`
  ```json
  {
    "error": "Ride cannot be completed"
  }
  ```

---

## Notes

- All endpoints are prefixed by `/`.
- For protected endpoints, provide the JWT access token in the `Authorization` header.
- Replace `:id` in the URL with the actual ride ID.
