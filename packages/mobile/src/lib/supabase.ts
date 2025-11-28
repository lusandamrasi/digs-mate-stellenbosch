import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use Expo environment variables with fallback to hardcoded values
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jktoowmuzjjvmpeitgxw.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjg2NjksImV4cCI6MjA3MzY0NDY2OX0.x-8O9Lh6TaKbnt6fZPo_41LfsLWxzS9Ai6rj50YSaxc';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          password_hash: string
          user_type: 'student' | 'landlord'
          profile_photo_url: string | null
          bio: string | null
          preferences: any | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          password_hash: string
          user_type: 'student' | 'landlord'
          profile_photo_url?: string | null
          bio?: string | null
          preferences?: any | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          password_hash?: string
          user_type?: 'student' | 'landlord'
          profile_photo_url?: string | null
          bio?: string | null
          preferences?: any | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: 'digs' | 'apartment' | 'flat'
          rooms: number
          price: number
          location: any
          availability_start: string | null
          availability_end: string | null
          images: string[] | null
          listing_category: 'property' | 'roommate_request' | 'lease_takeover'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: 'digs' | 'apartment' | 'flat'
          rooms: number
          price: number
          location?: any
          availability_start?: string | null
          availability_end?: string | null
          images?: string[] | null
          listing_category: 'property' | 'roommate_request' | 'lease_takeover'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: 'digs' | 'apartment' | 'flat'
          rooms?: number
          price?: number
          location?: any
          availability_start?: string | null
          availability_end?: string | null
          images?: string[] | null
          listing_category?: 'property' | 'roommate_request' | 'lease_takeover'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      roommate_posts: {
        Row: {
          id: string
          user_id: string
          listing_id: string | null
          title: string
          photos: string[] | null
          location: any | null
          price_per_person: number | null
          description: string | null
          roommates_needed: number
          listing_capacity: number
          accommodation_type: string | null
          preferences: string[] | null
          post_type: 'roommate_needed' | 'lease_takeover'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id?: string | null
          title: string
          photos?: string[] | null
          location?: any | null
          price_per_person?: number | null
          description?: string | null
          roommates_needed: number
          listing_capacity: number
          accommodation_type?: string | null
          preferences?: string[] | null
          post_type: 'roommate_needed' | 'lease_takeover'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string | null
          title?: string
          photos?: string[] | null
          location?: any | null
          price_per_person?: number | null
          description?: string | null
          roommates_needed?: number
          listing_capacity?: number
          accommodation_type?: string | null
          preferences?: string[] | null
          post_type?: 'roommate_needed' | 'lease_takeover'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      roommate_responses: {
        Row: {
          id: string
          post_id: string
          user_id: string
          message: string | null
          created_at: string
          accepted: boolean
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          message?: string | null
          created_at?: string
          accepted?: boolean
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          message?: string | null
          created_at?: string
          accepted?: boolean
        }
      }
      chats: {
        Row: {
          id: string
          listing_id: string | null
          post_id: string | null
          user1_id: string
          user2_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id?: string | null
          post_id?: string | null
          user1_id: string
          user2_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string | null
          post_id?: string | null
          user1_id?: string
          user2_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
          updated_at: string;
        }
        Insert: {
          id?: string;
          chat_id: string;
          sender_id: string;
          receiver_id: string; 
          content: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string; 
        }
        Update: {
          id?: string;
          chat_id?: string;
          sender_id?: string;
          receiver_id?: string; 
          content?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      }
      saved_listings: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          username: string
          full_name: string
          bio: string | null
          profile_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          username: string
          full_name: string
          bio?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          username?: string
          full_name?: string
          bio?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      lease_takeover_posts: {
        Row: {
          id: string
          user_id: string
          listing_id: string | null
          title: string
          photos: string[] | null
          location: any | null
          monthly_rent: number | null
          description: string | null
          listing_capacity: number | null
          accommodation_type: string | null
          available_from: string | null
          lease_ends: string | null
          takeover_reason: 'abroad' | 'graduation' | 'moving' | 'financial' | 'other' | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id?: string | null
          title: string
          photos?: string[] | null
          location?: any | null
          monthly_rent?: number | null
          description?: string | null
          listing_capacity?: number | null
          accommodation_type?: string | null
          available_from?: string | null
          lease_ends?: string | null
          takeover_reason?: 'abroad' | 'graduation' | 'moving' | 'financial' | 'other' | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string | null
          title?: string
          photos?: string[] | null
          location?: any | null
          monthly_rent?: number | null
          description?: string | null
          listing_capacity?: number | null
          accommodation_type?: string | null
          available_from?: string | null
          lease_ends?: string | null
          takeover_reason?: 'abroad' | 'graduation' | 'moving' | 'financial' | 'other' | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

