import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listingsApi,
  roommatePostsApi,
  roommateResponsesApi,
  leaseTakeoverPostsApi,
  chatsApi,
  messagesApi,
  savedListingsApi,
  userApi 
} from '../lib/api'

// Query Keys
export const queryKeys = {
  listings: ['listings'] as const,
  listing: (id: string) => ['listings', id] as const,
  roommatePosts: ['roommate-posts'] as const,
  roommatePost: (id: string) => ['roommate-posts', id] as const,
  roommateResponses: (postId: string) => ['roommate-responses', postId] as const,
  leaseTakeoverPosts: ['lease-takeover-posts'] as const,
  leaseTakeoverPost: (id: string) => ['lease-takeover-posts', id] as const,
  chats: (userId: string) => ['chats', userId] as const,
  chat: (id: string) => ['chat', id] as const,
  messages: (chatId: string) => ['messages', chatId] as const,
  savedListings: (userId: string) => ['saved-listings', userId] as const,
  userProfile: (userId: string) => ['user-profile', userId] as const,
}

// Listings Hooks
export function useListings(filters?: Parameters<typeof listingsApi.getListings>[0]) {
  return useQuery({
    queryKey: [...queryKeys.listings, filters],
    queryFn: () => listingsApi.getListings(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: queryKeys.listing(id),
    queryFn: () => listingsApi.getListing(id),
    enabled: !!id,
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: listingsApi.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings })
    },
  })
}

export function useUpdateListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof listingsApi.updateListing>[1] }) =>
      listingsApi.updateListing(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings })
      queryClient.setQueryData(queryKeys.listing(data.id), data)
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: listingsApi.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings })
    },
  })
}

// Roommate Posts Hooks
export function useRoommatePosts() {
  return useQuery({
    queryKey: queryKeys.roommatePosts,
    queryFn: () => roommatePostsApi.getRoommatePosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRoommatePost(id: string) {
  return useQuery({
    queryKey: queryKeys.roommatePost(id),
    queryFn: () => roommatePostsApi.getRoommatePostById(id),
    enabled: !!id,
  })
}

export function useCreateRoommatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: roommatePostsApi.createRoommatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roommatePosts })
    },
  })
}

export function useUpdateRoommatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof roommatePostsApi.updateRoommatePost>[1] }) =>
      roommatePostsApi.updateRoommatePost(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roommatePosts })
      queryClient.setQueryData(queryKeys.roommatePost(data.id), data)
    },
  })
}

export function useDeleteRoommatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: roommatePostsApi.deleteRoommatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roommatePosts })
    },
  })
}

// Lease Takeover Posts Hooks
export function useLeaseTakeoverPosts() {
  return useQuery({
    queryKey: queryKeys.leaseTakeoverPosts,
    queryFn: () => leaseTakeoverPostsApi.getLeaseTakeoverPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLeaseTakeoverPost(id: string) {
  return useQuery({
    queryKey: queryKeys.leaseTakeoverPost(id),
    queryFn: () => leaseTakeoverPostsApi.getLeaseTakeoverPostById(id),
    enabled: !!id,
  })
}

export function useCreateLeaseTakeoverPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: leaseTakeoverPostsApi.createLeaseTakeoverPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaseTakeoverPosts })
    },
  })
}

export function useUpdateLeaseTakeoverPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      leaseTakeoverPostsApi.updateLeaseTakeoverPost(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaseTakeoverPosts })
    },
  })
}

export function useDeleteLeaseTakeoverPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: leaseTakeoverPostsApi.deleteLeaseTakeoverPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaseTakeoverPosts })
    },
  })
}

// Roommate Responses Hooks
export function useRoommateResponses(postId: string) {
  return useQuery({
    queryKey: queryKeys.roommateResponses(postId),
    queryFn: () => roommateResponsesApi.getResponses(postId),
    enabled: !!postId,
  })
}

