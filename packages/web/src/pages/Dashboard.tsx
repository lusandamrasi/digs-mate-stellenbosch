import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, MapPin, RefreshCw, Users, Calendar, Clock, Heart, Navigation, Home, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/BetterAuthProvider";
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
import { useRoommatePosts, useLeaseTakeoverPosts } from "shared/hooks/useQueries";
import { useNavigate } from "react-router-dom";
import ImageGallery from "@/components/ImageGallery";
import { chatsApi } from "shared/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: roommatePosts = [], isLoading: isLoadingRoommates } = useRoommatePosts();
  const { data: leaseTakeoverPosts = [], isLoading: isLoadingTakeovers } = useLeaseTakeoverPosts();
  
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

  // Function to handle message user
  const handleMessageUser = async (postUserId: string, postId: string) => {
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
  
  // Get recent posts (limit to 3 each for dashboard)
  const recentRoommatePosts = roommatePosts.slice(0, 3);
  const recentLeaseTakeovers = leaseTakeoverPosts.slice(0, 3);
  
  const isLoading = isLoadingRoommates || isLoadingTakeovers;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <HeroSection />
      
      {/* Quick Stats */}
      <section className="py-6 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{roommatePosts.length}</div>
              <div className="text-sm text-muted-foreground">Roommate Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{leaseTakeoverPosts.length}</div>
              <div className="text-sm text-muted-foreground">Lease Takeovers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Roommate Posts */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Roommate Posts</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => navigate('/roommates')}
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Loading posts...</h3>
                <p className="text-sm">Please wait while we fetch the latest roommate posts.</p>
              </div>
            </div>
          ) : recentRoommatePosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No roommate posts yet</h3>
                <p className="text-sm mb-4">
                  Be the first to create a roommate post!
                </p>
                <Button onClick={() => navigate('/post')}>
                  Create Post
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRoommatePosts.map((post) => (
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
                            <Badge variant="secondary" className="mb-2">
                              Looking for Roommates
                            </Badge>
                            <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {post.price_per_person ? `R${post.price_per_person.toLocaleString()}/person` : 'Price TBD'}
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
                          {post.listing_capacity && (
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
                          <div className="flex items-center gap-1 text-primary">
                            <Navigation size={14} />
                            2.5km away
                          </div>
                        </div>

                        {post.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
                        )}

                        {post.post_type === 'roommate_needed' && 'preferences' in post && post.preferences && post.preferences.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.preferences.map((pref: string, index: number) => (
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
                            {user?.id !== post.user_id && (
                              <Button 
                                size="sm" 
                                className="bg-primary hover:opacity-90 transition-smooth"
                                onClick={() => handleMessageUser(post.user_id, post.id)}
                              >
                                <MessageCircle size={14} className="mr-1" />
                                Message
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Lease Takeover Opportunities */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Lease Takeover Opportunities</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => navigate('/roommates')}
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          {recentLeaseTakeovers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No lease takeovers available</h3>
                <p className="text-sm mb-4">
                  Check back for lease takeover opportunities!
                </p>
                <Button onClick={() => navigate('/post')}>
                  Create Takeover Post
                </Button>
              </div>
            </div>
          ) : (
          <div className="space-y-4">
              {recentLeaseTakeovers.map((post) => (
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
                            <Badge variant="destructive" className="mb-2">
                              Lease Takeover
                            </Badge>
                            <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {post.monthly_rent ? `R${post.monthly_rent.toLocaleString()}/month` : 'Price TBD'}
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
                          <div className="flex items-center gap-1 text-primary">
                            <Navigation size={14} />
                            3.8km away
                          </div>
                          {post.available_from && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              Available {new Date(post.available_from).toLocaleDateString()}
                            </div>
                          )}
                          {post.available_from && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {Math.ceil((new Date(post.available_from).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </div>
                          )}
                        </div>

                        {post.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            By {post.user?.username || post.user?.full_name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            {user?.id !== post.user_id && (
                              <Button 
                                size="sm" 
                                className="bg-primary hover:opacity-90 transition-smooth"
                                onClick={() => handleMessageUser(post.user_id, post.id)}
                              >
                                <MessageCircle size={14} className="mr-1" />
                                Message
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                </div>
                </div>
              </div>
                  </CardContent>
                </Card>
            ))}
          </div>
          )}
        </div>
      </section>

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

export default Dashboard;