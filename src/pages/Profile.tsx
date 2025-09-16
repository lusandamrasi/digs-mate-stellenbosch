import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Home, Users, Settings, Bell, Shield, LogOut, MapPin, Calendar } from "lucide-react";

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@student.sun.ac.za",
  phone: "+27 82 123 4567",
  bio: "3rd year BCom student at Stellenbosch University. Love studying in quiet environments and enjoy weekend braais with friends.",
  verified: true,
  joinDate: "September 2023"
};

// Mock user listings
const userListings = [
  {
    id: "1",
    type: "property",
    title: "Modern 2-bedroom apartment",
    price: "R4,500/month",
    location: "Stellenbosch Central",
    status: "active",
    views: 45,
    inquiries: 8,
    postedDate: "2024-01-15"
  },
  {
    id: "2", 
    type: "roommate",
    title: "Looking for 1 roommate - Dalsig",
    price: "R2,500/month", 
    location: "Dalsig",
    status: "active",
    views: 23,
    inquiries: 3,
    postedDate: "2024-01-10"
  }
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Profile Header */}
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary-foreground text-primary text-2xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-primary-foreground">
                  {userData.name}
                </h1>
                {userData.verified && (
                  <Badge className="bg-success text-success-foreground">
                    <Shield size={12} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-primary-foreground/90">{userData.email}</p>
              <p className="text-primary-foreground/80 text-sm">
                Member since {userData.joinDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Edit2 size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Home size={16} />
              Listings
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Users size={16} />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={userData.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={userData.email} disabled />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={userData.phone} />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell others about yourself..."
                    defaultValue={userData.bio}
                    rows={4}
                  />
                </div>

                <Button className="bg-gradient-accent hover:opacity-90 transition-smooth">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Listings</h2>
                <Button size="sm" className="bg-gradient-accent hover:opacity-90 transition-smooth">
                  Create New Listing
                </Button>
              </div>

              {userListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{listing.title}</h3>
                          <Badge 
                            variant={listing.type === 'property' ? 'default' : 'secondary'}
                          >
                            {listing.type === 'property' ? 'Property' : 'Roommate'}
                          </Badge>
                          <Badge 
                            variant={listing.status === 'active' ? 'default' : 'secondary'}
                          >
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {listing.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Posted {listing.postedDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{listing.price}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {listing.views} views
                        </span>
                        <span className="text-muted-foreground">
                          {listing.inquiries} inquiries
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Roommate Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget-min">Budget Range (Monthly)</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="budget-min" placeholder="Min" />
                      <span className="text-muted-foreground">to</span>
                      <Input placeholder="Max" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="preferred-areas">Preferred Areas</Label>
                    <Input id="preferred-areas" placeholder="e.g., Stellenbosch Central, Dalsig" />
                  </div>
                </div>

                <div>
                  <Label>Lifestyle Preferences</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="non-smoker">Non-smoker</Label>
                      <Switch id="non-smoker" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quiet-hours">Quiet study hours</Label>
                      <Switch id="quiet-hours" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pets">Pet-friendly</Label>
                      <Switch id="pets" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="social">Social person</Label>
                      <Switch id="social" />
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-accent hover:opacity-90 transition-smooth">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New property matches</Label>
                      <p className="text-sm text-muted-foreground">Get notified when properties match your preferences</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New messages</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications for new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Roommate requests</Label>
                      <p className="text-sm text-muted-foreground">Get notified about new roommate posts</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Account */}
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;