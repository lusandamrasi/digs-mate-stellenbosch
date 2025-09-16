import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, Plus, Heart, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FM</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">FlatMate</h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Stellenbosch
            </Badge>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for accommodation..."
                className="pl-10 bg-secondary/50 border-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Button className="bg-gradient-accent hover:opacity-90 transition-smooth">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Post Listing</span>
              <span className="sm:hidden">Post</span>
            </Button>
            <Button variant="outline" size="icon">
              <User className="w-4 h-4" />
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for accommodation..."
              className="pl-10 bg-secondary/50 border-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;