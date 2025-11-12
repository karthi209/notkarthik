-- Update the logs table constraint to include 'music' type
-- Run this if the logs table already exists

-- Drop the old constraint
ALTER TABLE logs DROP CONSTRAINT IF EXISTS logs_type_check;

-- Add the new constraint with 'music' included
ALTER TABLE logs ADD CONSTRAINT logs_type_check 
  CHECK (type IN ('music', 'games', 'movies', 'series', 'books'));
