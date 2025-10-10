import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Home, Flame, Check } from "lucide-react";
import type { SwipePost } from "@/data/mockSwipePosts";

interface SwipeCardProps {
  post: SwipePost;
  style?: React.CSSProperties;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  isTop?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ 
  post, 
  style, 
  isTop = false 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageNav = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation();
    if (direction === 'next' && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className="absolute w-full h-full bg-card rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={style}
    >
      {/* Image Carousel */}
      <div className="relative h-72 bg-muted">
        <img 
          src={post.images[currentImageIndex]} 
          alt={post.propertyType}
          className="w-full h-full object-cover"
          draggable="false"
        />
        
        {/* Image Navigation Overlay */}
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1 cursor-pointer"
            onClick={(e) => handleImageNav(e, 'prev')}
          />
          <div 
            className="flex-1 cursor-pointer"
            onClick={(e) => handleImageNav(e, 'next')}
          />
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {post.images.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hot Property Badge */}
        {post.isHotProperty && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white gap-1 shadow-lg">
              <Flame size={14} className="fill-white" />
              {post.interestedCount} interested
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content - Scrollable */}
      <div className="h-[calc(100%-18rem)] overflow-y-auto p-5 space-y-4">
        {/* Match Percentage */}
        <div className="space-y-1">
          <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400 text-base px-3 py-1">
            📊 {post.matchPercentage}% Match
          </Badge>
          <p className="text-sm text-muted-foreground pl-1">
            ↳ {post.matchReason}
          </p>
        </div>

        {/* Property Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground">
            <Home size={16} className="text-primary" />
            <span className="font-semibold">
              {post.propertyType} • R{post.price.toLocaleString()}/month
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span>{post.location} • {post.distance}km away</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-primary" />
            <span>Available {formatDate(post.availableDate)}</span>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Looking for:</p>
          <div className="space-y-1.5">
            {post.preferences.map((pref, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>{pref}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Poster Profile */}
        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 border-2 border-primary">
              <AvatarImage src={post.poster.profileImage} alt={post.poster.name} />
              <AvatarFallback>{post.poster.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                {post.poster.name}, {post.poster.age}
              </p>
              <p className="text-sm text-muted-foreground">{post.poster.program}</p>
              <p className="text-sm text-muted-foreground italic truncate">
                "{post.poster.bio}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;

