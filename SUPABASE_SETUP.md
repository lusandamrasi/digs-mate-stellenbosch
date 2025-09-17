# FlatMate Supabase Backend Setup Guide

This guide will help you set up your Supabase backend for the FlatMate application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your React app already set up

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `flatmate-stellenbosch`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this takes a few minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root:
```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from your project
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- All necessary tables (users, listings, roommate_posts, etc.)
- Row Level Security policies
- Database functions for search and filtering
- Storage bucket for images
- Triggers for automatic timestamps

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/**`
3. Under **Email Templates**, customize the confirmation email if needed
4. Enable **Email confirmations** if you want users to verify their email

## Step 6: Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. You should see the `property-images` bucket created by the schema
3. Configure bucket policies if needed (the schema includes basic policies)

## Step 7: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Check the browser console for any Supabase connection errors
3. Try creating a user account to test authentication

## Step 8: Production Setup

When deploying to production:

1. Update your environment variables with production values
2. In Supabase dashboard, update:
   - **Site URL** to your production domain
   - **Redirect URLs** to include your production domain
3. Consider enabling additional security features like:
   - Rate limiting
   - Email rate limiting
   - Custom SMTP settings

## Database Schema Overview

### Tables Created:

1. **users** - User profiles and authentication data
2. **listings** - Property listings (digs, apartments, flats)
3. **roommate_posts** - Posts looking for roommates or lease takeovers
4. **roommate_responses** - Responses to roommate posts
5. **chats** - Chat sessions between users
6. **messages** - Individual messages in chats
7. **saved_listings** - User's saved/favorited listings

### Key Features:

- **Row Level Security (RLS)** - Ensures users can only access their own data
- **Search Functions** - Optimized search for listings and roommate posts
- **Image Storage** - Secure file upload for property photos
- **Real-time Updates** - Built-in real-time capabilities for messages
- **Automatic Timestamps** - Created/updated timestamps managed automatically

## API Usage Examples

### Authentication
```typescript
import { useAuth } from './providers/AuthProvider'

const { user, signIn, signUp, signOut } = useAuth()

// Sign up
await signUp('user@example.com', 'password', 'John Doe', 'student')

// Sign in
await signIn('user@example.com', 'password')

// Sign out
await signOut()
```

### Listings
```typescript
import { useListings, useCreateListing } from './hooks/useQueries'

// Get listings with filters
const { data: listings } = useListings({
  search: 'digs near campus',
  type: 'digs',
  minPrice: 3000,
  maxPrice: 6000
})

// Create a new listing
const createListing = useCreateListing()
await createListing.mutateAsync({
  title: 'Cozy digs near campus',
  type: 'digs',
  rooms: 3,
  price: 4500,
  location: { latitude: -33.9321, longitude: 18.8602, address: '123 Main St' },
  listing_category: 'property'
})
```

### Roommate Posts
```typescript
import { useRoommatePosts, useCreateRoommatePost } from './hooks/useQueries'

// Get roommate posts
const { data: posts } = useRoommatePosts({
  postType: 'roommate_needed'
})

// Create a roommate post
const createPost = useCreateRoommatePost()
await createPost.mutateAsync({
  title: 'Looking for 2 roommates for 3-bedroom digs',
  roommates_needed: 2,
  post_type: 'roommate_needed',
  price_per_person: 1500
})
```

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check your environment variables are correct
2. **RLS Policy Errors**: Ensure you're authenticated before accessing protected data
3. **Storage Upload Errors**: Check bucket policies and file size limits
4. **Type Errors**: Make sure TypeScript types match your database schema

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the generated TypeScript types in `src/lib/supabase.ts`

## Next Steps

1. Implement authentication UI components
2. Create listing management interfaces
3. Build the roommate finder functionality
4. Add real-time messaging features
5. Implement image upload components

Your Supabase backend is now ready to power your FlatMate application! 🎉
