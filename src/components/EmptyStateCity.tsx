import { Button } from "@/components/ui/button";
import { MapPin, Users, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateCityProps {
  cityName?: string;
  type?: "roommates" | "takeovers" | "all";
}

export const EmptyStateCity: React.FC<EmptyStateCityProps> = ({ 
  cityName = "this city",
  type = "all"
}) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case "roommates":
        return <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />;
      case "takeovers":
        return <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />;
      default:
        return <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />;
    }
  };

  const getHeading = () => {
    if (type === "roommates") return `No roommate posts in ${cityName} yet`;
    if (type === "takeovers") return `No lease takeovers in ${cityName} yet`;
    return `No posts in ${cityName} yet`;
  };

  const getSubheading = () => {
    if (type === "roommates") return "Be the first to post a roommate request in this area!";
    if (type === "takeovers") return "Be the first to post a lease takeover in this area!";
    return "Be the first to create a post in this area!";
  };

  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        {getIcon()}
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {getHeading()}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {getSubheading()}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate('/post')}
            className="bg-primary hover:opacity-90"
          >
            Create Post
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              // This would trigger the location filter modal
              console.log("Try another city");
            }}
          >
            <MapPin size={16} className="mr-2" />
            Try Another City
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          💡 Tip: Expand your search radius or try nearby cities
        </p>
      </div>
    </div>
  );
};

export default EmptyStateCity;