export function useCreateRoommateResponse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: roommateResponsesApi.createResponse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.roommateResponses(data.post_id) 
      })
    },
  })
}

export function useAcceptRoommateResponse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: roommateResponsesApi.acceptResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roommateResponses })
    },
  })
}

// Chats Hooks
export function useChats(userId: string) {
  return useQuery({
    queryKey: queryKeys.chats(userId),
    queryFn: () => chatsApi.getChats(userId),
    enabled: !!userId,
  })
}

export function useChat(id: string) {
  return useQuery({
    queryKey: queryKeys.chat(id),
    queryFn: () => chatsApi.getChat(id),
    enabled: !!id,
  })
}

export function useCreateChat() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: chatsApi.createChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats })
      queryClient.setQueryData(queryKeys.chat(data.id), data)
    },
  })
}

export function useGetOrCreateChat() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ user1Id, user2Id, listingId, postId }: {
      user1Id: string
      user2Id: string
      listingId?: string
      postId?: string
    }) => chatsApi.getOrCreateChat(user1Id, user2Id, listingId, postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats })
      queryClient.setQueryData(queryKeys.chat(data.id), data)
    },
  })
}

// Messages Hooks
export function useMessages(chatId: string) {
  return useQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: () => messagesApi.getMessages(chatId),
    enabled: !!chatId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.messages(data.chat_id) 
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.chats })
    },
  })
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages })
    },
  })
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: ['unread-count', userId],
    queryFn: () => messagesApi.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  })
}

// Saved Listings Hooks
export function useSavedListings(userId: string) {
  return useQuery({
    queryKey: queryKeys.savedListings(userId),
    queryFn: () => savedListingsApi.getSavedListings(userId),
    enabled: !!userId,
  })
}

export function useSaveListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: savedListingsApi.saveListing,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.savedListings(data.user_id) 
      })
    },
  })
}

export function useUnsaveListing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, listingId }: { userId: string; listingId: string }) =>
      savedListingsApi.unsaveListing(userId, listingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.savedListings(variables.userId) 
      })
    },
  })
}

export function useIsListingSaved(userId: string, listingId: string) {
  return useQuery({
    queryKey: ['is-listing-saved', userId, listingId],
    queryFn: () => savedListingsApi.isListingSaved(userId, listingId),
    enabled: !!userId && !!listingId,
  })
}

// User Profile Hooks
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.userProfile(userId),
    queryFn: () => userApi.getProfile(userId),
    enabled: !!userId,
  })
}

export function useCreateUserProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, userData }: { 
      userId: string
      userData: Parameters<typeof userApi.createProfile>[1] 
    }) => userApi.createProfile(userId, userData),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.userProfile(data.user_id), data)
    },
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, updates }: { 
      userId: string
      updates: Parameters<typeof userApi.updateProfile>[1] 
    }) => userApi.updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.userProfile(data.user_id), data)
    },
  })
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      userApi.uploadProfilePhoto(userId, file),
    onSuccess: (photoUrl, { userId }) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.userProfile(userId) 
      })
    },
  })
}

export function useUploadRoommatePostPhotos() {
  return useMutation({
    mutationFn: ({ userId, postId, files }: { userId: string; postId: string; files: File[] }) =>
      userApi.uploadRoommatePostPhotos(userId, postId, files),
  })
}

export function useUploadRoommatePostPhotosTemporary() {
  return useMutation({
    mutationFn: ({ userId, files }: { userId: string; files: File[] }) =>
      userApi.uploadRoommatePostPhotosTemporary(userId, files),
  })
}

export function useCheckUsernameAvailable() {
  return useMutation({
    mutationFn: (username: string) => userApi.checkUsernameAvailable(username),
  })
}

export function useGetUserByUsernameOrEmail() {
  return useMutation({
    mutationFn: (identifier: string) => userApi.getUserByUsernameOrEmail(identifier),
  })
}
