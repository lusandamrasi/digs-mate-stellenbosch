import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoommatePosts, useLeaseTakeoverPosts } from '../hooks/useQueries';
import { useAuth } from '../contexts/AuthContext';

interface BrowseScreenProps {
  navigation: any;
}

export default function BrowseScreen({ navigation }: BrowseScreenProps) {
  const { user } = useAuth();
  const { data: roommatePosts, isLoading: loadingRoommates } = useRoommatePosts();
  const { data: leasePosts, isLoading: loadingLease } = useLeaseTakeoverPosts();

  const isLoading = loadingRoommates || loadingLease;
  const allPosts = [
    ...(roommatePosts?.map(p => ({ ...p, type: 'roommate' })) || []),
    ...(leasePosts?.map(p => ({ ...p, type: 'lease' })) || []),
  ];

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
    >
      {item.photos && item.photos[0] && (
        <Image source={{ uri: item.photos[0] }} style={styles.postImage} />
      )}
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        {item.type === 'roommate' && (
          <Text style={styles.postPrice}>R{item.price_per_person || 0}/person</Text>
        )}
        {item.type === 'lease' && (
          <Text style={styles.postPrice}>R{item.monthly_rent || 0}/month</Text>
        )}
        {item.location && (
          <Text style={styles.postLocation}>
            {typeof item.location === 'string' ? item.location : item.location?.name || 'Location'}
          </Text>
        )}
        {item.user && (
          <Text style={styles.postUser}>Posted by {item.user.full_name || item.user.username}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Posts</Text>
        <Text style={styles.headerSubtitle}>
          {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} available
        </Text>
      </View>

      {allPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts available yet</Text>
          <Text style={styles.emptySubtext}>Check back later for new posts!</Text>
        </View>
      ) : (
        <FlatList
          data={allPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  postPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  postLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  postUser: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

