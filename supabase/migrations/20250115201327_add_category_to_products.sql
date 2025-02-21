-- Add category column to products table
ALTER TABLE products
ADD COLUMN category text;

-- Update existing rows to have a default value (empty for now)
UPDATE products
SET category = '';

-- Make the column required for future inserts
ALTER TABLE products
ALTER COLUMN category SET NOT NULL;