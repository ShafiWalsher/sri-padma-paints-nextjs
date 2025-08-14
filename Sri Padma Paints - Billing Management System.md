# Sri Padma Paints - Billing Management System

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Completed Features](#completed-features)
- [Current Status](#current-status)
- [Upcoming Features](#upcoming-features)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Development Guidelines](#development-guidelines)
- [Deployment Notes](#deployment-notes)

---

## 🎯 Project Overview

**Sri Padma Paints Billing Management System** is a comprehensive web application designed to handle the complete business workflow of a paint store, from customer management to billing and payment tracking.

### Business Problem Solved

- **Customer Management**: Handle customers with multiple projects/accounts
- **Delivery Notes**: Issue customer receipts immediately upon purchase
- **Billing System**: Convert delivery notes to official tax documents with discounts
- **Payment Tracking**: Track credit customer payments across multiple accounts
- **Financial Reporting**: Generate daily sales reports and customer statements

### Key Business Features

- **Dual Transaction Types**: Cash (immediate) vs Credit (account-based)
- **Multi-Account Customers**: Engineers with multiple projects can maintain separate accounts
- **Two-Stage Process**: Delivery Notes (customer receipts) → Bills (tax documents)
- **Flexible Payments**: Apply payments to specific accounts or bills
- **Comprehensive Reporting**: Daily sales, customer statements, account breakdowns

---

## 🏗️ System Architecture

### Technology Stack

- **Backend**: PHP 8+ with MySQLi
- **Database**: MySQL 8.0+ with InnoDB engine
- **Frontend**: Next.js 14 with TypeScript
- **UI Framework**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: JWT with HTTP-only cookies

### Architecture Patterns

- **API-First Design**: RESTful PHP APIs with consistent JSON responses
- **Soft Delete**: All records use `del` flag instead of hard deletion
- **Transaction Safety**: Database transactions for multi-step operations
- **Type Safety**: Full TypeScript interfaces throughout frontend
- **Error Handling**: Global exception handlers with structured error responses

---

## 🗄️ Database Schema

### Core Tables

#### `customers`

```sql
CREATE TABLE customers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    mobile          VARCHAR(20) NOT NULL UNIQUE,
    address         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    del             TINYINT(1) DEFAULT 0
);
```

#### `customer_accounts`

```sql
CREATE TABLE customer_accounts (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    customer_id     INT NOT NULL,
    account_name    VARCHAR(255) NOT NULL,
    is_default      TINYINT(1) DEFAULT 0,
    balance         DECIMAL(10,2) DEFAULT 0.00,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del             TINYINT(1) DEFAULT 0,

    FOREIGN KEY (customer_id) REFERENCES customers(id),
    UNIQUE KEY unique_default (customer_id, is_default, del)
);
```

#### `vendors`

```sql
CREATE TABLE vendors (
    id              INT NOT NULL AUTO_INCREMENT,
    vendor_name     VARCHAR(150) NOT NULL,
    address         VARCHAR(255) DEFAULT NULL,
    city            VARCHAR(100) DEFAULT NULL,
    mobile          VARCHAR(30) DEFAULT NULL,
    email           VARCHAR(150) DEFAULT NULL,
    gst_number      VARCHAR(30) DEFAULT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY vendor_name (vendor_name)
);
```

#### `products`

```sql
CREATE TABLE products (
    id              INT NOT NULL AUTO_INCREMENT,
    vendor_id       INT DEFAULT NULL,
    product_name    VARCHAR(150),
    color           VARCHAR(100),
    package         VARCHAR(50),
    item_price      DECIMAL(10,2) DEFAULT NULL,
    quantity        INT DEFAULT NULL,
    del             TINYINT(1) DEFAULT 0,

    PRIMARY KEY (id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

---

## ✅ Completed Features

### 🧑🤝🧑 Customer Management (100% Complete)

#### Features Implemented:

1. **Create Customer**
   - Form with validation (name, mobile, address)
   - Automatic default account creation
   - Initial balance setting
   - Mobile number uniqueness validation
2. **Customer Listing**
   - Paginated table with search functionality
   - Shows total balance across all accounts
   - Default account name display
   - Account count per customer
   - Action menu (View, Edit, Delete)
3. **View Customer Details**
   - Complete customer profile display
   - Account breakdown with individual balances
   - Visual indicators for default accounts
   - Quick action buttons
   - Responsive design with loading states
4. **Edit Customer**
   - Reusable form component
   - Pre-populated with existing data
   - Mobile number conflict detection
   - Default account balance updates
5. **Delete Customer**
   - Soft delete implementation
   - Confirmation dialog with warnings
   - Cascading delete of all customer accounts
   - Audit trail ready

#### API Endpoints:

- `POST /customers/createCustomer.php`
- `GET /customers/getAllCustomers.php`
- `GET /customers/getCustomer.php`
- `GET /customers/getCustomerDetails.php`
- `POST /customers/updateCustomer.php`
- `POST /customers/deleteCustomer.php`

### 📊 Account Management (95% Complete)

#### Features Implemented:

1. **Add New Account**
   - Modal dialog interface
   - Account name uniqueness validation
   - Initial balance setting
   - Automatic non-default account creation
2. **Get Single Account**
   - Fetch individual account details
   - Include customer context information
   - Used for edit forms and detail views
3. **Edit Account**
   - Update account name and balance
   - Duplicate name prevention
   - Real-time form validation
   - Instant UI refresh
4. **Update Default Account**
   - Switch primary account designation
   - Automatic reset of previous default
   - Data integrity through transactions
   - Visual feedback with crown icons
5. **Delete Account** ⚠️ **(API Ready, UI Pending)**
   - Ultra-safe deletion with multiple validations
   - Cannot delete default accounts
   - Cannot delete accounts with balances
   - Minimum account requirement enforcement

#### API Endpoints:

- `POST /customer_accounts/addAccount.php`
- `GET /customer_accounts/getAccount.php`
- `POST /customer_accounts/editAccount.php`
- `POST /customer_accounts/updateDefaultAccount.php`
- `POST /customer_accounts/deleteAccount.php`

---

## 📈 Current Status

### What's Production Ready:

- ✅ **Customer CRUD Operations**: Full lifecycle management
- ✅ **Multi-Account System**: Engineers can manage multiple projects
- ✅ **Data Integrity**: Transaction-safe operations
- ✅ **Type Safety**: Complete TypeScript coverage
- ✅ **Error Handling**: Comprehensive validation and feedback
- ✅ **UI/UX**: Professional, responsive interface

### Technical Achievements:

- ✅ **Global Error Handler**: All PHP exceptions return structured JSON
- ✅ **Axios Interceptors**: Automatic success/error toast notifications
- ✅ **React Query Integration**: Optimistic updates and caching
- ✅ **Form Validation**: Zod schemas with real-time feedback
- ✅ **Reusable Components**: Modular UI component library

---

## 🚀 Upcoming Features

### Phase 3: Delivery Notes System

Create customer receipts immediately upon purchase.

#### Features to Implement:

1. **Create Delivery Note**
   - Product selection with pricing
   - Customer/Account selection
   - Cash vs Credit transaction types
   - Immediate receipt generation
2. **List Delivery Notes**
   - Filter by date range, customer, status
   - Batch operations for admin review
   - Pending notes dashboard
3. **Note Management**
   - Edit pending notes
   - Cancel/void notes
   - Customer receipt printing

#### Database Tables Needed:

```sql
CREATE TABLE delivery_notes (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    note_number         VARCHAR(50) NOT NULL UNIQUE,
    customer_account_id INT NULL,
    customer_name       VARCHAR(255) NOT NULL,
    customer_mobile     VARCHAR(20),
    date                DATE NOT NULL,
    items               JSON NOT NULL,
    total_amount        DECIMAL(10,2) NOT NULL,
    transaction_type    ENUM('cash','credit') NOT NULL,
    status              ENUM('pending','billed','cancelled') DEFAULT 'pending',
    bill_id             BIGINT UNSIGNED NULL,
    created_by          VARCHAR(250),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 4: Bills/Invoicing System

Convert delivery notes to official tax documents.

#### Features to Implement:

1. **Create Bills from Delivery Notes**
   - Admin review and approval workflow
   - Apply discounts (percentage or fixed amount)
   - Sequential bill numbering
   - Multiple notes → single bill
2. **Bill Management**
   - View bill details
   - Print/PDF generation
   - Bill correction/cancellation
3. **Daily Sales Tracking**
   - Automatic sales aggregation
   - Cash vs Credit breakdown
   - Discount tracking

#### Database Tables Needed:

```sql
CREATE TABLE bills (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bill_number     VARCHAR(50) NOT NULL UNIQUE,
    bill_date       DATE NOT NULL,
    bill_type       ENUM('cash','credit') NOT NULL,
    customer_account_id INT NULL,
    customer_name   VARCHAR(255) NOT NULL,
    items           JSON NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount    DECIMAL(10,2) NOT NULL,
    delivery_note_ids JSON,
    created_by      VARCHAR(250),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_sales (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    sale_date   DATE NOT NULL UNIQUE,
    cash_sales  DECIMAL(12,2) DEFAULT 0.00,
    credit_sales DECIMAL(12,2) DEFAULT 0.00,
    total_sales DECIMAL(12,2) DEFAULT 0.00,
    total_discount DECIMAL(12,2) DEFAULT 0.00,
    bills_count INT DEFAULT 0
);
```

### Phase 5: Payment System

Track and apply customer payments.

#### Features to Implement:

1. **Record Payments**
   - Payment method tracking
   - Reference number support
   - Multiple account payment distribution
2. **Payment Application**
   - Apply to specific bills
   - Automatic balance updates
   - Partial payment handling

#### Database Tables Needed:

```sql
CREATE TABLE account_payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    customer_account_id INT NOT NULL,
    payment_date    DATE NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    payment_method  VARCHAR(50) DEFAULT 'cash',
    reference_no    VARCHAR(100),
    notes           TEXT,
    created_by      VARCHAR(250),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 6: Reports \& Analytics

Comprehensive business intelligence.

#### Features to Implement:

1. **Daily Reports**
   - Sales summary by cash/credit
   - Top customers by volume
   - Product performance analysis
2. **Customer Reports**
   - Account statements
   - Payment history
   - Outstanding balance reports
3. **Financial Reports**
   - Monthly/yearly sales trends
   - Collection efficiency
   - Profit margin analysis

---

## 📚 API Documentation

### Standard Response Format

All APIs return consistent JSON responses:

```typescript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "error": "Error message description"
}
```

### Authentication

All APIs require bearer token authentication:

```
Authorization: Bearer XkrM5FQOVu
```

### Error Handling

- **Global Exception Handler**: Converts all PHP errors to structured JSON
- **Transaction Rollback**: Failed operations automatically rollback
- **Validation Errors**: Clear, actionable error messages

---

## 🎨 Frontend Components

### Reusable UI Components

- **FormInput**: Standardized form fields with validation
- **DataTable**: Paginated tables with search and sort
- **Modal Dialogs**: Consistent dialog patterns
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: Success/error feedback

### Page Patterns

- **List Pages**: Consistent table layout with actions
- **Detail Pages**: Information cards with quick actions
- **Form Pages**: Standardized create/edit forms
- **Modal Forms**: Inline editing without page navigation

---

## 💻 Development Guidelines

### Backend Standards

```php
// Always use parameterized queries
GetRow("SELECT * FROM customers WHERE id = ?", [$customerId], $con);

// Wrap multi-step operations in transactions
$con->begin_transaction();
try {
    // Multiple operations
    $con->commit();
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}

// Consistent error responses
respond(['success' => false, 'error' => $e->getMessage()], 500);
```

### Frontend Standards

```typescript
// Use TypeScript interfaces
interface Customer {
  id: string;
  name: string;
  mobile: string;
}

// Implement loading states
const { data, isLoading } = useQuery({
  queryKey: ["customers"],
  queryFn: customerServices.fetchCustomers,
});

// Form validation with Zod
const schema = z.object({
  name: z.string().min(3, "Name required"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile"),
});
```

### Database Standards

- Use `BIGINT UNSIGNED` for high-volume tables (delivery_notes, bills)
- Always include `created_at` and `updated_at` timestamps
- Implement soft deletes with `del` flag
- Use `DECIMAL(10,2)` for monetary amounts
- Create proper indexes for frequently queried columns

---

## 🚀 Deployment Notes

### Requirements

- **PHP**: 8.0+ with MySQLi extension
- **MySQL**: 8.0+ with InnoDB storage engine
- **Node.js**: 18+ for Next.js frontend
- **Web Server**: Apache/Nginx with PHP-FPM

### Environment Setup

```bash
# Backend setup
cp config.example.php config.php
# Update database credentials

# Frontend setup
npm install
cp .env.example .env.local
# Update API base URL
```

### Database Migration

```sql
-- Import the provided schema
SOURCE schema.sql;

-- Create default admin user
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$04$A03nn7YjgT5vnCnIWIRyPuYFlTSKrT7JwLD9k422j9rJNpGU7UJs6', 'admin');
```

### Production Considerations

- Enable HTTPS for all API endpoints
- Configure PHP session security settings
- Set up database connection pooling
- Implement request rate limiting
- Configure backup strategies for critical data

---

## 📊 Success Metrics

### Technical Achievements

- **Zero Data Loss**: All operations are transaction-safe
- **Type Safety**: 100% TypeScript coverage
- **Error Recovery**: Comprehensive error handling with rollback
- **Performance**: Optimized queries with proper indexing
- **User Experience**: Consistent UI patterns with loading states

### Business Value

- **Multi-Project Support**: Engineers can manage separate project accounts
- **Audit Trail**: Complete history of all customer transactions
- **Financial Accuracy**: Precise balance tracking across accounts
- **Scalability**: Architecture supports thousands of customers/transactions
- **Compliance Ready**: Structured for tax reporting and audit requirements

---

_Last Updated: August 11, 2025 - Customer \& Account Management Complete_
