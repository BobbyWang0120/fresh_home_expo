-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN display_name TEXT,
ADD COLUMN avatar_url TEXT;

-- Create a function to sync user info from auth.users to profiles
CREATE OR REPLACE FUNCTION public.sync_user_info()
RETURNS TRIGGER AS $$
BEGIN
    -- For inserts and updates in auth.users
    UPDATE public.profiles
    SET 
        email = NEW.email,
        phone = NEW.phone,
        display_name = COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
        avatar_url = NEW.raw_user_meta_data->>'avatar_url',
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for syncing user info
DROP TRIGGER IF EXISTS sync_user_info ON auth.users;
CREATE TRIGGER sync_user_info
    AFTER INSERT OR UPDATE OF email, phone, raw_user_meta_data
    ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_user_info();

-- Sync existing users
UPDATE public.profiles p
SET 
    email = u.email,
    phone = u.phone,
    display_name = COALESCE(u.raw_user_meta_data->>'display_name', u.email),
    avatar_url = u.raw_user_meta_data->>'avatar_url',
    updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id; 