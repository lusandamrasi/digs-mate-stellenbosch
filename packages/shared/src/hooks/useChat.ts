import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { messagesApi } from '../lib/api'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase'

// Auth hook interface - platforms will provide their own implementation
interface AuthUser {
  id: string
  email?: string
}

type Message = Database['public']['Tables']['messages']['Row']

interface UseChatReturn {
  messages: Message[]
  loading: boolean
  sending: boolean
  sendMessage: (content: string) => Promise<void>
  markAsRead: () => Promise<void>
  isConnected: boolean
  error: string | null
}

interface UseChatOptions {
  user: AuthUser | null
}

export function useChat(chatId: string | null, options: UseChatOptions): UseChatReturn {
  const { user } = options
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Load initial messages
  useEffect(() => {
    if (!chatId || !user?.id) {
      setLoading(false)
      setMessages([])
      return
    }

    let cancelled = false

    const loadMessages = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await messagesApi.getMessages(chatId)
        if (!cancelled) {
          setMessages(data)
        }
      } catch (err: any) {
        console.error('Error loading messages:', err)
        if (!cancelled) {
          setError(err.message || 'Failed to load messages')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMessages()

    return () => {
      cancelled = true
    }
  }, [chatId, user?.id])

  // Subscribe to realtime updates
  useEffect(() => {
    if (!chatId || !user?.id) {
      setIsConnected(false)
      return
    }

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    console.log(`[useChat] Subscribing to chat:${chatId}`)

    // Create new channel
    const channel = supabase
      .channel(`chat:${chatId}`, {
        config: {
          broadcast: { self: false },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('[useChat] New message received:', payload.new)
          const newMessage = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates - check both by ID and by tracking set
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev
            }
            // Skip if we just sent this message (to prevent duplicate from our own send)
            if (sentMessageIdsRef.current.has(newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('[useChat] Message updated:', payload.new)
          const updatedMessage = payload.new as Message
          setMessages((prev) =>
            prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
          )
        }
      )
      .subscribe((status) => {
        console.log(`[useChat] Channel status for chat:${chatId}:`, status)
        setIsConnected(status === 'SUBSCRIBED')
        
        if (status === 'CHANNEL_ERROR') {
          console.error('[useChat] Channel error')
          setError('Connection error. Please refresh.')
        }
      })

    channelRef.current = channel

    // Cleanup on unmount or chatId change
    return () => {
      console.log(`[useChat] Unsubscribing from chat:${chatId}`)
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      setIsConnected(false)
    }
  }, [chatId, user?.id])

  // Track sent message IDs to prevent duplicates from realtime
  const sentMessageIdsRef = useRef<Set<string>>(new Set())

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!chatId || !user?.id || !content.trim() || sending) {
        return
      }

      // Get receiver_id from chat
      const { data: chat } = await supabase
        .from('chats')
        .select('user1_id, user2_id')
        .eq('id', chatId)
        .single()

      if (!chat) {
        throw new Error('Chat not found')
      }

      const receiverId = chat.user1_id === user.id ? chat.user2_id : chat.user1_id

      try {
        setSending(true)
        setError(null)

        // Send to server first (don't do optimistic update to avoid duplicates)
        const sentMessage = await messagesApi.sendMessage({
          chat_id: chatId,
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim(),
        })

        // Track this message ID so realtime subscription doesn't duplicate it
        sentMessageIdsRef.current.add(sentMessage.id)

        // Add to messages (realtime subscription will also handle this, but we add it here too)
        // The realtime handler will check for duplicates
        setMessages((prev) => {
          if (prev.some((m) => m.id === sentMessage.id)) {
            return prev
          }
          return [...prev, sentMessage]
        })

        // Clear the tracking after a delay (message should be in state by then)
        setTimeout(() => {
          sentMessageIdsRef.current.delete(sentMessage.id)
        }, 5000)
      } catch (err: any) {
        console.error('Error sending message:', err)
        setError(err.message || 'Failed to send message')
        throw err
      } finally {
        setSending(false)
      }
    },
    [chatId, user?.id, sending]
  )

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!chatId || !user?.id) return

    try {
      await messagesApi.markMessagesAsRead(chatId, user.id)
      // Update local state
      setMessages((prev) =>
        prev.map((m) =>
          m.receiver_id === user.id && !m.read ? { ...m, read: true } : m
        )
      )
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }, [chatId, user?.id])

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    isConnected,
    error,
  }
}

