import { MapPin } from "lucide-react";
import { SOUTH_AFRICAN_CITIES } from "./LocationFilter";

interface LocationDisplayProps {
  selectedCity?: string;
  radius?: number;
  onClick?: () => void;
  className?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  selectedCity = "stellenbosch",
  radius = 10,
  onClick,
  className = ""
}) => {
  const cityLabel = SOUTH_AFRICAN_CITIES.find(c => c.value === selectedCity)?.label || "Unknown";
  
  const displayText = selectedCity === "all" 
    ? "Showing posts: All locations"
    : `Showing posts in: ${cityLabel} (within ${radius}km)`;

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors ${className}`}
      onClick={onClick}
    >
      <MapPin size={16} className="text-primary" />
      <span>{displayText}</span>
    </div>
  );
};

export default LocationDisplay;

