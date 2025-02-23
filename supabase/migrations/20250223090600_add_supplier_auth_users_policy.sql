-- Enable RLS on auth.users if not already enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a function to check if the current user is a supplier
CREATE OR REPLACE FUNCTION auth.is_supplier()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'supplier'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy for suppliers to read user data
CREATE POLICY "Suppliers can view all users"
    ON auth.users
    FOR SELECT
    USING (
        -- Allow suppliers to view all users
        (SELECT auth.is_supplier())
        OR
        -- Users can view their own data
        (auth.uid() = id)
    );

-- Grant usage on auth schema to authenticated users
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Grant select on auth.users to authenticated users
GRANT SELECT ON auth.users TO authenticated; 