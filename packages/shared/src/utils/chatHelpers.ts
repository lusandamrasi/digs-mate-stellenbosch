import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Chat = Database['public']['Tables']['chats']['Row']
type ChatInsert = Database['public']['Tables']['chats']['Insert']

/**
 * Get existing chat between two users or create a new one
 */
export async function getOrCreateChat(
  userId1: string,
  userId2: string,
  postId?: string | null,
  listingId?: string | null
): Promise<Chat> {
  // Normalize user IDs (always use smaller ID first for consistency)
  const sortedIds = [userId1, userId2].sort()
  const user1Id = sortedIds[0]
  const user2Id = sortedIds[1]

  // Check if chat already exists
  const { data: existingChat, error: queryError } = await supabase
    .from('chats')
    .select('*')
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .maybeSingle()

  if (queryError && queryError.code !== 'PGRST116') {
    throw queryError
  }

  if (existingChat) {
    return existingChat
  }

  // Create new chat
  const newChat: ChatInsert = {
    user1_id: user1Id,
    user2_id: user2Id,
    post_id: postId || null,
    listing_id: listingId || null,
  }

  const { data: createdChat, error: insertError } = await supabase
    .from('chats')
    .insert(newChat)
    .select()
    .single()

  if (insertError) throw insertError
  return createdChat
}

/**
 * Format message timestamp to human-readable format
 */
export function formatMessageTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  // Set timezone to South Africa (UTC+2)
  const saDate = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }))
  const saNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }))

  // Just now (less than 1 minute)
  if (diffMins < 1) {
    return 'Just now'
  }

  // Minutes ago (less than 1 hour)
  if (diffMins < 60) {
    return `${diffMins}m ago`
  }

  // Hours ago (less than 24 hours)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  // Yesterday
  if (diffDays === 1 || (saNow.getDate() - saDate.getDate() === 1 && saNow.getMonth() === saDate.getMonth())) {
    return 'Yesterday'
  }

  // Days ago (less than 7 days)
  if (diffDays < 7) {
    return `${diffDays}d ago`
  }

  // Full date format
  return saDate.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: saDate.getFullYear() !== saNow.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Format full timestamp for message display (with time)
 */
export function formatFullMessageTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const saDate = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }))
  const now = new Date()
  const saNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }))
  
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  // Today - show time only
  if (saDate.getDate() === saNow.getDate() && 
      saDate.getMonth() === saNow.getMonth() && 
      saDate.getFullYear() === saNow.getFullYear()) {
    return saDate.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Yesterday
  if (diffDays === 1) {
    return `Yesterday ${saDate.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  // Older - show date and time
  return saDate.toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    year: saDate.getFullYear() !== saNow.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Truncate message content for preview
 */
export function truncateMessage(content: string, maxLength: number = 50): string {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

/**
 * Get the other user's ID from a chat
 */
export function getOtherUserId(chat: Chat, currentUserId: string): string {
  if (chat.user1_id === currentUserId) {
    return chat.user2_id
  }
  return chat.user1_id
}

/**
 * Validate message content before sending
 */
export function validateMessage(content: string): { valid: boolean; error?: string } {
  const trimmed = content.trim()
  
  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty' }
  }
  
  if (trimmed.length > 5000) {
    return { valid: false, error: 'Message is too long (max 5000 characters)' }
  }
  
  return { valid: true }
}

/**
 * Shorten a full address to just the street address
 * Example: "29 Dennesig St, Stellenbosch Central, Stellenbosch, 7600, South Africa" -> "29 Dennesig St"
 */
export function shortenAddress(address: string): string {
  if (!address) return ''
  
  // Check if it looks like a full address (contains commas)
  if (address.includes(',')) {
    // Split by comma and take the first part (street address)
    const parts = address.split(',')
    return parts[0].trim()
  }
  
  // If no commas, return as is
  return address
}

