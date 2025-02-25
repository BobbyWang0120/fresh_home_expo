-- Fix price precision to always display 2 decimal places
ALTER TABLE products 
  ALTER COLUMN price TYPE numeric(10,2),
  ALTER COLUMN discounted_price TYPE numeric(10,2);

-- Add a comment to the migration
COMMENT ON TABLE products IS 'Table storing product information with prices that always display 2 decimal places'; 