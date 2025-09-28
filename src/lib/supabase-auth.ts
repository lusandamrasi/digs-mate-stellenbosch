import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jktoowmuzjjvmpeitgxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjg2NjksImV4cCI6MjA3MzY0NDY2OX0.x-8O9Lh6TaKbnt6fZPo_41LfsLWxzS9Ai6rj50YSaxc'

// Create client for auth operations
export const supabase = createClient(supabaseUrl, supabaseKey)

// Create admin client for database operations (bypasses RLS)
// Note: You'll need to replace this with your actual service role key
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODA2ODY2OSwiZXhwIjoyMDczNjQ0NjY5fQ.YOUR_SERVICE_ROLE_KEY_HERE'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
  if (!authUser) {
    console.log('No auth user provided to sync')
    return null
  }
  
  console.log('Syncing user to public table:', authUser.email)
  
  try {
    // Check if user already exists in public user table
    console.log('Checking if user exists in public table...')
    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from('user')
      .select('*')
      .eq('email', authUser.email)
      .single()
    
    console.log('Select result:', { existingUser, selectError })
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing user:', selectError)
      throw selectError
    }
    
    if (existingUser) {
      console.log('User already exists in public table:', existingUser.email)
      return existingUser
    }
    
    // Create user in public user table
    console.log('Creating new user in public table...')
    const userData = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email,
      full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email,
      user_type: authUser.user_metadata?.user_type || 'student',
      bio: authUser.user_metadata?.bio,
      profile_photo_url: authUser.user_metadata?.profile_photo_url,
      preferences: authUser.user_metadata?.preferences,
      verified: true, // Always true since we disabled email confirmation
      image: authUser.user_metadata?.image,
      createdAt: authUser.created_at,
      updatedAt: authUser.updated_at
    }
    
    console.log('User data to insert:', userData)
    
    const { data: newUser, error } = await supabaseAdmin
      .from('user')
      .insert(userData)
      .select()
      .single()
    
    console.log('Insert result:', { newUser, error })
    
    if (error) {
      console.error('Error creating user in public table:', error)
      throw error
    }
    
    console.log('Successfully synced user to public table:', newUser.email)
    return newUser
  } catch (error) {
    console.error('Failed to sync user to public table:', error)
    throw error
  }
}
