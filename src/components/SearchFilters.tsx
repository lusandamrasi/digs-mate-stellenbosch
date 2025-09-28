import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  Sliders, 
  Home, 
  Users, 
  Bed, 
  DollarSign,
  Filter
} from "lucide-react";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    budget: number[];
    selectedType: string;
    selectedRooms: string;
  }) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState([2000]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedRooms, setSelectedRooms] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Update filters whenever any filter changes
  const updateFilters = () => {
    onFiltersChange({
      searchTerm,
      budget,
      selectedType,
      selectedRooms
    });
  };

  // Handle search input
  const handleSearch = () => {
    updateFilters();
  };

  // Handle budget change
  const handleBudgetChange = (newBudget: number[]) => {
    setBudget(newBudget);
    setTimeout(() => {
      onFiltersChange({
        searchTerm,
        budget: newBudget,
        selectedType,
        selectedRooms
      });
    }, 100);
  };

  // Handle type selection
  const handleTypeChange = (type: string) => {
    const newType = selectedType === type ? "" : type;
    setSelectedType(newType);
    onFiltersChange({
      searchTerm,
      budget,
      selectedType: newType,
      selectedRooms
    });
  };

  // Handle rooms selection
  const handleRoomsChange = (rooms: string) => {
    const newRooms = selectedRooms === rooms ? "" : rooms;
    setSelectedRooms(newRooms);
    onFiltersChange({
      searchTerm,
      budget,
      selectedType,
      selectedRooms: newRooms
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setBudget([2000]);
    setSelectedType("");
    setSelectedRooms("");
    onFiltersChange({
      searchTerm: "",
      budget: [2000],
      selectedType: "",
      selectedRooms: ""
    });
  };

  const propertyTypes = [
    { id: "digs", label: "Digs", icon: Home },
    { id: "apartment", label: "Apartment", icon: Bed },
    { id: "flat", label: "Flat", icon: Home },
    { id: "room", label: "Single Room", icon: Bed },
  ];

  const roomOptions = ["1", "2", "3", "4+"];

  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        {/* Quick search bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter area, university, or landmark..."
              className="pl-12 h-12 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="h-12 px-8 bg-gradient-primary hover:opacity-90" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <Card className="mt-6 p-6 shadow-medium">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Budget Range */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" />
                  Budget Range
                </label>
                <div className="space-y-3">
                  <Slider
                    value={budget}
                    onValueChange={handleBudgetChange}
                    max={15000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R500</span>
                    <span className="font-medium text-primary">R{budget[0]}</span>
                    <span>R15,000+</span>
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <Home className="w-4 h-4 mr-2 text-primary" />
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={selectedType === type.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTypeChange(type.id)}
                        className="justify-start"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Number of Rooms */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <Bed className="w-4 h-4 mr-2 text-primary" />
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  {roomOptions.map((room) => (
                    <Button
                      key={room}
                      variant={selectedRooms === room ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoomsChange(room)}
                      className="flex-1"
                    >
                      {room}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filters */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {budget[0] > 500 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Budget: R{budget[0]}
                  </Badge>
                )}
                {selectedType && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {propertyTypes.find(t => t.id === selectedType)?.label}
                  </Badge>
                )}
                {selectedRooms && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedRooms} Bedrooms
                  </Badge>
                )}
                {(budget[0] > 500 || selectedType || selectedRooms || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default SearchFilters;