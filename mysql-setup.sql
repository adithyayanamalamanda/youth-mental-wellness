-- Create database
CREATE DATABASE IF NOT EXISTS mood_assessment;

USE mood_assessment;

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS otp_verification (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    otp VARCHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL
);

-- You can add other tables for users, assessments, results as needed
