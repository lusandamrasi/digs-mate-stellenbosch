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
import { MapPin, Calendar, Users, MessageCircle, Filter, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

// Mock roommate posts
const roommatePosts = [
  {
    id: "1",
    type: "looking-for-roommates",
    title: "Looking for 2 roommates in Dalsig",
    budget: "R2,500 each",
    location: "Dalsig",
    availableFrom: "1 March 2024",
    currentRoommates: 1,
    totalRoommates: 3,
    description: "3rd year Engineering students looking for 2 more roommates to share a beautiful 3-bedroom house. We're clean, study-focused, and love to have fun on weekends!",
    preferences: ["Non-smoker", "Student", "Quiet hours"],
    postedBy: "Sarah M.",
    timePosted: "2 hours ago",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"]
  },
  {
    id: "2",
    type: "lease-takeover",
    title: "Lease takeover available - Die Boord",
    budget: "R3,200/month",
    location: "Die Boord",
    availableFrom: "15 March 2024",
    currentRoommates: 0,
    totalRoommates: 1,
    description: "I'm studying abroad next semester and need someone to take over my lease. Great location, 5 min walk to campus, fully furnished room.",
    preferences: ["Single occupancy", "Furnished", "Close to campus"],
    postedBy: "James K.",
    timePosted: "4 hours ago",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"]
  },
  {
    id: "3",
    type: "looking-for-roommates",
    title: "Female roommate wanted - Universiteitsoord",
    budget: "R1,950 each",
    location: "Universiteitsoord",
    availableFrom: "1 February 2024",
    currentRoommates: 2,
    totalRoommates: 3,
    description: "Two BCom students looking for one more female roommate. We have a great study environment and love cooking together!",
    preferences: ["Female only", "Non-smoker", "Study-focused"],
    postedBy: "Emma L.",
    timePosted: "1 day ago",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"]
  },
];

const Roommates = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  
  // Advanced filter states
  const [roommateCountFilter, setRoommateCountFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 15000]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  
  // Available options for filters
  const locations = ['All', 'Dalsig', 'Die Boord', 'Universiteitsoord', 'Stellenbosch Central', 'Other'];
  const preferences = ['Non-smoker', 'Student', 'Quiet hours', 'Female only', 'Study-focused', 'Single occupancy', 'Furnished', 'Close to campus', 'Good WiFi', 'Quiet'];

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
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

  const filteredPosts = roommatePosts.filter(post => {
    // Basic type filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'looking-for-roommates' && post.type !== 'looking-for-roommates') return false;
      if (activeFilter === 'lease-takeover' && post.type !== 'lease-takeover') return false;
    }
    
    // Roommate count filter
    if (roommateCountFilter !== 'all') {
      const count = parseInt(roommateCountFilter);
      if (post.totalRoommates !== count) return false;
    }
    
    // Location filter
    if (locationFilter !== 'all' && post.location !== locationFilter) return false;
    
    // Budget range filter
    const postBudget = parseInt(post.budget.replace(/[^\d]/g, ''));
    if (postBudget < budgetRange[0] || postBudget > budgetRange[1]) return false;
    
    // Preferences filter
    if (selectedPreferences.length > 0) {
      const hasMatchingPreference = selectedPreferences.some(pref => 
        post.preferences.includes(pref)
      );
      if (!hasMatchingPreference) return false;
    }
    
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
                  
                  {/* Roommate Count Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Roommate Count
                    </label>
                    <Select value={roommateCountFilter} onValueChange={setRoommateCountFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any count</SelectItem>
                        <SelectItem value="1">1 roommate</SelectItem>
                        <SelectItem value="2">2 roommates</SelectItem>
                        <SelectItem value="3">3 roommates</SelectItem>
                        <SelectItem value="4">4+ roommates</SelectItem>
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
            Showing {filteredPosts.length} of {roommatePosts.length} posts
          </p>
          {(roommateCountFilter !== 'all' || locationFilter !== 'all' || selectedPreferences.length > 0 || budgetRange[0] > 0 || budgetRange[1] < 15000) && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-sm">
                  Try adjusting your filters or check back later for new posts.
                </p>
              </div>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {post.images.length > 0 && (
                    <div className="md:w-1/3">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`p-6 flex-1 ${post.images.length === 0 ? 'w-full' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Badge 
                          variant={post.type === 'lease-takeover' ? 'destructive' : 'secondary'}
                          className="mb-2"
                        >
                          {post.type === 'looking-for-roommates' ? 'Looking for Roommates' :
                           post.type === 'lease-takeover' ? 'Lease Takeover' : 'Other'}
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
                          <div className="text-2xl font-bold text-primary">{post.budget}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {post.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Available {post.availableFrom}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {post.currentRoommates}/{post.totalRoommates} roommates
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{post.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.preferences.map((pref, index) => (
                        <Badge key={index} variant="outline">
                          {pref}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        By {post.postedBy} • {post.timePosted}
                      </div>
                      <Button size="sm" className="bg-gradient-accent hover:opacity-90 transition-smooth">
                        <MessageCircle size={16} className="mr-2" />
                        Message
                      </Button>
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
    </div>
  );
};

export default Roommates;