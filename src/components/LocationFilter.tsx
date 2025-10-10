import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MapPin, Navigation, X } from "lucide-react";

export const SOUTH_AFRICAN_CITIES = [
  { value: "all", label: "All Cities" },
  { value: "stellenbosch", label: "Stellenbosch" },
  { value: "cape-town", label: "Cape Town" },
  { value: "johannesburg", label: "Johannesburg" },
  { value: "pretoria", label: "Pretoria" },
  { value: "durban", label: "Durban" },
  { value: "port-elizabeth", label: "Port Elizabeth (Gqeberha)" },
  { value: "bloemfontein", label: "Bloemfontein" },
  { value: "grahamstown", label: "Grahamstown (Makhanda)" },
  { value: "potchefstroom", label: "Potchefstroom" },
  { value: "pietermaritzburg", label: "Pietermaritzburg" }
];

interface LocationFilterProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ open, onOpenChange, trigger }) => {
  const [selectedCity, setSelectedCity] = useState("stellenbosch");
  const [radius, setRadius] = useState([10]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  const handleClearFilters = () => {
    setSelectedCity("all");
    setRadius([10]);
    console.log("Filters cleared");
  };

  const handleApplyFilters = () => {
    console.log("Applied filters:", { city: selectedCity, radius: radius[0] });
    handleOpen(false);
  };

  const handleUseMyLocation = () => {
    console.log("Use my location clicked");
    // Future implementation: Get user's current location
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin size={24} className="text-primary" />
            Location Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* City Selection */}
          <div className="space-y-2">
            <Label htmlFor="city-select" className="text-base font-semibold">
              City / Town
            </Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger id="city-select">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {SOUTH_AFRICAN_CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select the city where you're looking for accommodation
            </p>
          </div>

          {/* Use My Location Button */}
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleUseMyLocation}
          >
            <Navigation size={16} className="mr-2" />
            Use My Current Location
          </Button>

          {/* Distance Radius */}
          {selectedCity !== "all" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="radius-slider" className="text-base font-semibold">
                  Search Radius
                </Label>
                <span className="text-sm font-medium text-primary">
                  {radius[0]}km
                </span>
              </div>
              <Slider
                id="radius-slider"
                value={radius}
                onValueChange={setRadius}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1km</span>
                <span>25km</span>
                <span>50km</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Show posts within {radius[0]}km of the selected city center
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClearFilters}
            >
              <X size={16} className="mr-2" />
              Clear Filters
            </Button>
            <Button 
              className="flex-1 bg-primary hover:opacity-90"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationFilter;

