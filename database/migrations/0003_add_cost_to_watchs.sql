-- Add cost column to watchs table
ALTER TABLE watchs
ADD COLUMN cost INTEGER NOT NULL DEFAULT 0;
