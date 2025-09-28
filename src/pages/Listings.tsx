import { useState } from "react";
import Header from "@/components/Header";
import SearchFilters from "@/components/SearchFilters";
import PropertyGrid from "@/components/PropertyGrid";

const Listings = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    budget: [2000],
    selectedType: "",
    selectedRooms: ""
  });

  const handleFiltersChange = (newFilters: {
    searchTerm: string;
    budget: number[];
    selectedType: string;
    selectedRooms: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Find Your Perfect Place
          </h1>
          <p className="text-primary-foreground/90">
            Browse through hundreds of student accommodations in Stellenbosch
          </p>
        </div>
      </div>
      <SearchFilters onFiltersChange={handleFiltersChange} />
      <PropertyGrid filters={filters} />
    </div>
  );
};

export default Listings;