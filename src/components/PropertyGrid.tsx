import PropertyCard from "./PropertyCard";

// Mock data for demonstration
const mockProperties = [
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
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    availableFrom: "1 March 2024",
    description: "Beautiful modern apartment with all amenities included. Walking distance to university and shops."
  },
  {
    id: "2",
    title: "Cozy Single Room in Shared House",
    price: 2800,
    location: "Die Boord",
    type: "room",
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 1,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: false,
    availableFrom: "15 February 2024",
    description: "Perfect for students looking for affordable accommodation with great housemates."
  },
  {
    id: "3",
    title: "Spacious Student Digs with Garden",
    price: 6200,
    location: "Dalsig",
    type: "digs",
    bedrooms: 3,
    bathrooms: 2,
    maxOccupants: 3,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    availableFrom: "1 January 2024",
    description: "Large property with beautiful garden, perfect for students who want space and tranquility."
  },
  {
    id: "4",
    title: "Modern Flat Near University",
    price: 3900,
    location: "Universiteitsoord",
    type: "flat",
    bedrooms: 2,
    bathrooms: 1,
    maxOccupants: 2,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    availableFrom: "1 April 2024",
    description: "Convenient location with modern fixtures and fast WiFi. Great for serious students."
  },
  {
    id: "5",
    title: "Budget-Friendly Shared Accommodation",
    price: 2200,
    location: "Cloetesville",
    type: "room",
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 1,
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1505692952047-1a78307f4ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: false,
    availableFrom: "20 February 2024",
    description: "Affordable option for students on a tight budget. Clean, safe, and well-maintained."
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
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    availableFrom: "1 February 2024",
    description: "Premium accommodation with gym, pool, and study areas. All utilities included."
  }
];

const PropertyGrid = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Available Properties
            </h2>
            <p className="text-muted-foreground">
              {mockProperties.length} properties found in Stellenbosch
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="bg-background border border-border rounded-md px-3 py-1 text-sm">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Distance</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-8">
          <button className="bg-gradient-accent hover:opacity-90 transition-smooth text-accent-foreground px-8 py-3 rounded-lg font-medium">
            Load More Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;