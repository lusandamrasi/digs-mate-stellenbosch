import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Calendar, Users, MessageCircle, Heart, Trash2, Bookmark } from "lucide-react";

interface SavedItem {
  id: string;
  type: string;
  title: string;
  price?: number;
  budget?: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupants?: number;
  currentRoommates?: number;
  totalRoommates?: number;
  description: string;
  preferences?: string[];
  postedBy?: string;
  timePosted?: string;
  images?: string[];
  savedAt: string;
}

interface SavedModalProps {
  trigger: React.ReactNode;
}

const SavedModal = ({ trigger }: SavedModalProps) => {
  // Empty saved items - will be populated from database
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const handleRemoveSaved = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark size={20} />
            Saved Posts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {savedItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No saved posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring and save roommate posts you're interested in.
              </p>
              <Button className="bg-primary hover:opacity-90">
                Browse Posts
              </Button>
            </div>
          ) : (
            savedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    {item.images && item.images.length > 0 && (
                      <div className="md:w-1/3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className={`p-6 flex-1 ${!item.images || item.images.length === 0 ? 'w-full' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge 
                            variant={
                              item.type === 'lease-takeover' ? 'destructive' : 
                              item.type === 'roommate-post' ? 'secondary' : 'default'
                            }
                            className="mb-2"
                          >
                            {item.type === 'property' ? 'Property' :
                             item.type === 'roommate-post' ? 'Roommate Post' : 'Lease Takeover'}
                          </Badge>
                          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSaved(item.id)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {item.price ? `R${item.price.toLocaleString()}` : item.budget}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Available {item.availableFrom}
                        </div>
                        {item.type === 'property' && item.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {item.bedrooms} bed • {item.bathrooms} bath
                          </div>
                        )}
                        {item.type === 'roommate-post' && item.currentRoommates !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {item.currentRoommates}/{item.totalRoommates} roommates
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4">{item.description}</p>

                      {item.preferences && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.preferences.map((pref, index) => (
                            <Badge key={index} variant="outline">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Saved {item.savedAt}
                          {item.postedBy && ` • By ${item.postedBy}`}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="bg-primary hover:opacity-90">
                            <MessageCircle size={16} className="mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavedModal;
