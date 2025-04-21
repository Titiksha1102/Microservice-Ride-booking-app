# Captain Service API

This document describes the available endpoints for the Captain Service.

---

## Authentication

- Most endpoints require JWT authentication via the `Authorization: Bearer <token>` header.
- Some endpoints require the captain to be logged in or logged out.

---

## Endpoints

### 1. Register Captain

- **URL:** `/register`
- **Method:** `POST`
- **Auth:** None

#### Request Example

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  
}
```

#### Response Example

- **Success:**  
  `201 Created`
  ```json
  {
    "message": "Captain registered successfully"
  }
  ```
- **Error:**  
  `400 Bad Request`
  ```json
  {
    "error": "Validation error message"
  }
  ```

---

### 2. Login

- **URL:** `/login`
- **Method:** `POST`
- **Auth:** Captain must NOT be logged in

#### Request Example

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>"
  }
  ```
- **Error:**  
  `400 Bad Request`
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

### 3. Renew Access Token

- **URL:** `/renewaccesstoken`
- **Method:** `POST`
- **Auth:** None

#### Request Example

```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "accessToken": "<new-jwt-access-token>"
  }
  ```
- **Error:**  
  `400 Bad Request`
  ```json
  {
    "message": "Invalid refresh token"
  }
  ```

---

### 4. Toggle Availability

- **URL:** `/toggleAvailability`
- **Method:** `POST`
- **Auth:** Captain must be logged in

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

_No body required._

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "message": "Availability toggled successfully"
  }
  ```
- **Error:**  
  `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### 5. Listen to Rides

- **URL:** `/listenToRides`
- **Method:** `GET`
- **Auth:** Captain must be logged in

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

_No body required._

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  [
    {
      "rideId": "ride123",
      "pickup": "Location A",
      "dropoff": "Location B",
      "customer": "Customer Name"
    }
  ]
  ```
- **Error:**  
  `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### 6. Accept Ride

- **URL:** `/acceptRide`
- **Method:** `POST`
- **Auth:** Captain must be logged in

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

```json
{
  "rideId": "ride123"
}
```

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "message": "Ride accepted successfully"
  }
  ```
- **Error:**  
  `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### 7. Logout

- **URL:** `/logout`
- **Method:** `POST`
- **Auth:** Captain must be logged in

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

_No body required._

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **Error:**  
  `400 Bad Request`
  ```json
  {
    "message": "Captain not logged in"
  }
  ```

---

### 8. Get Captain Profile

- **URL:** `/profile`
- **Method:** `GET`
- **Auth:** Captain must be logged in

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

_No body required._

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "_id": "captainId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "isAvailable": true
    // ...other fields
  }
  ```
- **Error:**  
  `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### 9. Edit Captain Profile

- **URL:** `/editprofile`
- **Method:** `PUT`
- **Auth:** Captain must be logged in

#### Request Example

Headers:
```
Authorization: Bearer <jwt-access-token>
```

```json
{
  "phone": "9876543210"
}
```

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "_id": "captainId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "isAvailable": true
    // ...other fields
  }
  ```
- **Error:**  
  `400 Bad Request`
  ```json
  {
    "error": "Validation error message"
  }
  ```

---

### 10. Delete Captain

- **URL:** `/:id`
- **Method:** `DELETE`
- **Auth:** None

#### Request Example

_No authentication or body required._

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "message": "Captain deleted successfully"
  }
  ```
- **Error:**  
  `404 Not Found`
  ```json
  {
    "message": "Captain not found"
  }
  ```

---

## Notes

- All endpoints are prefixed by `/` (e.g., `/login`, `/register`).
- For protected endpoints, provide the JWT access token in the `Authorization` header.
