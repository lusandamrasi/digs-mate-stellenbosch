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
      // If no profile found, return null instead of throwing
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

  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `profile-photos/${userId}/profile.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, { upsert: true })
    
    if (uploadError) throw uploadError
    
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)
    
    return data.publicUrl
  },

  async uploadRoommatePostPhotos(userId: string, postId: string, files: File[]): Promise<string[]> {
    // Compress images before upload
    const compressedFiles = await Promise.all(
      files.map(file => this.compressImage(file))
    )

    const uploadPromises = compressedFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `roommate-posts/${userId}/${postId}/photo-${index + 1}.${fileExt}`
      
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
  },

  async uploadRoommatePostPhotosTemporary(userId: string, files: File[]): Promise<string[]> {
    // Generate a temporary ID for upload
    const tempId = Date.now().toString()
    
    // Compress images before upload
    const compressedFiles = await Promise.all(
      files.map(file => this.compressImage(file))
    )

    const uploadPromises = compressedFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `roommate-posts/${userId}/${tempId}/photo-${index + 1}.${fileExt}`
      
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
  },

  async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              resolve(file) // Fallback to original
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => resolve(file) // Fallback to original
      img.src = URL.createObjectURL(file)
    })
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
    
    // Get user information separately to avoid join issues
    if (data && data.length > 0) {
      const userIds = Array.from(new Set(data.map(post => post.user_id)))
      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds)
      
      // Add user info to posts
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
      // Get user information
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
  },

  async getUserRoommatePosts(userId: string): Promise<RoommatePost[]> {
    const { data, error } = await supabase
      .from('roommate_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
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
    
    // Get user information separately to avoid join issues
    if (data && data.length > 0) {
      const userIds = Array.from(new Set(data.map(post => post.user_id)))
      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, username, full_name')
        .in('user_id', userIds)
      
      // Add user info to posts
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
    
    // Get user information separately
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
  },

  async getUserLeaseTakeoverPosts(userId: string): Promise<LeaseTakeoverPost[]> {
    const { data, error } = await supabase
      .from('lease_takeover_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
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
    // Check if chat already exists between these two users (regardless of post/listing)
    const { data: existingChats, error: queryError } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    
    if (queryError) throw queryError
    
    // Return first existing chat if found
    if (existingChats && existingChats.length > 0) {
      // If post/listing provided, update it if chat doesn't have one
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
    
    // Create new chat (normalize user IDs - always put smaller ID first)
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
