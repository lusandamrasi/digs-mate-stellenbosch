-- Add accommodation_type column to roommate_posts and lease_takeover_posts tables
-- Also add listing_capacity to lease_takeover_posts if it doesn't exist

-- Step 1: Add accommodation_type to roommate_posts
ALTER TABLE public.roommate_posts
ADD COLUMN IF NOT EXISTS accommodation_type TEXT;

-- Step 2: Add listing_capacity to lease_takeover_posts (if not already added)
ALTER TABLE public.lease_takeover_posts
ADD COLUMN IF NOT EXISTS listing_capacity INTEGER;

-- Step 3: Add accommodation_type to lease_takeover_posts
ALTER TABLE public.lease_takeover_posts
ADD COLUMN IF NOT EXISTS accommodation_type TEXT;

-- Step 4: Add comments for documentation
COMMENT ON COLUMN public.roommate_posts.accommodation_type IS 'Type of accommodation (e.g., apartment, digs, hostel, or custom text for "other")';
COMMENT ON COLUMN public.lease_takeover_posts.accommodation_type IS 'Type of accommodation (e.g., apartment, digs, hostel, or custom text for "other")';
COMMENT ON COLUMN public.lease_takeover_posts.listing_capacity IS 'Total capacity of the listing (e.g., 4 means room for 4 people total)';

