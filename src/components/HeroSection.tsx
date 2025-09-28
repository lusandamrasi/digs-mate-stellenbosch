import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartSearching = () => {
    navigate('/listings');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Find Your Perfect
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Student Home</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with roommates, discover quality accommodation, and find your perfect place in Stellenbosch's vibrant student community.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border shadow-soft">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Prime Locations</h3>
                  <p className="text-xs text-muted-foreground">Near campus</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border shadow-soft">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Find Roommates</h3>
                  <p className="text-xs text-muted-foreground">Perfect matches</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border shadow-soft">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Verified Listings</h3>
                  <p className="text-xs text-muted-foreground">Safe & trusted</p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-smooth text-lg px-8"
                onClick={handleStartSearching}
              >
                Start Searching
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img
                src={heroImage}
                alt="Beautiful student accommodation in Stellenbosch"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              
              {/* Floating stats */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4 border border-border shadow-medium">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p className="text-xs text-muted-foreground">Active Listings</p>
                    </div>
                    <div>
                      <p className="text-2xl text-green-600 font-bold text-accent">1.2k+</p>
                      <p className="text-xs text-muted-foreground">Happy Students</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">98%</p>
                      <p className="text-xs text-muted-foreground">Match Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;