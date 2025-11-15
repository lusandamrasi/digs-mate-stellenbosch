-- Update roommate_posts table schema
-- 1. Rename current_roommates to listing_capacity
-- 2. Add preferences column (text array)
-- 3. Add description column if it doesn't exist
-- 4. Fix trigger function to use correct column name

-- Step 0: Fix the trigger function if it exists (use updated_at instead of updatedAt)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 1: Add new columns first
ALTER TABLE public.roommate_posts
ADD COLUMN IF NOT EXISTS listing_capacity INTEGER;

-- Step 2: Add preferences column (text array)
ALTER TABLE public.roommate_posts
ADD COLUMN IF NOT EXISTS preferences TEXT[];

-- Step 3: Add description column if it doesn't exist (it should already exist, but adding for safety)
ALTER TABLE public.roommate_posts
ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 4: Update existing rows - calculate listing_capacity from current_roommates
-- Old logic: current_roommates = others already there (excluding poster)
-- New logic: listing_capacity = total capacity
-- Migration: capacity = current_roommates + 1 (poster) + roommates_needed
-- This gives us the total capacity based on existing data
UPDATE public.roommate_posts
SET listing_capacity = COALESCE(current_roommates, 0) + 1 + COALESCE(roommates_needed, 0);

-- Step 5: Now drop the old column (only if listing_capacity is successfully set)
ALTER TABLE public.roommate_posts
DROP COLUMN IF EXISTS current_roommates;

-- Step 6: Add comments for documentation
COMMENT ON COLUMN public.roommate_posts.listing_capacity IS 'Total capacity of the listing (e.g., 4 means room for 4 people total)';
COMMENT ON COLUMN public.roommate_posts.preferences IS 'Array of preference tags (e.g., ["Non-smoker", "Student", "Pet-friendly"])';
COMMENT ON COLUMN public.roommate_posts.description IS 'Detailed description of the post and what the poster is looking for';

