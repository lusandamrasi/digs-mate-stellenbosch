import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff } from 'lucide-react'
import { signUp, signIn } from 'shared/lib/supabase-simple'
import { supabase } from 'shared/lib/supabase'
import { useAuth } from '@/providers/BetterAuthProvider'

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    try {
      const { data, error } = await signUp(email, password, fullName)
      
      if (error) {
        setError(error.message)
        setIsLoading(false)
      } else {
        console.log('Sign up successful:', data)
        // Navigate to dashboard after successful signup
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const identifier = formData.get('identifier') as string // Can be email or username
    const password = formData.get('password') as string

    try {
      console.log('Looking up user with identifier:', identifier)
      
      let actualEmail = identifier // Default to identifier (could be email)
      
      // Try to find user by username in user_profiles table
      if (!identifier.includes('@')) {
        // This looks like a username, not an email
        console.log('Identifier looks like username, searching profiles...')
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('email, username')
          .eq('username', identifier)
          .single()
        
        console.log('Username lookup result:', { profileData, profileError })
        
        if (profileData && !profileError) {
          actualEmail = profileData.email
          console.log('Found profile by username, using email:', actualEmail)
        } else {
          setError('Username not found')
          setIsLoading(false)
          return
        }
      } else {
        // This looks like an email, check if there's a profile
        console.log('Identifier looks like email, checking for profile...')
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('email, username')
          .eq('email', identifier)
          .single()
        
        console.log('Email profile lookup result:', { profileData, profileError })
        
        // Use the email directly (whether profile exists or not)
        actualEmail = identifier
      }
      
      console.log('Attempting sign-in with email:', actualEmail)
      const { data, error } = await signIn(actualEmail, password)
      
      if (error) {
        console.log('Sign-in error:', error)
        setError(error.message)
        setIsLoading(false)
      } else {
        console.log('Sign in successful:', data)
        navigate('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to FlatMate</CardTitle>
          <CardDescription>
            Find your perfect student accommodation in Stellenbosch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input
                    name="identifier"
                    type="text"
                    placeholder="Email or Username"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="text-sm text-red-500 text-center">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="text-sm text-red-500 text-center">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Auth
