import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, getUser, getSession, signOut as supabaseSignOut, syncUserToPublicTable } from '@/lib/supabase-auth'

interface AuthContextType {
  user: any
  session: any
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function BetterAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentSession = await getSession()
        const currentUser = await getUser()
        setSession(currentSession)
        if (currentUser) {
          // Sync user to public table
          const syncedUser = await syncUserToPublicTable(currentUser)
          setUser(syncedUser || currentUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          // Sync user to public table
          const syncedUser = await syncUserToPublicTable(session.user)
          setUser(syncedUser || session.user)
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabaseSignOut()
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a BetterAuthProvider')
  }
  return context
}
