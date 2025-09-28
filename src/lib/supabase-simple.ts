import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jktoowmuzjjvmpeitgxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjg2NjksImV4cCI6MjA3MzY0NDY2OX0.x-8O9Lh6TaKbnt6fZPo_41LfsLWxzS9Ai6rj50YSaxc'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Simple auth functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: undefined // Disable email confirmation
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}
