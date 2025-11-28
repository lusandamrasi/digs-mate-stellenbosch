import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface CityChipsProps {
  selectedCity?: string;
  onCitySelect?: (city: string) => void;
}

const QUICK_CITIES = [
  { value: "all", label: "All Cities" },
  { value: "stellenbosch", label: "Stellenbosch" },
  { value: "cape-town", label: "Cape Town" },
  { value: "johannesburg", label: "Johannesburg" },
  { value: "pretoria", label: "Pretoria" },
  { value: "durban", label: "Durban" }
];

export const CityChips: React.FC<CityChipsProps> = ({ 
  selectedCity = "stellenbosch", 
  onCitySelect 
}) => {
  const handleCityClick = (cityValue: string) => {
    console.log("City selected:", cityValue);
    onCitySelect?.(cityValue);
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {QUICK_CITIES.map((city) => {
          const isActive = selectedCity === city.value;
          return (
            <Badge
              key={city.value}
              variant={isActive ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-all hover:scale-105 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-accent"
              }`}
              onClick={() => handleCityClick(city.value)}
            >
              {city.value !== "all" && <MapPin size={14} className="mr-1.5" />}
              {city.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CityChips;

