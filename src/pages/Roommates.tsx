import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MapPin, Calendar, Users, MessageCircle, Filter, Heart, Plus, Edit, Trash2, Home } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useRoommatePosts, useDeleteRoommatePost, useLeaseTakeoverPosts, useDeleteLeaseTakeoverPost, useGetOrCreateChat } from "@/hooks/useQueries";
import { useAuth } from "@/providers/BetterAuthProvider";
import ImageGallery from "@/components/ImageGallery";
import { toast } from "sonner";
import { chatsApi } from "@/lib/api";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const Roommates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: roommatePosts = [], isLoading: isLoadingRoommates } = useRoommatePosts();
  const { data: leaseTakeoverPosts = [], isLoading: isLoadingTakeovers } = useLeaseTakeoverPosts();
  const deleteRoommatePost = useDeleteRoommatePost();
  const deleteLeaseTakeoverPost = useDeleteLeaseTakeoverPost();
  const getOrCreateChat = useGetOrCreateChat();
  
  // Combine both types of posts
  const allPosts = [
    ...roommatePosts.map(post => ({ ...post, post_type: 'roommate_needed' as const })),
    ...leaseTakeoverPosts.map(post => ({ ...post, post_type: 'lease_takeover' as const }))
  ];
  
  const isLoading = isLoadingRoommates || isLoadingTakeovers;
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [locationDialog, setLocationDialog] = useState<{
    open: boolean;
    locationName: string;
    latitude: number | null;
    longitude: number | null;
    placeId: string | null;
  }>({
    open: false,
    locationName: '',
    latitude: null,
    longitude: null,
    placeId: null,
  });
  

  // Function to open Google Maps
  const openGoogleMaps = () => {
    const { latitude, longitude, placeId, locationName } = locationDialog;
    
    let mapsUrl = '';
    if (latitude && longitude) {
      // Use coordinates if available (most accurate)
      mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } else if (placeId) {
      // Use place ID if coordinates not available
      mapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    } else if (locationName) {
      // Fallback to location name
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    }
    
    if (mapsUrl) {
      window.open(mapsUrl, '_blank');
    }
    setLocationDialog({ open: false, locationName: '', latitude: null, longitude: null, placeId: null });
  };

  // Function to handle location click
  const handleLocationClick = (location: any) => {
    if (!location?.name) return;
    
    setLocationDialog({
      open: true,
      locationName: location.name || '',
      latitude: location.latitude || null,
      longitude: location.longitude || null,
      placeId: location.place_id || null,
    });
  };
  
  // Advanced filter states
  const [roommateCountFilter, setRoommateCountFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 15000]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  
  // Available options for filters
  const locations = ['All', 'Dalsig', 'Die Boord', 'Universiteitsoord', 'City Central', 'Other'];
  const preferences = ['Non-smoker', 'Student', 'Quiet hours', 'Female only', 'Study-focused', 'Single occupancy', 'Furnished', 'Close to campus', 'Good WiFi', 'Quiet'];

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleDeletePost = async (postId: string, postType: 'roommate_needed' | 'lease_takeover') => {
    if (!user) {
      toast.error('You must be logged in to delete posts');
      return;
    }

    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        if (postType === 'roommate_needed') {
          await deleteRoommatePost.mutateAsync(postId);
        } else {
          await deleteLeaseTakeoverPost.mutateAsync(postId);
        }
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const handleEditPost = (postId: string) => {
    // TODO: Implement edit functionality
    // For now, just show a message
    toast.info('Edit functionality coming soon!');
  };

  const handleMessageUser = async (postUserId: string, postId: string, postType: 'roommate_needed' | 'lease_takeover') => {
    if (!user?.id) {
      toast.error('Please log in to send messages');
      return;
    }

    if (postUserId === user.id) {
      toast.info("You can't message yourself");
      return;
    }

    try {
      const chat = await chatsApi.getOrCreateChat(user.id, postUserId, null, postId);
      navigate('/messages', { state: { selectedChatId: chat.id } });
    } catch (error: any) {
      console.error('Error creating/getting chat:', error);
      toast.error(error.message || 'Failed to start conversation');
    }
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const clearAllFilters = () => {
    setRoommateCountFilter('all');
    setLocationFilter('all');
    setBudgetRange([0, 15000]);
    setSelectedPreferences([]);
  };

  const filteredPosts = allPosts.filter(post => {
    // Basic type filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'looking-for-roommates' && post.post_type !== 'roommate_needed') return false;
      if (activeFilter === 'lease-takeover' && post.post_type !== 'lease_takeover') return false;
    }
    
    // Property capacity filter (only for roommate posts)
    if (roommateCountFilter !== 'all' && post.post_type === 'roommate_needed') {
      const totalCapacity = post.listing_capacity || 0;
      const filterCapacity = parseInt(roommateCountFilter);
      
      if (filterCapacity === 4) {
        // For 4+, check if total capacity is 4 or more
        if (totalCapacity < 4) return false;
      } else {
        // For exact numbers, check if total capacity matches
        if (totalCapacity !== filterCapacity) return false;
      }
    }
    
    // Location filter
    if (locationFilter !== 'all' && post.location?.name !== locationFilter) return false;
    
    // Budget range filter
    const price = post.post_type === 'roommate_needed' ? post.price_per_person : post.monthly_rent;
    if (price && (price < budgetRange[0] || price > budgetRange[1])) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Find Roommates
          </h1>
          <p className="text-primary-foreground/90">
            Connect with fellow students for shared accommodation
          </p>
        </div>
      </div>

      {/* Location Section */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            <span className="text-lg font-semibold text-foreground">Stellenbosch</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All Posts
              </Button>
              <Button 
                variant={activeFilter === 'looking-for-roommates' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveFilter('looking-for-roommates')}
              >
                Looking for Roommates
              </Button>
              <Button 
                variant={activeFilter === 'lease-takeover' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveFilter('lease-takeover')}
              >
                Lease Takeovers
              </Button>
            </div>
            
            {/* Advanced Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-2" />
                  Filters
                  {(roommateCountFilter !== 'all' || locationFilter !== 'all' || selectedPreferences.length > 0 || budgetRange[0] > 0 || budgetRange[1] < 15000) && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Advanced Filters</h4>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                      Clear All
                    </Button>
                  </div>
                  
                  {/* Property Capacity Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Property Capacity
                    </label>
                    <Select value={roommateCountFilter} onValueChange={setRoommateCountFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any capacity</SelectItem>
                        <SelectItem value="1">1 person</SelectItem>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location.toLowerCase() === 'all' ? 'all' : location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Range Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Range (R{budgetRange[0]} - R{budgetRange[1]})</label>
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      max={15000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R0</span>
                      <span>R15,000+</span>
                    </div>
                  </div>

                  {/* Preferences Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferences</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {preferences.map((preference) => (
                        <div key={preference} className="flex items-center space-x-2">
                          <Checkbox
                            id={preference}
                            checked={selectedPreferences.includes(preference)}
                            onCheckedChange={() => handlePreferenceToggle(preference)}
                          />
                          <label
                            htmlFor={preference}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {preference}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {allPosts.length} posts
          </p>
          {(roommateCountFilter !== 'all' || locationFilter !== 'all' || selectedPreferences.length > 0 || budgetRange[0] > 0 || budgetRange[1] < 15000) && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">Loading posts...</h3>
                <p className="text-sm">
                  Please wait while we fetch the latest roommate posts.
                </p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-sm">
                  No roommate posts available yet. Be the first to create a post!
                </p>
              </div>
              <Button 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => navigate('/post')}
              >
                Create Post
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image Gallery */}
                  {post.photos && post.photos.length > 0 && (
                    <div className="md:w-1/3">
                      <ImageGallery
                        images={post.photos}
                        alt={post.title}
                        className="rounded-l-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`p-6 flex-1 ${!post.photos || post.photos.length === 0 ? 'w-full' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Badge 
                          variant={post.post_type === 'lease_takeover' ? 'destructive' : 'secondary'}
                          className="mb-2"
                        >
                          {post.post_type === 'roommate_needed' ? 'Looking for Roommates' :
                           post.post_type === 'lease_takeover' ? 'Lease Takeover' : 'Other'}
                        </Badge>
                        <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSavePost(post.id)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              savedPosts.includes(post.id) ? 'fill-red-500 text-red-500' : ''
                            }`} 
                          />
                        </Button>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {post.post_type === 'roommate_needed' && post.price_per_person ? `R${post.price_per_person.toLocaleString()}/person` : 
                             post.post_type === 'lease_takeover' && post.monthly_rent ? `R${post.monthly_rent.toLocaleString()}/month` : 'Price TBD'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      {post.location?.name && (
                        <div 
                          className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleLocationClick(post.location)}
                        >
                        <MapPin size={14} />
                          {post.location.name}
                      </div>
                      )}
                      {('accommodation_type' in post && post.accommodation_type) && (
                      <div className="flex items-center gap-1">
                          <Home size={14} />
                          {post.accommodation_type.charAt(0).toUpperCase() + post.accommodation_type.slice(1)}
                      </div>
                      )}
                      
                      {post.post_type === 'roommate_needed' && post.listing_capacity && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                          {(() => {
                            const capacity = post.listing_capacity || 0;
                            const needed = post.roommates_needed || 0;
                            const current = capacity - needed;
                            return `${current}/${capacity}`;
                          })()}
                        </div>
                      )}
                      {post.post_type === 'lease_takeover' && post.available_from && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Available {new Date(post.available_from).toLocaleDateString()}
                      </div>
                      )}
                    </div>

                    {/* Description */}
                    {post.description && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
                    )}

                    {/* Preferences - only for roommate posts */}
                    {post.post_type === 'roommate_needed' && 'preferences' in post && post.preferences && post.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                      {post.preferences.map((pref, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        By {post.user?.username || post.user?.full_name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        {user?.id === post.user_id && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPost(post.id)}
                              className="text-xs"
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePost(post.id, post.post_type)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                        {user?.id !== post.user_id && (
                          <Button 
                            size="sm" 
                            className="bg-primary hover:opacity-90 transition-smooth"
                            onClick={() => handleMessageUser(post.user_id, post.id, post.post_type)}
                          >
                            <MessageCircle size={16} className="mr-2" />
                            Message
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      </div>

      {/* Location Dialog */}
      <AlertDialog open={locationDialog.open} onOpenChange={(open) => setLocationDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Open in Google Maps?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to open "{locationDialog.locationName}" in Google Maps?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={openGoogleMaps}>
              Open Maps
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Roommates;