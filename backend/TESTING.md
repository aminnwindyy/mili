# تست کردن Authentication API

## روش 1: با Postman یا Insomnia

### 1. ثبت‌نام کاربر جدید
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "full_name": "علی احمدی",
  "email": "ali@example.com", 
  "password": "Password123",
  "phone": "09123456789",
  "national_id": "1234567890"
}
```

### 2. ورود کاربر
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "ali@example.com",
  "password": "Password123"
}
```

### 3. دریافت پروفایل (نیاز به توکن)
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <jwt_token_from_login>
```

### 4. به‌روزرسانی پروفایل
```
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "full_name": "علی احمدی جدید",
  "phone": "09987654321"
}
```

## روش 2: با curl (Command Line)

```bash
# ثبت‌نام
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "علی احمدی",
    "email": "ali@example.com",
    "password": "Password123",
    "phone": "09123456789"
  }'

# ورود
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ali@example.com", 
    "password": "Password123"
  }'

# پروفایل (با توکن)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## روش 3: تست خودکار با Jest

```bash
cd backend
npm test
```

## پاسخ‌های مورد انتظار

### ثبت‌نام موفق:
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

### خطاهای رایج:
```json
{
  "success": false,
  "message": "این ایمیل قبلاً ثبت شده است"
}
```
