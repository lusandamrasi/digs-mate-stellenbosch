import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, MapPin } from "lucide-react";

// Mock featured properties
const featuredProperties = [
  {
    id: "1",
    title: "Modern Student Apartment Near Campus",
    price: 4500,
    location: "Stellenbosch Central",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    maxOccupants: 2,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    availableFrom: "1 March 2024",
    description: "Beautiful modern apartment with all amenities included."
  },
  {
    id: "6",
    title: "Luxury Student Apartment Complex",
    price: 7500,
    location: "Stellenbosch Central",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    maxOccupants: 2,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    availableFrom: "1 February 2024",
    description: "Premium accommodation with gym, pool, and study areas."
  }
];

// Mock roommate posts
const featuredRoommatePosts = [
  {
    id: "1",
    title: "Looking for 2 roommates in Dalsig",
    budget: "R2,500 each",
    location: "Dalsig",
    description: "3rd year students looking for 2 more roommates to share a beautiful house",
    postedBy: "Sarah M.",
    timePosted: "2 hours ago"
  },
  {
    id: "2", 
    title: "Lease takeover available - Die Boord",
    budget: "R3,200/month",
    location: "Die Boord",
    description: "Taking over my lease from March. Great location, 5 min walk to campus",
    postedBy: "James K.",
    timePosted: "4 hours ago"
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <HeroSection />
      
      {/* Quick Stats */}
      <section className="py-6 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">89</div>
              <div className="text-sm text-muted-foreground">Roommate Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star size={12} className="fill-warning text-warning" />
                Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Properties</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Roommate Posts */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Roommate Posts:</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {featuredRoommatePosts.map((post) => (
              <div key={post.id} className="bg-card p-4 rounded-lg shadow-soft border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold font-bold text-foreground">{post.title}</h3>
                  <span className="text-lg font-bold text-primary">{post.budget}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin size={14} />
                  {post.location}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{post.description}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>By {post.postedBy}</span>
                  <span>{post.timePosted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;