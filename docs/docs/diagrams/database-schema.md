# Database Schema Documentation

## Overview

This document describes the database schema for the Computer Lab Inventory System at Tubman University.

## Database Engine

- **Type**: SQLite 3
- **Mode**: WAL (Write-Ahead Logging) for data integrity
- **Location**: User AppData folder (offline-first architecture)

## Tables

### 1. USERS

Stores system users with role-based access control.

| Column        | Type         | Constraint      | Description                      |
| ------------- | ------------ | --------------- | -------------------------------- |
| id            | INTEGER      | PRIMARY KEY     | Unique user identifier           |
| username      | VARCHAR(50)  | UNIQUE NOT NULL | Login username                   |
| email         | VARCHAR(100) | UNIQUE NOT NULL | User email                       |
| password_hash | VARCHAR(255) | NOT NULL        | Bcrypt hashed password           |
| role          | VARCHAR(20)  | NOT NULL        | admin/technician/faculty/student |
| department    | VARCHAR(50)  | NULL            | Department affiliation           |
| is_active     | BOOLEAN      | DEFAULT TRUE    | Account status                   |
| created_at    | DATETIME     | DEFAULT NOW     | Record creation                  |
| updated_at    | DATETIME     | DEFAULT NOW     | Last update                      |

### 2. CATEGORIES

Equipment classification with hierarchical support.

| Column      | Type        | Constraint  | Description                      |
| ----------- | ----------- | ----------- | -------------------------------- |
| id          | INTEGER     | PRIMARY KEY | Unique category identifier       |
| name        | VARCHAR(50) | NOT NULL    | Category name                    |
| description | TEXT        | NULL        | Category description             |
| parent_id   | INTEGER     | FOREIGN KEY | Self-reference for subcategories |

### 3. EQUIPMENT

Tracks all lab assets and their details.

| Column          | Type         | Constraint          | Description                                     |
| --------------- | ------------ | ------------------- | ----------------------------------------------- |
| id              | INTEGER      | PRIMARY KEY         | Unique equipment identifier                     |
| serial_number   | VARCHAR(100) | UNIQUE NOT NULL     | Equipment serial number                         |
| name            | VARCHAR(200) | NOT NULL            | Equipment name                                  |
| category_id     | INTEGER      | FOREIGN KEY         | Links to categories table                       |
| model           | VARCHAR(100) | NULL                | Model number                                    |
| purchase_date   | DATE         | NULL                | Purchase date                                   |
| warranty_expiry | DATE         | NULL                | Warranty expiration                             |
| location        | VARCHAR(50)  | NOT NULL            | Lab A/B/C                                       |
| condition       | VARCHAR(20)  | DEFAULT 'Good'      | New/Good/Fair/Poor/Damaged                      |
| status          | VARCHAR(20)  | DEFAULT 'Available' | Available/Checked Out/Under Repair/Retired/Lost |
| created_at      | DATETIME     | DEFAULT NOW         | Record creation                                 |
| updated_at      | DATETIME     | DEFAULT NOW         | Last update                                     |

### 4. CHECKOUTS

Records equipment borrowing transactions.

| Column              | Type        | Constraint       | Description                |
| ------------------- | ----------- | ---------------- | -------------------------- |
| id                  | INTEGER     | PRIMARY KEY      | Unique checkout identifier |
| equipment_id        | INTEGER     | FOREIGN KEY      | Borrowed equipment         |
| borrower_id         | INTEGER     | FOREIGN KEY      | User borrowing equipment   |
| checkout_date       | DATE        | NOT NULL         | Checkout date              |
| due_date            | DATE        | NOT NULL         | Expected return date       |
| return_date         | DATE        | NULL             | Actual return date         |
| status              | VARCHAR(20) | DEFAULT 'ACTIVE' | ACTIVE/RETURNED/OVERDUE    |
| condition_on_return | VARCHAR(20) | NULL             | Good/Damaged/Lost          |
| notes               | TEXT        | NULL             | Return notes               |
| created_at          | DATETIME    | DEFAULT NOW      | Record creation            |

### 5. MAINTENANCE

Tracks equipment service and repairs.

| Column           | Type          | Constraint  | Description                       |
| ---------------- | ------------- | ----------- | --------------------------------- |
| id               | INTEGER       | PRIMARY KEY | Unique maintenance identifier     |
| equipment_id     | INTEGER       | FOREIGN KEY | Equipment being maintained        |
| technician_id    | INTEGER       | FOREIGN KEY | Technician performing maintenance |
| maintenance_type | VARCHAR(50)   | NOT NULL    | Type of maintenance               |
| scheduled_date   | DATE          | NOT NULL    | Scheduled date                    |
| completed_date   | DATE          | NULL        | Completion date                   |
| cost             | DECIMAL(10,2) | NULL        | Maintenance cost                  |
| notes            | TEXT          | NULL        | Maintenance details               |
| created_at       | DATETIME      | DEFAULT NOW | Record creation                   |

### 6. ALERTS

System notifications for events and warnings.

| Column       | Type        | Constraint        | Description                |
| ------------ | ----------- | ----------------- | -------------------------- |
| id           | INTEGER     | PRIMARY KEY       | Unique alert identifier    |
| type         | VARCHAR(50) | NOT NULL          | OVERDUE/WARRANTY/LOW_STOCK |
| equipment_id | INTEGER     | FOREIGN KEY       | Related equipment          |
| checkout_id  | INTEGER     | FOREIGN KEY       | Related checkout           |
| message      | TEXT        | NOT NULL          | Alert message              |
| severity     | VARCHAR(20) | DEFAULT 'WARNING' | INFO/WARNING/CRITICAL      |
| is_read      | BOOLEAN     | DEFAULT FALSE     | Read status                |
| created_at   | DATETIME    | DEFAULT NOW       | Alert creation             |

### 7. ACTIVITY_LOGS

Audit trail of all system actions.

| Column      | Type        | Constraint  | Description               |
| ----------- | ----------- | ----------- | ------------------------- |
| id          | INTEGER     | PRIMARY KEY | Unique log identifier     |
| user_id     | INTEGER     | FOREIGN KEY | User who performed action |
| action_type | VARCHAR(20) | NOT NULL    | CREATE/UPDATE/DELETE      |
| entity_type | VARCHAR(50) | NOT NULL    | equipment/checkout/user   |
| entity_id   | INTEGER     | NOT NULL    | ID of affected entity     |
| old_value   | JSON        | NULL        | Previous values           |
| new_value   | JSON        | NULL        | New values                |
| created_at  | DATETIME    | DEFAULT NOW | Log timestamp             |

## Relationships

### One-to-Many (1:N)

- **USERS → CHECKOUTS**: One user can borrow many items
- **USERS → MAINTENANCE**: One technician performs many maintenance tasks
- **USERS → ACTIVITY_LOGS**: One user generates many log entries
- **CATEGORIES → EQUIPMENT**: One category has many equipment items
- **EQUIPMENT → CHECKOUTS**: One equipment can be checked out many times
- **EQUIPMENT → MAINTENANCE**: One equipment has many maintenance records
- **EQUIPMENT → ALERTS**: One equipment can have many alerts
- **CHECKOUTS → ALERTS**: One checkout can generate alerts

## Indexes (Performance Optimization)

```sql
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_checkout_due_date ON checkouts(due_date, status);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_checkout_equipment ON checkouts(equipment_id);
CREATE INDEX idx_checkout_borrower ON checkouts(borrower_id);
```
