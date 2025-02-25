-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Add policy for suppliers to delete their own products
CREATE POLICY "Suppliers can delete their own products"
ON products
FOR DELETE
USING (
  auth.uid() = supplier_id
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'supplier'
  )
); 