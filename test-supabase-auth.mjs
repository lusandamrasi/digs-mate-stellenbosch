import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jktoowmuzjjvmpeitgxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjg2NjksImV4cCI6MjA3MzY0NDY2OX0.x-8O9Lh6TaKbnt6fZPo_41LfsLWxzS9Ai6rj50YSaxc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseAuth() {
  console.log('Testing Supabase Auth...')
  
  try {
    // Test sign up
    console.log('Testing sign up...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'lusandamrasi1@gmail.com',
      password: 'password123',
      options: {
        data: {
          name: 'Test User',
          user_type: 'student',
          full_name: 'Test User'
        }
      }
    })
    
    if (signUpError) {
      console.error('Sign up error:', signUpError.message)
    } else {
      console.log('✅ Sign up successful!')
      console.log('User:', signUpData.user?.email)
    }
    
    // Test sign in
    console.log('Testing sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'lusandamrasi1@gmail.com',
      password: 'password123'
    })
    
    if (signInError) {
      console.error('Sign in error:', signInError.message)
    } else {
      console.log('✅ Sign in successful!')
      console.log('User:', signInData.user?.email)
      console.log('Session:', signInData.session?.access_token ? 'Active' : 'None')
    }
    
    // Test get session
    console.log('Testing get session...')
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', session ? 'Active' : 'None')
    
    // Test get user
    console.log('Testing get user...')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current user:', user?.email || 'None')
    
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testSupabaseAuth()
