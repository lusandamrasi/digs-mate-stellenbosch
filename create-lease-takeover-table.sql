-- Create lease_takeover_posts table
CREATE TABLE public.lease_takeover_posts (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  listing_id uuid NULL,
  title text NOT NULL,
  photos text[] NULL,
  location jsonb NULL,
  monthly_rent numeric NULL,
  description text NULL,
  available_from date NULL,
  lease_ends date NULL,
  takeover_reason text NULL,
  active boolean NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  
  CONSTRAINT lease_takeover_posts_pkey PRIMARY KEY (id),
  CONSTRAINT lease_takeover_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles (user_id) ON DELETE CASCADE,
  CONSTRAINT lease_takeover_posts_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
  CONSTRAINT lease_takeover_posts_takeover_reason_check CHECK (
    takeover_reason = ANY (ARRAY[
      'abroad'::text,
      'graduation'::text,
      'moving'::text,
      'financial'::text,
      'other'::text
    ])
  )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lease_takeover_posts_user_id 
ON public.lease_takeover_posts USING btree (user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_lease_takeover_posts_active 
ON public.lease_takeover_posts USING btree (active) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_lease_takeover_posts_created_at 
ON public.lease_takeover_posts USING btree (created_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_lease_takeover_posts_available_from 
ON public.lease_takeover_posts USING btree (available_from) TABLESPACE pg_default;

-- Create trigger for updated_at
CREATE TRIGGER update_lease_takeover_posts_updated_at
  BEFORE UPDATE ON public.lease_takeover_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.lease_takeover_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view active lease takeover posts" ON public.lease_takeover_posts
  FOR SELECT USING (active = true);

CREATE POLICY "Users can create their own lease takeover posts" ON public.lease_takeover_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lease takeover posts" ON public.lease_takeover_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lease takeover posts" ON public.lease_takeover_posts
  FOR DELETE USING (auth.uid() = user_id);
