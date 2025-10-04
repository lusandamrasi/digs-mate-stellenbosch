import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Users, Settings, Bell, Shield, LogOut, Bookmark } from "lucide-react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { updateUserProfile } from "@/lib/supabase-simple";
import { useUserProfile, useUpdateUserProfile, useCreateUserProfile, useUploadProfilePhoto, useCheckUsernameAvailable } from "@/hooks/useQueries";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import SavedModal from "@/components/SavedModal";


// User listings will be fetched from the database

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch: refreshProfile } = useUserProfile(user?.id || '');
  const updateProfileMutation = useUpdateUserProfile();
  const createProfileMutation = useCreateUserProfile();
  const uploadPhotoMutation = useUploadProfilePhoto();
  const checkUsernameMutation = useCheckUsernameAvailable();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: ''
  });
  const [usernameError, setUsernameError] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || ''
      });
    } else if (user) {
      // Fallback to user data from auth
      setFormData({
        username: user.email?.split('@')[0] || '',
        full_name: user.user_metadata?.full_name || user.email || '',
        bio: user.user_metadata?.bio || ''
      });
    }
  }, [profile, user]);

  const validateUsername = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    setIsCheckingUsername(true);
    try {
      const isAvailable = await checkUsernameMutation.mutateAsync(username);
      if (!isAvailable) {
        setUsernameError('Username not available - try a new one!');
        return false;
      }
      setUsernameError('');
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    // Validate username if it has changed
    if (formData.username !== profile?.username) {
      const isUsernameValid = await validateUsername(formData.username);
      if (!isUsernameValid) {
        return;
      }
    }
    
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
            username: formData.username,
            full_name: formData.full_name,
            bio: formData.bio
          }
        });
      }
      setIsEditing(false);
      toast.success('Changes saved!', {
        description: 'Your profile has been updated successfully.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save changes', {
        description: 'Please try again.',
        duration: 3000,
      });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const photoUrl = await uploadPhotoMutation.mutateAsync({
        userId: user.id,
        file
      });

      // Update the profile with the new photo URL
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        updates: { profile_photo_url: photoUrl }
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
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
            <div className="relative">
              <Avatar className="w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                {profile?.profile_photo_url && (
                  <AvatarImage src={profile.profile_photo_url} alt="Profile photo" />
                )}
                <AvatarFallback className="bg-primary-foreground text-primary text-2xl">
                  {(formData.full_name || user.email).split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <Edit2 size={12} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-primary-foreground">
                  {formData.full_name || user.email}
                </h1>
                <Badge className={user?.email === 'lusandamrasi1@gmail.com' ? 'bg-[#D4AF37] text-black' : 'bg-success text-success-foreground'}>
                  <Shield size={12} className="mr-1" />
                  {user?.email === 'lusandamrasi1@gmail.com' ? 'Founder' : 'Verified'}
                </Badge>
              </div>
              <p className="text-primary-foreground/90">{user.email}</p>
              <p className="text-primary-foreground/80 text-sm font-bold">
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
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Users size={16} />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark size={16} />
              Saved
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
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {/* Photo Upload Section */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="w-16 h-16">
                    {profile?.profile_photo_url && (
                      <AvatarImage src={profile.profile_photo_url} alt="Profile photo" />
                    )}
                    <AvatarFallback className="bg-primary-foreground text-primary text-lg">
                      {(formData.full_name || user.email).split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a photo to personalize your profile
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadPhotoMutation.isPending}
                    >
                      {uploadPhotoMutation.isPending ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>
                
                {/* Username Field */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({...formData, username: e.target.value});
                      setUsernameError('');
                    }}
                    disabled={!isEditing || isCheckingUsername}
                    placeholder="Enter your username"
                    className={usernameError ? 'border-red-500' : ''}
                  />
                  {usernameError && (
                    <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                  )}
                  {isCheckingUsername && (
                    <p className="text-sm text-blue-500 mt-1">Checking availability...</p>
                  )}
                  {isEditing && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Username can only contain letters, numbers and underscores.
                    </p>
                  )}
                </div>

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
                        className="bg-primary hover:opacity-90 transition-smooth"
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
                      className="bg-primary hover:opacity-90 transition-smooth"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <SavedModal 
              trigger={
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No saved posts yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring and save roommate posts you're interested in.
                  </p>
                  <Button className="bg-primary hover:opacity-90">
                    Browse Posts
                  </Button>
                </div>
              }
            />
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
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={async () => {
                      try {
                        await signOut();
                        // The auth provider will handle the redirect
                      } catch (error) {
                        console.error('Error signing out:', error);
                      }
                    }}
                  >
                    <LogOut size={16} className=" mr-2" />
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