import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Shield, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleFindRoommates = () => {
    navigate('/roommates');
  };

  const handleCreatePost = () => {
    navigate('/post');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Text content */}
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Connect with Your Perfect
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Roommate</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Find compatible roommates, discover lease takeover opportunities, and make seamless housing transitions in South Africa's trusted student community.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex justify-center gap-4">
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border shadow-soft">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Perfect Matches</h3>
                  <p className="text-xs text-muted-foreground">Compatible roommates</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border shadow-soft">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Lease Takeovers</h3>
                  <p className="text-xs text-muted-foreground">Time-sensitive opportunities</p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-smooth text-lg px-8"
                onClick={handleFindRoommates}
              >
                Find Roommates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth text-lg px-8"
                onClick={handleCreatePost}
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;