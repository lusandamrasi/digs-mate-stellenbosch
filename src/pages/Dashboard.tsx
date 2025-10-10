import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, MapPin, RefreshCw, Users, Calendar, Clock, Heart, Navigation } from "lucide-react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { useRoommatePosts, useLeaseTakeoverPosts } from "@/hooks/useQueries";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import ImageGallery from "@/components/ImageGallery";
import CityChips from "@/components/CityChips";
import LocationDisplay from "@/components/LocationDisplay";
import LocationFilter from "@/components/LocationFilter";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: roommatePosts = [], isLoading: isLoadingRoommates } = useRoommatePosts();
  const { data: leaseTakeoverPosts = [], isLoading: isLoadingTakeovers } = useLeaseTakeoverPosts();
  
  // Use location context instead of local state
  const { selectedCity, setSelectedCity, radius, isFilterOpen, setIsFilterOpen } = useLocation();
  
  // Get recent posts (limit to 3 each for dashboard)
  const recentRoommatePosts = roommatePosts.slice(0, 3);
  const recentLeaseTakeovers = leaseTakeoverPosts.slice(0, 3);
  
  const isLoading = isLoadingRoommates || isLoadingTakeovers;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <HeroSection />
      
      {/* Location Filter Section */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* City Chips */}
          <CityChips 
            selectedCity={selectedCity}
            onCitySelect={setSelectedCity}
          />
          
          {/* Location Display and Filter Button */}
          <div className="flex items-center justify-between gap-4">
            <LocationDisplay 
              selectedCity={selectedCity}
              radius={radius}
              onClick={() => setIsFilterOpen(true)}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="gap-2"
            >
              <Navigation size={16} />
              Filters
            </Button>
          </div>
        </div>
      </section>
      
      {/* Location Filter Modal */}
      <LocationFilter 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
      />
      
      {/* Quick Stats */}
      <section className="py-6 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{roommatePosts.length}</div>
              <div className="text-sm text-muted-foreground">Roommate Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{leaseTakeoverPosts.length}</div>
              <div className="text-sm text-muted-foreground">Lease Takeovers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star size={12} className="fill-warning text-warning" />
                Trust Rating
              </div>
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
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {post.location.name}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {post.current_roommates || 1}/{post.current_roommates + post.roommates_needed}
                          </div>
                          <div className="flex items-center gap-1 text-primary">
                            <Navigation size={14} />
                            2.5km away
                          </div>
                        </div>

                        {post.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            By {post.user?.username || post.user?.full_name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
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
                            <div className="flex items-center gap-1">
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
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
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
    </div>
  );
};

export default Dashboard;