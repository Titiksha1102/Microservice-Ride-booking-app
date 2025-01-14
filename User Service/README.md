# User Service API Documentation

## Endpoints

### Register User

**Endpoint:** `/users/register`

**Request Structure:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
 
}
```

**Example Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response Structure:**
```json
{
  "message": "string"
}
```

**Example Response:**
```json
{
  "message": "User registered successfully"
}
```

### Login

**Endpoint:** `/users/login`

**Request Structure:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Example Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Structure:**
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Example Response:**
```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

### Profile

**Endpoint:** `/users/profile`

**Request Structure:**
Headers:
```json
{
  "Authorization": "Bearer access-token"
}
```

**Example Request:**
Headers:
```json
{
  "Authorization": "Bearer your-access-token"
}
```

**Response Structure:**
```json
{
  "id": "object",
  "name": "string",
  "email": "string",
  
}
```

**Example Response:**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john.doe@example.com"
  
}
```

### Edit Profile

**Endpoint:** `/users/editprofile`

**Request Structure:**
Headers:
```json
{
  "Authorization": "Bearer access-token"
}
```
Body:
```json
{
  "fieldName": "string",
  
}
```

**Example Request:**
Headers:
```json
{
  "Authorization": "Bearer your-access-token"
}
Body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response Structure:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
}
```

**Example Response:**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Logout

**Endpoint:** `/users/logout`

**Request Structure:**
Headers:
```json
{
  "Authorization": "Bearer access-token"
}
```

**Example Request:**
Headers:
```json
{
  "Authorization": "Bearer your-access-token"
}
```

**Response Structure:**
```json
{
  "message": "string"
}
```

**Example Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Renew Access Token

**Endpoint:** `/users/renewaccesstoken`

**Request Structure:**
```json
{
  "refreshToken": "string"
}
```

**Example Request:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response Structure:**
```json
{
  "accessToken": "string"
}
```

**Example Response:**
```json
{
  "accessToken": "new-access-token"
}
