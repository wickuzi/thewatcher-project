-- Add last_inactive_email_sent column to users table
ALTER TABLE users 
ADD COLUMN last_inactive_email_sent DATE;
