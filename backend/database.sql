-- Billing Management System Database Schema
-- Create this database and import this file to set up all tables

-- Set timezone to Asia/Kolkata
SET time_zone = '+05:30';

-- Create database
CREATE DATABASE IF NOT EXISTS sri_padma_paints;
USE sri_padma_paints;

-- ============================================
-- Users Admin
-- ============================================
CREATE TABLE users (
    id              INT NOT NULL AUTO_INCREMENT,
    username        VARCHAR(50) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('admin','employee') NOT NULL DEFAULT 'employee',
    created_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY username (username)
) ENGINE=InnoDB;

-- Insert default admin user
INSERT INTO users (username, password_hash, role, created_at) VALUES 
('admin', '$2a$04$A03nn7YjgT5vnCnIWIRyPuYFlTSKrT7JwLD9k422j9rJNpGU7UJs6', 'admin', NOW());

-- ============================================
-- Customer Table
-- ============================================
CREATE TABLE customers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    mobile          VARCHAR(20) NOT NULL UNIQUE,
    address         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    del             TINYINT(1) DEFAULT 0
) ENGINE=InnoDB;

-- ============================================
-- Customer Accounts
-- ============================================
CREATE TABLE customer_accounts (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    customer_id     INT NOT NULL,
    account_name    VARCHAR(255) NOT NULL,
    address         VARCHAR(255) NOT NULL,
    is_default      TINYINT(1) DEFAULT 0,
    balance         DECIMAL(10,2) DEFAULT 0.00,
    remark          VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del             TINYINT(1) DEFAULT 0,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;


-- ============================================
-- Delivery Notes Table
-- ============================================
CREATE TABLE delivery_notes (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    note_number         VARCHAR(50) NOT NULL UNIQUE,          -- DN-YYYYMMDD-001
    
    -- Customer Info
    customer_account_id INT NULL,                             -- NULL for cash customers
    customer_name       VARCHAR(255) NOT NULL,                -- For both cash and credit
    customer_mobile     VARCHAR(20),
    
    -- Transaction Details
    date                DATE NOT NULL,
    payment_type        ENUM('cash','credit') NOT NULL,
    
    -- Financial Calculations
    subtotal            DECIMAL(10,2) NOT NULL,               -- Before discount
    discount_percent    DECIMAL(5,2) DEFAULT 5.00,            -- Default discount %
    discount_amount     DECIMAL(10,2) DEFAULT 0.00,           -- Calculated discount amount
    total_amount        DECIMAL(10,2) NOT NULL,               -- After discount
    
    -- Status & Audit
    status              ENUM('pending','billed','cancelled') DEFAULT 'pending',
    items               JSON,                                 -- Optional: snapshot of items
    bill_id             BIGINT UNSIGNED NULL,                 -- Reference to future bill
    created_by          VARCHAR(250),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del                 TINYINT(1) DEFAULT 0,
    
    -- Indexes
    INDEX idx_customer_account (customer_account_id),
    INDEX idx_date (date),
    INDEX idx_payment_type (payment_type),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- Delivery Note Items Table
-- ============================================
CREATE TABLE delivery_note_items (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    delivery_note_id    BIGINT UNSIGNED NOT NULL,
    product_id          INT NOT NULL,
    product_name        VARCHAR(255) NOT NULL,                -- Snapshot at time of sale
    quantity            DECIMAL(8,2) NOT NULL,
    unit_price          DECIMAL(10,2) NOT NULL,                -- Price at time of sale
    color_code          VARCHAR(50),
    color_price         DECIMAL(10,2) DEFAULT 0.00,
    total               DECIMAL(10,2) NOT NULL,                -- (unit_price + color_price) * quantity
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (delivery_note_id) REFERENCES delivery_notes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_delivery_note (delivery_note_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ============================================
-- Vendors
-- ============================================
CREATE TABLE vendors (
    id              INT NOT NULL AUTO_INCREMENT,
    vendor_name     VARCHAR(150) NOT NULL,
    address         VARCHAR(255) DEFAULT NULL,
    city            VARCHAR(100) DEFAULT NULL,
    state           VARCHAR(100) DEFAULT NULL,
    postal_code     VARCHAR(20) DEFAULT NULL,
    mobile          VARCHAR(30) DEFAULT NULL,
    email           VARCHAR(150) DEFAULT NULL,
    gst_number      VARCHAR(30) DEFAULT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY vendor_name (vendor_name)
) ENGINE=InnoDB;

-- ============================================
-- Products
-- ============================================
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
) ENGINE=InnoDB;
