-- Add username field to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN username VARCHAR(50) UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_user_profiles_username ON user_profiles(username);

-- Update existing users to use email as initial username
-- Extract username from email (part before @)
UPDATE user_profiles 
SET username = SUBSTRING(email FROM '^([^@]+)')
WHERE username IS NULL;

-- Add NOT NULL constraint after populating existing records
ALTER TABLE user_profiles 
ALTER COLUMN username SET NOT NULL;

-- Add check constraint for username format (alphanumeric, underscores, hyphens only)
ALTER TABLE user_profiles 
ADD CONSTRAINT username_format_check 
CHECK (username ~ '^[a-zA-Z0-9_-]+$' AND LENGTH(username) >= 3);

-- Create function to check username availability
CREATE OR REPLACE FUNCTION check_username_available(check_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE LOWER(username) = LOWER(check_username)
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get user by username or email
CREATE OR REPLACE FUNCTION get_user_by_identifier(identifier TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  username TEXT,
  full_name TEXT,
  profile_photo_url TEXT,
  bio TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    up.email,
    up.username,
    up.full_name,
    up.profile_photo_url,
    up.bio
  FROM user_profiles up
  WHERE LOWER(up.email) = LOWER(identifier) 
     OR LOWER(up.username) = LOWER(identifier);
END;
$$ LANGUAGE plpgsql;
