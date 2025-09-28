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
          console.log('Setting initial user:', currentUser.email)
          setUser(currentUser)
          
          // Try to sync user to public table
          try {
            const syncedUser = await syncUserToPublicTable(currentUser)
            if (syncedUser) {
              console.log('User synced to public table:', syncedUser.email)
              setUser(syncedUser)
            }
          } catch (syncError) {
            console.error('Error syncing initial user:', syncError)
            // Keep the original user if sync fails
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setSession(session)
        
        if (session?.user) {
          console.log('Setting user:', session.user.email)
          setUser(session.user)
          
          // Sync user to public table in background with timeout
          const syncPromise = syncUserToPublicTable(session.user)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Sync timeout')), 10000)
          )
          
          try {
            const syncedUser = await Promise.race([syncPromise, timeoutPromise])
            if (syncedUser) {
              console.log('User synced to public table:', syncedUser.email)
              setUser(syncedUser)
            }
          } catch (syncError) {
            console.error('Error syncing user:', syncError)
            // Keep the original user if sync fails
          }
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
