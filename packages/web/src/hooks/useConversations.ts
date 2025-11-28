// Re-export from shared with auth integration
import { useConversations as useConversationsShared } from 'shared/hooks/useConversations'
import { useAuth } from '@/providers/BetterAuthProvider'

export function useConversations() {
  const { user } = useAuth()
  return useConversationsShared({ user })
}

