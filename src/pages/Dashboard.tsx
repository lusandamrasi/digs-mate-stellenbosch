import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, MapPin, RefreshCw, Users } from "lucide-react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { useState } from "react";

// Featured properties will be fetched from the database
const featuredProperties: any[] = [];

// Recent roommate posts will be fetched from the database
const featuredRoommatePosts: any[] = [];

const Dashboard = () => {
  const { user } = useAuth();

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
          {featuredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No properties available yet</h3>
                <p className="text-sm">
                  Check back later for featured properties.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
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
          {featuredRoommatePosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No roommate posts yet</h3>
                <p className="text-sm">
                  Be the first to create a roommate post!
                </p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;