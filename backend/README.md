# MelkChain Backend API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account

**Request Body:**
```json
{
  "full_name": "علی احمدی",
  "email": "ali@example.com",
  "password": "Password123",
  "phone": "09123456789",
  "national_id": "1234567890",
  "referred_by": "optional-referral-code"
}
```

**Response:**
```json
{
  "success": true,
  "message": "حساب کاربری با موفقیت ایجاد شد",
  "data": {
    "user": {
      "id": "user_id",
      "full_name": "علی احمدی",
      "email": "ali@example.com",
      "role": "investor",
      "referral_code": "MELK-ALI-ABC123"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### POST /api/auth/login
Login with email and password

**Request Body:**
```json
{
  "email": "ali@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ورود موفقیت‌آمیز",
  "data": {
    "user": { /* user profile */ },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### GET /api/auth/profile
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user profile */ }
  }
}
```

### PUT /api/auth/profile
Update user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "full_name": "علی احمدی جدید",
  "phone": "09123456789",
  "national_id": "1234567890"
}
```

### POST /api/auth/refresh-token
Refresh access token

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error message in Persian",
  "errors": [ /* validation errors if any */ ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
