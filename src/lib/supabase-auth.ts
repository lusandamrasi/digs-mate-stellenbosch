import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jktoowmuzjjvmpeitgxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjg2NjksImV4cCI6MjA3MzY0NDY2OX0.x-8O9Lh6TaKbnt6fZPo_41LfsLWxzS9Ai6rj50YSaxc'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
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

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sync auth user to public user table
export const syncUserToPublicTable = async (authUser: any) => {
  if (!authUser) return null
  
  // Check if user already exists in public user table
  const { data: existingUser } = await supabase
    .from('user')
    .select('*')
    .eq('email', authUser.email)
    .single()
  
  if (existingUser) {
    return existingUser
  }
  
  // Create user in public user table
  const { data: newUser, error } = await supabase
    .from('user')
    .insert({
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email,
      full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
      user_type: authUser.user_metadata?.user_type,
      bio: authUser.user_metadata?.bio,
      profile_photo_url: authUser.user_metadata?.profile_photo_url,
      preferences: authUser.user_metadata?.preferences,
      verified: authUser.email_confirmed_at ? true : false,
      emailVerified: authUser.email_confirmed_at ? true : false,
      image: authUser.user_metadata?.image,
      createdAt: authUser.created_at,
      updatedAt: authUser.updated_at
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error syncing user to public table:', error)
    return null
  }
  
  return newUser
}
