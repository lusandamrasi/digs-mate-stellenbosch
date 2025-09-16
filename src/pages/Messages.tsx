import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageCircle, Send } from "lucide-react";

// Mock conversations
const conversations = [
  {
    id: "1",
    name: "Sarah M.",
    lastMessage: "Hi! Is the room still available?",
    time: "2 min ago",
    unread: 2,
    listingTitle: "Modern Apartment - Stellenbosch Central",
    listingPrice: "R4,500/month"
  },
  {
    id: "2", 
    name: "James K.",
    lastMessage: "When can we schedule a viewing?",
    time: "1 hour ago",
    unread: 0,
    listingTitle: "Roommate needed - Dalsig",
    listingPrice: "R2,500/month"
  },
  {
    id: "3",
    name: "Emma L.",
    lastMessage: "Thanks for the info! The place looks perfect.",
    time: "Yesterday",
    unread: 0,
    listingTitle: "Lease Takeover - Die Boord", 
    listingPrice: "R3,200/month"
  },
  {
    id: "4",
    name: "David R.",
    lastMessage: "Can you tell me more about the area?",
    time: "2 days ago",
    unread: 1,
    listingTitle: "Student Digs - Universiteitsoord",
    listingPrice: "R3,900/month"
  }
];

const Messages = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Messages
          </h1>
          <p className="text-primary-foreground/90">
            Your conversations with potential roommates and landlords
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10"
          />
        </div>

        {/* Empty State or Conversations List */}
        {conversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground mb-6">
                Start browsing properties and connect with landlords or roommates
              </p>
              <Button className="bg-gradient-accent hover:opacity-90 transition-smooth">
                Browse Properties
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="cursor-pointer hover:bg-muted/50 transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.time}
                          </span>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="min-w-[20px] h-5 text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground truncate mr-2">
                          {conversation.listingTitle}
                        </span>
                        <span className="text-primary font-medium">
                          {conversation.listingPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chat Interface (when a conversation is selected) */}
        <div className="hidden">
          <Card className="mt-6">
            <CardContent className="p-0">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">Sarah M.</h3>
                    <p className="text-sm text-muted-foreground">Modern Apartment - Stellenbosch Central</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Received message */}
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Hi! Is the room still available?</p>
                      <span className="text-xs text-muted-foreground">2:30 PM</span>
                    </div>
                  </div>
                  
                  {/* Sent message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Yes, it's still available! Would you like to schedule a viewing?</p>
                      <span className="text-xs text-primary-foreground/70">2:32 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="icon" className="bg-gradient-accent hover:opacity-90 transition-smooth">
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;