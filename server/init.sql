CREATE DATABASE IF NOT EXISTS glide_analytics;
USE glide_analytics;

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    `system` VARCHAR(255),
    db_name VARCHAR(255) NOT NULL,
    db_prefix VARCHAR(50) DEFAULT 'tbl',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clients (name, `system`, db_name, db_prefix) 
VALUES ('GlideMission', 'Laravel Core', 'glidemission_pcea_local_20260227_1922', '');
