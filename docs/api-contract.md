# API Contract

This document defines the API endpoints that Frontend and Backend MUST follow.

## 📜 Rules
1. Backend MUST define endpoints BEFORE coding
2. Frontend MUST review and approve before building UI
3. Changes require team discussion and updating this document

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
```

**Success Response (201):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "student",
  "createdAt": "2026-03-31T10:00:00Z"
}
```

**Error Response (400/409):**
```json
{
  "error": "Email already exists",
  "statusCode": 409
}
```

---

### POST /api/auth/login
**Description:** Login user and issue JWT token
**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "johndoe", 
    "role": "student"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials",
  "statusCode": 401
}
```

---

## 🖥️ Equipment Endpoints

### GET /api/equipment
**Description:** Get all equipment items

**Query Parameters (optional):**
- `status` - Filter by status (Available, Checked Out, Under Repair, etc.)
- `location` - Filter by location (Lab A, Lab B, etc.)
- `search` - Search by name or serial number

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell Inspiron",
      "serialNumber": "SN123456",
      "status": "Available",
      "location": "Lab A",      "condition": "Good",
      "createdAt": "2026-03-31T10:00:00Z"
    }
  ],
  "total": 50
}
```

### POST /api/equipment
**Description:** Add new equipment item

**Request Body:**
```json
{
  "name": "string (required)",
  "serialNumber": "string (required, unique)",
  "status": "string (default: Available)",
  "location": "string (required)",
  "condition": "string (default: Good)"
}
```

**Success Response (201):**
```json
{
  "id": 2,
  "name": "Projector Epson",
  "serialNumber": "SN789012",
  "status": "Available",
  "location": "Lab B",
  "condition": "Good"
}
```

### PUT /api/equipment/:id
**Description:** Update existing equipment item

**Request Body:**
```json
{
  "name": "string (optional)",
  "status": "string (optional)",
  "location": "string (optional)",
  "condition": "string (optional)"
}
```

**Success Response (200):**
```json
{  "id": 2,
  "name": "Projector Epson",
  "serialNumber": "SN789012",
  "status": "Under Repair",
  "location": "Lab B",
  "condition": "Poor"
}
```

### DELETE /api/equipment/:id
**Description:** Delete equipment item (soft delete)

**Success Response (200):**
```json
{
  "message": "Equipment marked as retired",
  "id": 2
}
```

---

## 🔄 Checkout Endpoints

### POST /api/checkout
**Description:** Check out equipment to a borrower

**Request Body:**
```json
{
  "equipmentId": "number (required)",
  "borrowerId": "number (required)",
  "dueDate": "string (required, ISO date format)",
  "purpose": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "equipmentId": 1,
  "borrowerId": 5,
  "checkoutDate": "2026-03-31T10:00:00Z",
  "dueDate": "2026-04-07T23:59:59Z",
  "status": "ACTIVE"
}
```

**Error Response (400):**```json
{
  "error": "Equipment is not available",
  "statusCode": 400
}
```

### POST /api/checkout/:id/return
**Description:** Return checked out equipment

**Request Body:**
```json
{
  "conditionOnReturn": "string (required: Good/Damaged/Lost)",
  "notes": "string (required if Damaged or Lost)"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "status": "RETURNED",
  "returnedAt": "2026-04-05T14:30:00Z",
  "conditionOnReturn": "Good"
}
```

### GET /api/checkout/history/:userId
**Description:** Get checkout history for a specific user

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "equipmentName": "Laptop Dell",
      "checkoutDate": "2026-03-31T10:00:00Z",
      "dueDate": "2026-04-07T23:59:59Z",
      "returnedAt": "2026-04-05T14:30:00Z",
      "status": "RETURNED"
    }
  ]
}
```

---

## 🔧 Maintenance Endpoints
### POST /api/maintenance
**Description:** Schedule maintenance for equipment

**Request Body:**
```json
{
  "equipmentId": "number (required)",
  "maintenanceType": "string (required: Cleaning/Repair/Calibration/Software)",
  "scheduledDate": "string (required, ISO date format)",
  "notes": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "equipmentId": 1,
  "maintenanceType": "Repair",
  "scheduledDate": "2026-04-10T09:00:00Z",
  "status": "SCHEDULED"
}
```

### PUT /api/maintenance/:id/complete
**Description:** Mark maintenance as completed

**Request Body:**
```json
{
  "completedDate": "string (required, ISO date format)",
  "workPerformed": "string (required)",
  "cost": "number (optional)",
  "nextMaintenanceDue": "string (optional, ISO date format)"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "status": "COMPLETED",
  "completedDate": "2026-04-10T15:00:00Z",
  "workPerformed": "Replaced faulty power supply"
}
```

---
## 📊 Report Endpoints

### GET /api/reports/utilization
**Description:** Get equipment utilization report

**Query Parameters:**
- `startDate` - Start date for report (ISO format)
- `endDate` - End date for report (ISO format)
- `category` - Filter by equipment category (optional)

**Success Response (200):**
```json
{
  "data": [
    {
      "equipmentId": 1,
      "name": "Laptop Dell",
      "totalCheckouts": 15,
      "avgCheckoutDuration": 3.5,
      "utilizationPercent": 75
    }
  ]
}
```

### GET /api/reports/loss-damage
**Description:** Get loss/damage report

**Query Parameters:**
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

**Success Response (200):**
```json
{
  "data": [
    {
      "equipmentId": 3,
      "name": "Projector Epson",
      "incidentType": "Damaged",
      "incidentDate": "2026-04-01T10:00:00Z",
      "estimatedCost": 150.00,
      "notes": "Lens cracked during transport"
    }
  ],
  "totalCost": 150.00
}
```

### GET /api/reports/export**Description:** Export report data to CSV

**Query Parameters:**
- `type` - Report type: utilization, loss-damage, maintenance
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

**Success Response (200):**


**Deliverable:**
- ✅ All API endpoints defined in `/docs/api-contract.md`
- ✅ Frontend Developer has reviewed and approved
- ✅ Project Lead has approved

**Acceptance Criteria:**
- [ ] All CRUD operations defined
- [ ] Request/response formats clear
- [ ] Error responses documented
- [ ] Frontend Developer confirms they can build UI from this

---

### **ASSIGNMENT 4: FRONTEND DEVELOPER **

**WAIT UNTIL:** Backend Developer completes Task 3.1 (API Contract)

---

#### **TASK 4.1: Design UI Wireframes**

**GitHub Issue Title:** `Frontend: Create wireframes for all major screens`

**What to Do:**
1. Review API contract
2. Design wireframes for 5 major screens
3. Get approval from Project Lead

**How to Do It:**

**Use Figma (Free) or Balsamiq:**
```bash
# Go to https://www.figma.com/
# Create free account
# Create new design file

# Design these screens:
# 1. Login Page
# 2. Dashboard
# 3. Equipment Catalog
# 4. Checkout Form
# 5. Reports Page

# Export as PNG and save to /docs/wireframes/
