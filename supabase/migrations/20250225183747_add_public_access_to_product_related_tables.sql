-- Update policy for categories table to allow public access without authentication
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by anyone" ON categories
  FOR SELECT USING (true);

-- Update policy for product_images table to allow public access without authentication  
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;
CREATE POLICY "Product images are viewable by anyone" ON product_images
  FOR SELECT USING (true);

-- For products table, we already have "Anyone can view active products" policy
-- But we need to verify if it's correctly set for public access
ALTER POLICY "Anyone can view active products" ON products
  TO public USING (is_active = true);

-- Enable RLS on these tables to ensure policies are applied
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY; 