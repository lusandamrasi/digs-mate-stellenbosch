// Re-export from shared with auth integration
import { useChat as useChatShared } from 'shared/hooks/useChat'
import { useAuth } from '@/providers/BetterAuthProvider'

export function useChat(chatId: string | null) {
  const { user } = useAuth()
  return useChatShared(chatId, { user })
}

