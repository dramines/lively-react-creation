
-- Add place_id column to events table if it doesn't exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS place_id INT;

-- Add foreign key constraint if it doesn't exist
-- First check if the constraint already exists
SET @constraint_exists = (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'events'
    AND CONSTRAINT_NAME = 'fk_place_id'
);

-- Add the constraint if it doesn't exist
SET @sql = IF(@constraint_exists = 0,
    'ALTER TABLE events ADD CONSTRAINT fk_place_id FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE',
    'SELECT \'Constraint already exists\' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
