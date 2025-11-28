import { useConversations } from '@/hooks/useConversations'
import { useAuth } from '@/providers/BetterAuthProvider'
import { formatMessageTime, truncateMessage, getOtherUserId, shortenAddress } from 'shared/utils/chatHelpers'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, MessageCircle, Search, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import type { Database } from 'shared/lib/supabase'

type Chat = Database['public']['Tables']['chats']['Row']

interface ConversationsListProps {
  selectedChatId: string | null
  onSelectChat: (chat: Chat) => void
}

export function ConversationsList({ selectedChatId, onSelectChat }: ConversationsListProps) {
  const { user } = useAuth()
  const { conversations, loading, error } = useConversations()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Convert conversations to chats format for selection
  const handleSelectConversation = (conversation: typeof conversations[0]) => {
    // Create a chat-like object from conversation
    const chat: Chat = {
      id: conversation.chat_id,
      user1_id: user?.id === conversation.other_user.user_id ? user.id : conversation.other_user.user_id,
      user2_id: user?.id === conversation.other_user.user_id ? conversation.other_user.user_id : user?.id || '',
      post_id: conversation.post_id,
      listing_id: conversation.listing_id,
      created_at: '',
      updated_at: conversation.updated_at,
    }
    onSelectChat(chat)
  }

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      conv.other_user.full_name.toLowerCase().includes(query) ||
      conv.other_user.username.toLowerCase().includes(query) ||
      (conv.last_message?.content.toLowerCase().includes(query) || false)
    )
  })

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : 'Start a conversation by messaging someone from their post'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => {
              const isSelected = selectedChatId === conversation.chat_id
              const isUnread = conversation.unread_count > 0
              const lastMessagePreview = conversation.last_message
                ? truncateMessage(conversation.last_message.content, 60)
                : 'No messages yet'

              return (
                <div
                  key={conversation.chat_id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage
                        src={conversation.other_user.profile_photo_url || undefined}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conversation.other_user.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`font-semibold truncate ${
                            isUnread ? 'text-foreground' : 'text-foreground'
                          }`}
                        >
                          {conversation.other_user.full_name}
                        </h3>
                        {conversation.last_message && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatMessageTime(conversation.last_message.created_at)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm truncate flex-1 ${
                            isUnread
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {conversation.last_message?.sender_id === user?.id
                            ? `You: ${lastMessagePreview}`
                            : lastMessagePreview}
                        </p>
                        {isUnread && (
                          <Badge
                            variant="destructive"
                            className="min-w-[20px] h-5 text-xs flex-shrink-0"
                          >
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>

                      {/* Post context if available */}
                      {(conversation.post_id || conversation.listing_id) && (
                        <div className="flex items-center gap-1 mt-1">
                          {conversation.post_location && (
                            <Home size={10} className="text-muted-foreground flex-shrink-0" />
                          )}
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.post_location
                              ? shortenAddress(conversation.post_location)
                              : conversation.post_id
                              ? 'Related to post'
                              : 'Related to listing'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}

