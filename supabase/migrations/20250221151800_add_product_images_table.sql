-- Remove image_url from products table
ALTER TABLE products
DROP COLUMN image_url;

-- Create product_images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create a partial unique index for primary images
CREATE UNIQUE INDEX unique_primary_image_per_product 
ON product_images (product_id) 
WHERE is_primary = true;

-- Create indexes for better performance
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);

-- Create trigger for updated_at
CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Product images are viewable by everyone" 
ON product_images FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Product images are manageable by suppliers" 
ON product_images FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM products
    JOIN profiles ON profiles.id = products.supplier_id
    WHERE products.id = product_images.product_id
    AND profiles.id = auth.uid()
    AND profiles.role = 'supplier'
  )
); 