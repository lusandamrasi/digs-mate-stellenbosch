import { supabase, Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type Listing = Database['public']['Tables']['listings']['Row']
type ListingInsert = Database['public']['Tables']['listings']['Insert']
type ListingUpdate = Database['public']['Tables']['listings']['Update']

type RoommatePost = Database['public']['Tables']['roommate_posts']['Row']
type RoommatePostInsert = Database['public']['Tables']['roommate_posts']['Insert']
type RoommatePostUpdate = Database['public']['Tables']['roommate_posts']['Update']

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
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/profile.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, { upsert: true })
    
    if (uploadError) throw uploadError
    
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)
    
    return data.publicUrl
  }
}

// Listings API
export const listingsApi = {
  async getListings(filters?: {
    search?: string
    type?: 'digs' | 'apartment' | 'flat'
    minPrice?: number
    maxPrice?: number
    minRooms?: number
    maxRooms?: number
    category?: 'property' | 'roommate_request' | 'lease_takeover'
    limit?: number
    offset?: number
  }): Promise<Listing[]> {
    const { data, error } = await supabase.rpc('search_listings', {
      search_query: filters?.search || '',
      listing_type_filter: filters?.type || null,
      min_price: filters?.minPrice || null,
      max_price: filters?.maxPrice || null,
      min_rooms: filters?.minRooms || null,
      max_rooms: filters?.maxRooms || null,
      listing_category_filter: filters?.category || null,
      limit_count: filters?.limit || 20,
      offset_count: filters?.offset || 0
    })
    
    if (error) throw error
    return data || []
  },

  async getListing(id: string): Promise<Listing | null> {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        users!inner(full_name, profile_photo_url)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createListing(listing: ListingInsert): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .insert(listing)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateListing(id: string, updates: ListingUpdate): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async uploadListingImages(listingId: string, files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${listingId}/image_${index}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)
      
      return data.publicUrl
    })
    
    return Promise.all(uploadPromises)
  }
}

// Roommate Posts API
export const roommatePostsApi = {
  async getPosts(filters?: {
    postType?: 'roommate_needed' | 'lease_takeover'
    limit?: number
    offset?: number
  }): Promise<RoommatePost[]> {
    const { data, error } = await supabase.rpc('get_roommate_posts', {
      post_type_filter: filters?.postType || null,
      limit_count: filters?.limit || 20,
      offset_count: filters?.offset || 0
    })
    
    if (error) throw error
    return data || []
  },

  async getPost(id: string): Promise<RoommatePost | null> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .select(`
        *,
        users!inner(full_name, profile_photo_url)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createPost(post: RoommatePostInsert): Promise<RoommatePost> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePost(id: string, updates: RoommatePostUpdate): Promise<RoommatePost> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('roommate_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async uploadPostPhotos(postId: string, files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${postId}/photo_${index}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)
      
      return data.publicUrl
    })
    
    return Promise.all(uploadPromises)
  }
}

// Roommate Responses API
export const roommateResponsesApi = {
  async getResponses(postId: string): Promise<RoommateResponse[]> {
    const { data, error } = await supabase
      .from('roommate_responses')
      .select(`
        *,
        users!inner(full_name, profile_photo_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createResponse(response: RoommateResponseInsert): Promise<RoommateResponse> {
    const { data, error } = await supabase
      .from('roommate_responses')
      .insert(response)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async acceptResponse(responseId: string): Promise<void> {
    const { error } = await supabase
      .from('roommate_responses')
      .update({ accepted: true })
      .eq('id', responseId)
    
    if (error) throw error
  }
}

// Chats API
export const chatsApi = {
  async getChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        user1:users!chats_user1_id_fkey(full_name, profile_photo_url),
        user2:users!chats_user2_id_fkey(full_name, profile_photo_url),
        messages:messages(created_at)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getChat(id: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        user1:users!chats_user1_id_fkey(full_name, profile_photo_url),
        user2:users!chats_user2_id_fkey(full_name, profile_photo_url)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
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

  async getOrCreateChat(user1Id: string, user2Id: string, listingId?: string, postId?: string): Promise<Chat> {
    // Check if chat already exists
    const { data: existingChat } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .eq('listing_id', listingId || null)
      .eq('post_id', postId || null)
      .single()
    
    if (existingChat) return existingChat
    
    // Create new chat
    return this.createChat({
      user1_id: user1Id,
      user2_id: user2Id,
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
      .select(`
        *,
        sender:users!messages_sender_id_fkey(full_name, profile_photo_url)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async sendMessage(message: MessageInsert): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select(`
        *,
        sender:users!messages_sender_id_fkey(full_name, profile_photo_url)
      `)
      .single()
    
    if (error) throw error
    
    // Update chat's updated_at timestamp
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', message.chat_id)
    
    return data
  },

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
    
    if (error) throw error
  }
}

// Saved Listings API
export const savedListingsApi = {
  async getSavedListings(userId: string): Promise<SavedListing[]> {
    const { data, error } = await supabase
      .from('saved_listings')
      .select(`
        *,
        listings!inner(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async saveListing(save: SavedListingInsert): Promise<SavedListing> {
    const { data, error } = await supabase
      .from('saved_listings')
      .insert(save)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async unsaveListing(userId: string, listingId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId)
    
    if (error) throw error
  },

  async isListingSaved(userId: string, listingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single()
    
    return !error && !!data
  }
}
