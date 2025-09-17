-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('student', 'landlord')),
    profile_photo_url TEXT,
    bio TEXT,
    preferences JSONB,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('digs', 'apartment', 'flat')),
    rooms INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    location JSONB NOT NULL,
    availability_start DATE,
    availability_end DATE,
    images TEXT[],
    listing_category TEXT NOT NULL CHECK (listing_category IN ('property', 'roommate_request', 'lease_takeover')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create roommate_posts table
CREATE TABLE roommate_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    photos TEXT[],
    location JSONB,
    price_per_person NUMERIC,
    description TEXT,
    roommates_needed INTEGER NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('roommate_needed', 'lease_takeover')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create roommate_responses table
CREATE TABLE roommate_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES roommate_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    accepted BOOLEAN DEFAULT false
);

-- Create chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    post_id UUID REFERENCES roommate_posts(id) ON DELETE CASCADE,
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user1_id, user2_id, listing_id),
    UNIQUE(user1_id, user2_id, post_id)
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create saved_listings table
CREATE TABLE saved_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, listing_id)
);

-- Create indexes for better performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_category ON listings(listing_category);
CREATE INDEX idx_listings_active ON listings(active);
CREATE INDEX idx_listings_location ON listings USING GIN(location);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created_at ON listings(created_at);

CREATE INDEX idx_roommate_posts_user_id ON roommate_posts(user_id);
CREATE INDEX idx_roommate_posts_post_type ON roommate_posts(post_type);
CREATE INDEX idx_roommate_posts_active ON roommate_posts(active);
CREATE INDEX idx_roommate_posts_created_at ON roommate_posts(created_at);

CREATE INDEX idx_roommate_responses_post_id ON roommate_responses(post_id);
CREATE INDEX idx_roommate_responses_user_id ON roommate_responses(user_id);

CREATE INDEX idx_chats_user1_id ON chats(user1_id);
CREATE INDEX idx_chats_user2_id ON chats(user2_id);
CREATE INDEX idx_chats_listing_id ON chats(listing_id);
CREATE INDEX idx_chats_post_id ON chats(post_id);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_saved_listings_user_id ON saved_listings(user_id);
CREATE INDEX idx_saved_listings_listing_id ON saved_listings(listing_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roommate_posts_updated_at BEFORE UPDATE ON roommate_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for listings table
CREATE POLICY "Anyone can view active listings" ON listings
    FOR SELECT USING (active = true);

CREATE POLICY "Users can view their own listings" ON listings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listings" ON listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON listings
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for roommate_posts table
CREATE POLICY "Anyone can view active roommate posts" ON roommate_posts
    FOR SELECT USING (active = true);

CREATE POLICY "Users can view their own roommate posts" ON roommate_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roommate posts" ON roommate_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roommate posts" ON roommate_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roommate posts" ON roommate_posts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for roommate_responses table
CREATE POLICY "Users can view responses to their posts" ON roommate_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM roommate_posts 
            WHERE roommate_posts.id = roommate_responses.post_id 
            AND roommate_posts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own responses" ON roommate_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert responses" ON roommate_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Post owners can update responses" ON roommate_responses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM roommate_posts 
            WHERE roommate_posts.id = roommate_responses.post_id 
            AND roommate_posts.user_id = auth.uid()
        )
    );

-- RLS Policies for chats table
CREATE POLICY "Users can view chats they participate in" ON chats
    FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create chats" ON chats
    FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update chats they participate in" ON chats
    FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view messages in their chats" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their chats" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- RLS Policies for saved_listings table
CREATE POLICY "Users can view their own saved listings" ON saved_listings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings" ON saved_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved listings" ON saved_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies for property images
CREATE POLICY "Anyone can view property images" ON storage.objects
    FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'property-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own property images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'property-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own property images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'property-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, password_hash, user_type)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        NEW.encrypted_password,
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to get user profile
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    user_type TEXT,
    profile_photo_url TEXT,
    bio TEXT,
    preferences JSONB,
    verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        u.email,
        u.user_type,
        u.profile_photo_url,
        u.bio,
        u.preferences,
        u.verified,
        u.created_at
    FROM users u
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to search listings
CREATE OR REPLACE FUNCTION public.search_listings(
    search_query TEXT DEFAULT '',
    listing_type_filter TEXT DEFAULT NULL,
    min_price NUMERIC DEFAULT NULL,
    max_price NUMERIC DEFAULT NULL,
    min_rooms INTEGER DEFAULT NULL,
    max_rooms INTEGER DEFAULT NULL,
    listing_category_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title TEXT,
    description TEXT,
    type TEXT,
    rooms INTEGER,
    price NUMERIC,
    location JSONB,
    availability_start DATE,
    availability_end DATE,
    images TEXT[],
    listing_category TEXT,
    active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_full_name TEXT,
    user_profile_photo_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.user_id,
        l.title,
        l.description,
        l.type,
        l.rooms,
        l.price,
        l.location,
        l.availability_start,
        l.availability_end,
        l.images,
        l.listing_category,
        l.active,
        l.created_at,
        l.updated_at,
        u.full_name,
        u.profile_photo_url
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.active = true
    AND (search_query = '' OR l.title ILIKE '%' || search_query || '%' OR l.description ILIKE '%' || search_query || '%')
    AND (listing_type_filter IS NULL OR l.type = listing_type_filter)
    AND (min_price IS NULL OR l.price >= min_price)
    AND (max_price IS NULL OR l.price <= max_price)
    AND (min_rooms IS NULL OR l.rooms >= min_rooms)
    AND (max_rooms IS NULL OR l.rooms <= max_rooms)
    AND (listing_category_filter IS NULL OR l.listing_category = listing_category_filter)
    ORDER BY l.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get roommate posts
CREATE OR REPLACE FUNCTION public.get_roommate_posts(
    post_type_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    listing_id UUID,
    title TEXT,
    photos TEXT[],
    location JSONB,
    price_per_person NUMERIC,
    description TEXT,
    roommates_needed INTEGER,
    post_type TEXT,
    active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_full_name TEXT,
    user_profile_photo_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rp.id,
        rp.user_id,
        rp.listing_id,
        rp.title,
        rp.photos,
        rp.location,
        rp.price_per_person,
        rp.description,
        rp.roommates_needed,
        rp.post_type,
        rp.active,
        rp.created_at,
        rp.updated_at,
        u.full_name,
        u.profile_photo_url
    FROM roommate_posts rp
    JOIN users u ON rp.user_id = u.id
    WHERE rp.active = true
    AND (post_type_filter IS NULL OR rp.post_type = post_type_filter)
    ORDER BY rp.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
