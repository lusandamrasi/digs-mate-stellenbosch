-- Run this in your Supabase SQL Editor to automatically sync users

-- Function to sync auth users to public user table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."user" (
    id,
    email,
    name,
    full_name,
    user_type,
    bio,
    profile_photo_url,
    preferences,
    verified,
    "emailVerified",
    image,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'user_type',
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'profile_photo_url',
    NEW.raw_user_meta_data->'preferences',
    COALESCE((NEW.email_confirmed_at IS NOT NULL), false),
    COALESCE((NEW.email_confirmed_at IS NOT NULL), false),
    NEW.raw_user_meta_data->>'image',
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    user_type = EXCLUDED.user_type,
    bio = EXCLUDED.bio,
    profile_photo_url = EXCLUDED.profile_photo_url,
    preferences = EXCLUDED.preferences,
    verified = EXCLUDED.verified,
    "emailVerified" = EXCLUDED."emailVerified",
    image = EXCLUDED.image,
    "updatedAt" = EXCLUDED."updatedAt";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically sync new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing users (run this once to sync existing users)
INSERT INTO public."user" (
  id,
  email,
  name,
  full_name,
  user_type,
  bio,
  profile_photo_url,
  preferences,
  verified,
  "emailVerified",
  image,
  "createdAt",
  "updatedAt"
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email),
  au.raw_user_meta_data->>'user_type',
  au.raw_user_meta_data->>'bio',
  au.raw_user_meta_data->>'profile_photo_url',
  au.raw_user_meta_data->'preferences',
  COALESCE((au.email_confirmed_at IS NOT NULL), false),
  COALESCE((au.email_confirmed_at IS NOT NULL), false),
  au.raw_user_meta_data->>'image',
  au.created_at,
  au.updated_at
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type,
  bio = EXCLUDED.bio,
  profile_photo_url = EXCLUDED.profile_photo_url,
  preferences = EXCLUDED.preferences,
  verified = EXCLUDED.verified,
  "emailVerified" = EXCLUDED."emailVerified",
  image = EXCLUDED.image,
  "updatedAt" = EXCLUDED."updatedAt";
