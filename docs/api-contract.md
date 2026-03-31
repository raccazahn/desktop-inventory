# API Contract

This document defines the API endpoints that Frontend and Backend MUST follow.

## 📜 Rules
1. Backend MUST define endpoints BEFORE coding
2. Frontend MUST review and approve before building UI
3. Changes require team discussion

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
**Description:** Register a new user

**Request Body:**
```json
{
  "username": "string (required, unique)",
  "email": "string (required, email format)", 
  "password": "string (required, min 6 chars)",
  "role": "string (required: admin/technician/faculty/student)"
}

{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "student"
}

{
  "email": "string (required)",
  "password": "string (required)"
}

{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "johndoe", 
    "role": "student"
  }
}

{
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell",
      "serialNumber": "SN123",
      "status": "Available",
      "location": "Lab A"
    }
  ]
}


