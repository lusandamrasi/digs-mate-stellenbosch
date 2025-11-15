import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { chatsApi, messagesApi, userApi, roommatePostsApi, leaseTakeoverPostsApi } from '@/lib/api'
import { useAuth } from '@/providers/BetterAuthProvider'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'
import { getOtherUserId, truncateMessage } from '@/utils/chatHelpers'

type Chat = Database['public']['Tables']['chats']['Row']
type Message = Database['public']['Tables']['messages']['Row']

export interface Conversation {
  chat_id: string
  other_user: {
    id: string
    user_id: string
    full_name: string
    username: string
    profile_photo_url: string | null
  }
  last_message: {
    content: string
    created_at: string
    sender_id: string
  } | null
  unread_count: number
  post_id: string | null
  listing_id: string | null
  post_location: string | null
  updated_at: string
}

interface UseConversationsReturn {
  conversations: Conversation[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useConversations(): UseConversationsReturn {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useState<RealtimeChannel | null>(null)[0]

  const loadConversations = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      setConversations([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get all chats for current user
      const chats = await chatsApi.getChats(user.id)

      // Fetch details for each chat
      const conversationPromises = chats.map(async (chat) => {
        const otherUserId = getOtherUserId(chat, user.id)

        // Get other user's profile
        const otherUserProfile = await userApi.getProfile(otherUserId)

        if (!otherUserProfile) {
          // User profile not found - skip this conversation
          return null
        }

        // Get last message
        const messages = await messagesApi.getMessages(chat.id)
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null

        // Get unread count
        const unreadMessages = messages.filter(
          (m) => m.receiver_id === user.id && !m.read
        )
        const unreadCount = unreadMessages.length

        // Get post location if post_id exists
        let postLocation: string | null = null
        if (chat.post_id) {
          try {
            // Try to get roommate post first
            const roommatePost = await roommatePostsApi.getRoommatePostById(chat.post_id)
            if (roommatePost && roommatePost.location) {
              postLocation = typeof roommatePost.location === 'string' 
                ? roommatePost.location 
                : roommatePost.location?.name || null
            } else {
              // Try lease takeover post
              const takeoverPost = await leaseTakeoverPostsApi.getLeaseTakeoverPostById(chat.post_id)
              if (takeoverPost && takeoverPost.location) {
                postLocation = typeof takeoverPost.location === 'string'
                  ? takeoverPost.location
                  : takeoverPost.location?.name || null
              }
            }
          } catch (err) {
            console.error('Error fetching post location:', err)
            // Continue without location
          }
        }

        return {
          chat_id: chat.id,
          other_user: {
            id: otherUserProfile.id,
            user_id: otherUserProfile.user_id,
            full_name: otherUserProfile.full_name,
            username: otherUserProfile.username,
            profile_photo_url: otherUserProfile.profile_photo_url,
          },
          last_message: lastMessage
            ? {
                content: lastMessage.content,
                created_at: lastMessage.created_at,
                sender_id: lastMessage.sender_id,
              }
            : null,
          unread_count: unreadCount,
          post_id: chat.post_id,
          listing_id: chat.listing_id,
          post_location: postLocation,
          updated_at: chat.updated_at,
        } as Conversation
      })

      const conversationResults = await Promise.all(conversationPromises)
      const validConversations = conversationResults.filter(
        (c) => c !== null
      ) as Conversation[]

      // Sort by updated_at (most recent first)
      validConversations.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )

      setConversations(validConversations)
    } catch (err: any) {
      console.error('Error loading conversations:', err)
      setError(err.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Initial load
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Subscribe to realtime updates for chats
  useEffect(() => {
    if (!user?.id) {
      return
    }

    console.log('[useConversations] Subscribing to chats for user:', user.id)

    const channel = supabase
      .channel(`user-chats:${user.id}`, {
        config: {
          broadcast: { self: false },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `user1_id=eq.${user.id}`,
        },
        () => {
          console.log('[useConversations] Chat changed (user1)')
          loadConversations()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `user2_id=eq.${user.id}`,
        },
        () => {
          console.log('[useConversations] Chat changed (user2)')
          loadConversations()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          console.log('[useConversations] New message inserted')
          // Always refresh conversations when a new message is inserted
          // The hook will check if it's relevant when loading
          loadConversations()
        }
      )
      .subscribe((status) => {
        console.log('[useConversations] Channel status:', status)
      })

    // Cleanup
    return () => {
      console.log('[useConversations] Unsubscribing')
      supabase.removeChannel(channel)
    }
  }, [user?.id, loadConversations])

  return {
    conversations,
    loading,
    error,
    refresh: loadConversations,
  }
}

