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
