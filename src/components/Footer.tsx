import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FM</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">FlatMate</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting Stellenbosch students with their perfect accommodation. 
              Making student housing search simple, safe, and social.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Search Properties</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Post a Listing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Find Roommates</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Lease Takeovers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Report Issue</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Stay Updated</h4>
            <p className="text-muted-foreground text-sm">
              Get notified about new listings and roommate matches.
            </p>
            <div className="space-y-2">
              <Input placeholder="Enter your email" className="bg-background" />
              <Button className="w-full bg-gradient-accent hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Stellenbosch, Western Cape</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>hello@flatmate.co.za</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-1 text-red-500" />
            <span>for Stellenbosch students</span>
          </div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © 2024 FlatMate. All rights reserved. Proudly serving Stellenbosch University students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;