import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/providers/BetterAuthProvider'
import { userApi } from 'shared/lib/api'
import { getOtherUserId, formatFullMessageTime } from 'shared/utils/chatHelpers'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Database } from 'shared/lib/supabase'

type Chat = Database['public']['Tables']['chats']['Row']

interface ChatWindowProps {
  chat: Chat | null
  onBack?: () => void
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const { user } = useAuth()
  const { messages, loading, sending, sendMessage, markAsRead, isConnected, error } = useChat(
    chat?.id || null
  )
  const [messageInput, setMessageInput] = useState('')
  const [otherUser, setOtherUser] = useState<{
    full_name: string
    username: string
    profile_photo_url: string | null
  } | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch other user's profile
  useEffect(() => {
    if (!chat || !user?.id) {
      setOtherUser(null)
      return
    }

    const loadOtherUser = async () => {
      const otherUserId = getOtherUserId(chat, user.id)
      const profile = await userApi.getProfile(otherUserId)
      if (profile) {
        setOtherUser({
          full_name: profile.full_name,
          username: profile.username,
          profile_photo_url: profile.profile_photo_url,
        })
      }
    }

    loadOtherUser()
  }, [chat, user?.id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && scrollAreaRef.current) {
      // Find the ScrollArea viewport (Radix UI creates it)
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
      if (viewport) {
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight
        }, 100)
      } else if (messagesEndRef.current) {
        // Fallback to scrollIntoView
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [messages.length]) // Only trigger when message count changes

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (chat && user?.id) {
      markAsRead()
    }
  }, [chat, user?.id, markAsRead])

  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    const trimmed = messageInput.trim()
    if (!trimmed || sending || isSending || !chat) return

    setIsSending(true)
    try {
      await sendMessage(trimmed)
      setMessageInput('')
    } catch (err) {
      console.error('Error sending message:', err)
      // Error is handled in the hook
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      handleSend()
    }
  }

  if (!chat) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Select a conversation to start messaging
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading && messages.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading messages...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden" style={{ height: '100%', maxHeight: '100%' }}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onBack}
            >
              ←
            </Button>
          )}
          <Avatar>
            <AvatarImage src={otherUser?.profile_photo_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {otherUser?.full_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {otherUser?.full_name || 'Loading...'}
            </h3>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0" style={{ minHeight: 0 }}>
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4 pb-2">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isSender = message.sender_id === user?.id
                const showTime =
                  messages.indexOf(message) === 0 ||
                  messages[messages.indexOf(message) - 1]?.sender_id !==
                    message.sender_id ||
                  new Date(message.created_at).getTime() -
                    new Date(
                      messages[messages.indexOf(message) - 1]?.created_at || 0
                    ).getTime() >
                    300000 // 5 minutes

                return (
                  <div key={message.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col max-w-[75%] ${isSender ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isSender
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      {showTime && (
                        <span className="text-xs text-muted-foreground mt-1 px-1">
                          {formatFullMessageTime(message.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm border-t border-border">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending || isSending || !isConnected}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSend()
            }}
            disabled={!messageInput.trim() || sending || isSending || !isConnected}
            className="bg-primary hover:bg-primary/90"
          >
            {(sending || isSending) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

