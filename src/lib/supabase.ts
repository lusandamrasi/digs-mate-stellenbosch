import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types will be generated here
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
          location: any
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
          current_roommates: number
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
          current_roommates?: number
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
          current_roommates?: number
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
          id: string
          chat_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
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
