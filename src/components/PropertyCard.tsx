import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Star,
  Eye,
  MessageCircle 
} from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    maxOccupants: number;
    rating: number;
    images: string[];
    isVerified: boolean;
    availableFrom: string;
    description: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Image carousel */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image navigation dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.isVerified && (
            <Badge className="bg-success text-success-foreground">
              Verified
            </Badge>
          )}
          <Badge variant="secondary" className="capitalize">
            {property.type}
          </Badge>
        </div>

        {/* Like button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            }`} 
          />
        </Button>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1 border border-border">
            <span className="font-bold text-foreground">R{property.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and rating */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-foreground leading-tight flex-1 mr-2">
            {property.title}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Property details */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{property.maxOccupants} max</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.description}
        </p>

        {/* Available date */}
        <div className="text-xs text-success">
          Available from {property.availableFrom}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button className="flex-1 bg-gradient-accent hover:opacity-90" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;