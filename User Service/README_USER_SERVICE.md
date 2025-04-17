# User Service API

This document describes the available endpoints for the User Service.

---

## Authentication

- Most endpoints require JWT authentication via the `Authorization: Bearer <token>` header.
- Some endpoints require the user to be logged in or logged out.

---

## Endpoints

### 1. Register User

- **URL:** `/register`
- **Method:** `POST`
- **Auth:** None

#### Request Example

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourpassword",
  "phone": "1234567890"
}
```

#### Response Example

- **Success:**  
  `201 Created`
  ```json
  {
    "message": "user registered successfully"
  }
  ```
- **Error:**  
  `409 Conflict`
  ```json
  {
    "error": "email already registered"
  }
  ```
  or  
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
- **Auth:** User must NOT be logged in

#### Request Example

```json
{
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>",
    "user": {
      "_id": "userId",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "1234567890"
      // ...other fields
    }
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
- **Auth:** None (uses refresh token cookie)

#### Request Example

_No body required. The `refreshToken` is sent as a cookie._

#### Response Example

- **Success:**  
  `200 OK`
  ```json
  {
    "accessToken": "<new-jwt-access-token>",
    "user": {
      "_id": "userId",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "1234567890"
      // ...other fields
    }
  }
  ```
- **Error:**  
  `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized"
  }
  ```
  or  
  `401 Unauthorized`
  ```json
  {
    "message": "Your session has expired. Please login again."
  }
  ```

---

### 4. Logout

- **URL:** `/logout`
- **Method:** `POST`
- **Auth:** User must be logged in

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
    "message": "User not logged in"
  }
  ```

---

### 5. Get User Profile

- **URL:** `/profile`
- **Method:** `GET`
- **Auth:** User must be logged in

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
    "_id": "userId",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "1234567890"
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
- **Error:**  
  `404 Not Found`
  ```json
  {
    "message": "User not found"
  }
  ```

---

### 6. Edit User Profile

- **URL:** `/editprofile`
- **Method:** `PUT`
- **Auth:** User must be logged in

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
    "_id": "userId",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210"
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
- **Error:**  
  `404 Not Found`
  ```json
  {
    "message": "User not found"
  }
  ```

---

### 7. Delete User

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
    "message": "User deleted successfully"
  }
  ```
- **Error:**  
  `404 Not Found`
  ```json
  {
    "message": "User not found"
  }
  ```

---

## Notes

- All endpoints are prefixed by `/` (e.g., `/login`, `/register`).
- For protected endpoints, provide the JWT access token in the `Authorization` header.
- For `/renewaccesstoken`, the refresh token is expected as a cookie.
