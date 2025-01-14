
-- Create an enum type for product units
CREATE TYPE product_unit AS ENUM ('lb', 'kg', 'g', '500g', 'piece', 'box');

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    unit product_unit NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    supplier_id UUID REFERENCES auth.users(id),
    description TEXT,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster supplier-based queries
CREATE INDEX idx_products_supplier ON products(supplier_id);

-- Create index for faster searches by name
CREATE INDEX idx_products_name ON products(name);

-- Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Everyone can view active products
CREATE POLICY "Anyone can view active products"
    ON products FOR SELECT
    USING (is_active = true);

-- Only suppliers can insert their own products
CREATE POLICY "Suppliers can insert their own products"
    ON products FOR INSERT
    WITH CHECK (
        auth.uid() = supplier_id 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'supplier'
        )
    );

-- Only suppliers can update their own products
CREATE POLICY "Suppliers can update their own products"
    ON products FOR UPDATE
    USING (
        auth.uid() = supplier_id 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'supplier'
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();