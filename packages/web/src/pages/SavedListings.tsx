import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, MessageCircle, Heart, Trash2 } from "lucide-react";
import { useState } from "react";

// Mock saved listings data
const savedListings = [
  {
    id: "3",
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
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"],
    savedAt: "3 hours ago"
  }
];

const SavedListings = () => {
  const [savedItems, setSavedItems] = useState(savedListings);

  const handleRemoveSaved = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Saved Listings
          </h1>
          <p className="text-primary-foreground/90">
            Your favorite properties and roommate posts
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {savedItems.length} saved items
            </div>
            <Button variant="outline" size="sm">
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Saved Items */}
      <div className="container mx-auto px-4 py-6">
        {savedItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No saved listings yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring and save properties or roommate posts you're interested in.
            </p>
            <Button className="bg-gradient-primary hover:opacity-90">
              Browse Listings
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    {item.images && item.images.length > 0 && (
                      <div className="md:w-1/3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className={`p-6 flex-1 ${!item.images || item.images.length === 0 ? 'w-full' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge 
                            variant={
                              item.type === 'lease-takeover' ? 'destructive' : 
                              item.type === 'roommate-post' ? 'secondary' : 'default'
                            }
                            className="mb-2"
                          >
                            {item.type === 'property' ? 'Property' :
                             item.type === 'roommate-post' ? 'Roommate Post' : 'Lease Takeover'}
                          </Badge>
                          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSaved(item.id)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {item.price ? `R${item.price.toLocaleString()}` : item.budget}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Available {item.availableFrom}
                        </div>
                        {item.type === 'property' && (
                          <>
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              {item.bedrooms} bed • {item.bathrooms} bath
                            </div>
                          </>
                        )}
                        {item.type === 'roommate-post' && (
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {item.currentRoommates}/{item.totalRoommates} roommates
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4">{item.description}</p>

                      {item.preferences && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.preferences.map((pref, index) => (
                            <Badge key={index} variant="outline">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Saved {item.savedAt}
                          {item.postedBy && ` • By ${item.postedBy}`}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-gradient-accent hover:opacity-90 transition-smooth">
                            <MessageCircle size={16} className="mr-2" />
                            Contact
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
    </div>
  );
};

export default SavedListings;
