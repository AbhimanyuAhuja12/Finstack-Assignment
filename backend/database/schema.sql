-- Create database
CREATE DATABASE IF NOT EXISTS task_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE task_management;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    task_type ENUM('Meeting', 'Call', 'Video Call', 'Email', 'Follow-up') NOT NULL,
    time VARCHAR(10) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    note TEXT NULL,
    status ENUM('Open', 'Closed', 'In Progress', 'Cancelled') NOT NULL DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_date DATE NULL,
    completed_at DATETIME NULL,
    
    INDEX idx_date (date),
    INDEX idx_entity_name (entity_name),
    INDEX idx_task_type (task_type),
    INDEX idx_contact_person (contact_person),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    INDEX idx_task_date_status (date, status),
    INDEX idx_task_entity_type (entity_name, task_type),
    INDEX idx_task_contact_status (contact_person, status)
);