import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  roommatePostsApi,
  leaseTakeoverPostsApi,
  chatsApi,
  messagesApi,
  userApi,
} from '../lib/api'

// Query Keys
export const queryKeys = {
  roommatePosts: ['roommate-posts'] as const,
  roommatePost: (id: string) => ['roommate-posts', id] as const,
  leaseTakeoverPosts: ['lease-takeover-posts'] as const,
  leaseTakeoverPost: (id: string) => ['lease-takeover-posts', id] as const,
  chats: (userId: string) => ['chats', userId] as const,
  chat: (id: string) => ['chat', id] as const,
  messages: (chatId: string) => ['messages', chatId] as const,
  userProfile: (userId: string) => ['user-profile', userId] as const,
}

// Roommate Posts Hooks
export function useRoommatePosts() {
  return useQuery({
    queryKey: queryKeys.roommatePosts,
    queryFn: () => roommatePostsApi.getRoommatePosts(),
    staleTime: 5 * 60 * 1000,
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
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
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
    staleTime: 5 * 60 * 1000,
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

// Chats Hooks
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
      queryClient.invalidateQueries({ queryKey: queryKeys.chats(data.user1_id) })
      queryClient.setQueryData(queryKeys.chat(data.id), data)
    },
  })
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: ['unread-count', userId] as const,
    queryFn: () => messagesApi.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 10000,
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
      userData: any
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
      updates: any
    }) => userApi.updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.userProfile(data.user_id), data)
    },
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

