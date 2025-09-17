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
  {
    id: "4",
    type: "looking-for-place",
    title: "Looking for accommodation for 2025",
    budget: "R3,000 max",
    location: "Stellenbosch Central",
    availableFrom: "1 January 2025",
    currentRoommates: 0,
    totalRoommates: 1,
    description: "Final year law student looking for a quiet place to stay. Preferably close to campus with good WiFi for research.",
    preferences: ["Quiet", "Good WiFi", "Close to campus"],
    postedBy: "David R.",
    timePosted: "2 days ago",
    images: []
  }
];

const Roommates = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredPosts = roommatePosts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'looking-for-roommates') return post.type === 'looking-for-roommates';
    if (activeFilter === 'lease-takeover') return post.type === 'lease-takeover';
    if (activeFilter === 'looking-for-place') return post.type === 'looking-for-place';
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
              <Button 
                variant={activeFilter === 'looking-for-place' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveFilter('looking-for-place')}
              >
                Looking for Place
              </Button>
            </div>
            
            {/* Advanced Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Roommate Count</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Location</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Available Date</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Budget Range</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Preferences</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {filteredPosts.map((post) => (
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
                           post.type === 'lease-takeover' ? 'Lease Takeover' : 'Looking for Place'}
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
          ))}
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