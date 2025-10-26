-- Add inactive_email_sent column to users table
ALTER TABLE users 
ADD COLUMN inactive_email_sent BOOLEAN DEFAULT FALSE;
