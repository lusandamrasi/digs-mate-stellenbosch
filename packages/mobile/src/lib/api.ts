import { supabase, Database } from './supabase'

type User = Database['public']['Tables']['user_profiles']['Row']
type UserInsert = Database['public']['Tables']['user_profiles']['Insert']
type UserUpdate = Database['public']['Tables']['user_profiles']['Update']

type Listing = Database['public']['Tables']['listings']['Row']
type ListingInsert = Database['public']['Tables']['listings']['Insert']
type ListingUpdate = Database['public']['Tables']['listings']['Update']

type RoommatePost = Database['public']['Tables']['roommate_posts']['Row']
type RoommatePostInsert = Database['public']['Tables']['roommate_posts']['Insert']
type RoommatePostUpdate = Database['public']['Tables']['roommate_posts']['Update']

type LeaseTakeoverPost = Database['public']['Tables']['lease_takeover_posts']['Row']
type LeaseTakeoverPostInsert = Database['public']['Tables']['lease_takeover_posts']['Insert']
type LeaseTakeoverPostUpdate = Database['public']['Tables']['lease_takeover_posts']['Update']

type RoommateResponse = Database['public']['Tables']['roommate_responses']['Row']
type RoommateResponseInsert = Database['public']['Tables']['roommate_responses']['Insert']

type Chat = Database['public']['Tables']['chats']['Row']
type ChatInsert = Database['public']['Tables']['chats']['Insert']

type Message = Database['public']['Tables']['messages']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']

type SavedListing = Database['public']['Tables']['saved_listings']['Row']
type SavedListingInsert = Database['public']['Tables']['saved_listings']['Insert']

// User API
export const userApi = {
  async getProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data
  },

  async createProfile(userId: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        email: userData.email || '',
        username: userData.username || userData.email?.split('@')[0] || '',
        full_name: userData.full_name || '',
        bio: userData.bio || null,
        profile_photo_url: userData.profile_photo_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // NOTE: File uploads need React Native ImagePicker - will implement later
  async uploadProfilePhoto(userId: string, imageUri: string): Promise<string> {
    // TODO: Implement React Native image upload
    throw new Error('Image upload not yet implemented for mobile')
  },

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('check_username_available', {
      check_username: username
    })
    
    if (error) throw error
    return data
  },

  async getUserByUsernameOrEmail(identifier: string): Promise<User | null> {
    const { data, error } = await supabase.rpc('get_user_by_identifier', {
      identifier: identifier
    })
    
    if (error) throw error
    return data?.[0] || null
  }
}

// Roommate Posts API
export const roommatePostsApi = {
  async getRoommatePosts(): Promise<(RoommatePost & { user: { username: string; full_name: string } | null })[]> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    if (data && data.length > 0) {
      const userIds = Array.from(new Set(data.map(post => post.user_id)))
      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds)
      
      return data.map(post => ({
        ...post,
        user: users?.find(user => user.user_id === post.user_id) || null
      }))
    }
    
    return data || []
  },

  async getRoommatePostById(id: string): Promise<(RoommatePost & { user: { username: string; full_name: string } | null }) | null> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    
    if (data) {
      const { data: user } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .eq('user_id', data.user_id)
        .single()
      
      return {
        ...data,
        user: user || null
      }
    }
    
    return null
  },

  async createRoommatePost(post: RoommatePostInsert): Promise<RoommatePost> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateRoommatePost(id: string, updates: RoommatePostUpdate): Promise<RoommatePost> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteRoommatePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('roommate_posts')
      .update({ active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Lease Takeover Posts API
export const leaseTakeoverPostsApi = {
  async getLeaseTakeoverPosts(): Promise<(LeaseTakeoverPost & { user: { username: string; full_name: string } | null })[]> {
    const { data, error } = await supabase
      .from('lease_takeover_posts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    if (data && data.length > 0) {
      const userIds = Array.from(new Set(data.map(post => post.user_id)))
      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds)
      
      return data.map(post => ({
        ...post,
        user: users?.find(user => user.user_id === post.user_id) || null
      }))
    }
    
    return data || []
  },

  async getLeaseTakeoverPostById(id: string): Promise<(LeaseTakeoverPost & { user: { username: string; full_name: string } | null }) | null> {
    const { data, error } = await supabase
      .from('lease_takeover_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    if (data) {
      const { data: user } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .eq('user_id', data.user_id)
        .single()
      
      return {
        ...data,
        user: user || null
      }
    }
    
    return null
  },

  async createLeaseTakeoverPost(post: LeaseTakeoverPostInsert): Promise<LeaseTakeoverPost> {
    const { data, error } = await supabase
      .from('lease_takeover_posts')
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLeaseTakeoverPost(id: string, updates: LeaseTakeoverPostUpdate): Promise<LeaseTakeoverPost> {
    const { data, error } = await supabase
      .from('lease_takeover_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteLeaseTakeoverPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('lease_takeover_posts')
      .update({ active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Chats API
export const chatsApi = {
  async getChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getChat(id: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  async createChat(chat: ChatInsert): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .insert(chat)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getOrCreateChat(user1Id: string, user2Id: string, listingId?: string | null, postId?: string | null): Promise<Chat> {
    const { data: existingChats, error: queryError } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    
    if (queryError) throw queryError
    
    if (existingChats && existingChats.length > 0) {
      const chat = existingChats[0]
      if ((postId && !chat.post_id) || (listingId && !chat.listing_id)) {
        await supabase
          .from('chats')
          .update({
            post_id: postId || chat.post_id,
            listing_id: listingId || chat.listing_id,
          })
          .eq('id', chat.id)
        chat.post_id = postId || chat.post_id
        chat.listing_id = listingId || chat.listing_id
      }
      return chat
    }
    
    const sortedIds = [user1Id, user2Id].sort()
    return this.createChat({
      user1_id: sortedIds[0],
      user2_id: sortedIds[1],
      listing_id: listingId || null,
      post_id: postId || null
    })
  }
}

// Messages API
export const messagesApi = {
  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async sendMessage(message: MessageInsert): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', message.chat_id)
    
    return data
  },

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .eq('receiver_id', userId)
      .eq('read', false)
    
    if (error) throw error
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false)
    
    if (error) throw error
    return count || 0
  }
}

