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
import { useAuth } from "@/providers/BetterAuthProvider";
import { updateUserProfile } from "@/lib/supabase-simple";
import { useUserProfile, useUpdateUserProfile, useCreateUserProfile } from "@/hooks/useQueries";
import { useState, useEffect } from "react";

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
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch: refreshProfile } = useUserProfile(user?.id || '');
  const updateProfileMutation = useUpdateUserProfile();
  const createProfileMutation = useCreateUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || profile.name || '',
        bio: profile.bio || ''
      });
    } else if (user) {
      // Fallback to user data from auth
      setFormData({
        full_name: user.user_metadata?.full_name || user.email || '',
        bio: user.user_metadata?.bio || ''
      });
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      if (profile) {
        // Update existing profile
        await updateProfileMutation.mutateAsync({
          userId: user.id,
          updates: formData
        });
      } else {
        // Create new profile
        await createProfileMutation.mutateAsync({
          userId: user.id,
          userData: {
            email: user.email,
            full_name: formData.full_name,
            bio: formData.bio
          }
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="mb-4">Please sign in to view your profile.</div>
          </div>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="mb-4">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Profile Header */}
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary-foreground text-primary text-2xl">
                {(formData.full_name || user.email).split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-primary-foreground">
                  {formData.full_name || user.email}
                </h1>
                <Badge className="bg-success text-success-foreground">
                  <Shield size={12} className="mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-primary-foreground/90">{user.email}</p>
              <p className="text-primary-foreground/80 text-sm">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Status */}
        {!profile && !profileLoading && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Create Your Profile</p>
                <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                  Complete your profile information below to get the most out of FlatMate.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refreshProfile()}
                  className="border-blue-500 text-blue-600 hover:bg-blue-500/10"
                >
                  Refresh
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Create Profile
                </Button>
              </div>
            </div>
          </div>
        )}
        
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
                    <Input 
                      id="name" 
                      value={formData.full_name || profile?.full_name || ''}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user.email} disabled />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell others about yourself..."
                    value={formData.bio || profile?.bio || ''}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={handleSave}
                        className="bg-gradient-accent hover:opacity-90 transition-smooth"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-accent hover:opacity-90 transition-smooth"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
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