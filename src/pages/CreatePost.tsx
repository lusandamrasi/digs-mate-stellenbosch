import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw, Upload, Clock } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { useCreateRoommatePost, useUploadRoommatePostPhotosTemporary, useCreateLeaseTakeoverPost } from "@/hooks/useQueries";
import { toast } from "sonner";

const CreatePost = () => {
  const { user } = useAuth();
  const createRoommatePost = useCreateRoommatePost();
  const createLeaseTakeoverPost = useCreateLeaseTakeoverPost();
  const uploadPhotos = useUploadRoommatePostPhotosTemporary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for roommate post
  const [roommateForm, setRoommateForm] = useState({
    title: '',
    price_per_person: '',
    location: '',
    current_roommates: '',
    roommates_needed: '',
    description: '',
    preferences: [] as string[],
    lifestyle_preferences: {
      study_habits: '',
      cleanliness: '',
      social_level: '',
      sleep_schedule: '',
      guests: '',
      smoking: '',
      pets: ''
    }
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Form state for lease takeover post
  const [takeoverForm, setTakeoverForm] = useState({
    title: '',
    monthly_rent: '',
    location: '',
    available_from: '',
    lease_ends: '',
    takeover_reason: '',
    description: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
      }
      
      return isValidType && isValidSize;
    });

    // Create preview URLs for the new files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
    setImagePreview(prev => [...prev, ...newPreviews].slice(0, 10)); // Max 10 previews
  };

  const removeFile = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    if (imagePreview[index]) {
      URL.revokeObjectURL(imagePreview[index]);
    }
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleRoommateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to create a post');
      return;
    }

    if (!roommateForm.title || !roommateForm.roommates_needed) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    toast.loading('Processing your post...', { id: 'creating-post' });

    try {
      // Upload photos first if any were selected
      let photoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        toast.loading('Uploading photos...', { id: 'uploading-photos' });
        photoUrls = await uploadPhotos.mutateAsync({
          userId: user.id,
          files: selectedFiles
        });
        toast.dismiss('uploading-photos');
      }

      // Create the post with photo URLs already included
      await createRoommatePost.mutateAsync({
        user_id: user.id,
        title: roommateForm.title,
        price_per_person: roommateForm.price_per_person ? parseFloat(roommateForm.price_per_person) : null,
        location: roommateForm.location ? { name: roommateForm.location } : null,
        description: roommateForm.description || null,
        roommates_needed: parseInt(roommateForm.roommates_needed),
        current_roommates: parseInt(roommateForm.current_roommates || '0') + 1, // +1 for the person posting
        post_type: 'roommate_needed',
        photos: photoUrls,
        active: true
      });

      toast.success('Roommate post uploaded successfully!', { id: 'creating-post' });
      toast.dismiss('uploading-photos');
      
      // Reset form
      setRoommateForm({
        title: '',
        price_per_person: '',
        location: '',
        current_roommates: '',
        roommates_needed: '',
        description: '',
        preferences: [],
        lifestyle_preferences: {
          study_habits: '',
          cleanliness: '',
          social_level: '',
          sleep_schedule: '',
          guests: '',
          smoking: '',
          pets: ''
        }
      });
      // Clean up image previews
      imagePreview.forEach(url => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setImagePreview([]);
    } catch (error) {
      console.error('Error creating roommate post:', error);
      toast.error('Failed to create roommate post. Please try again.', { id: 'creating-post' });
      toast.dismiss('uploading-photos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakeoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to create a post');
      return;
    }

    if (!takeoverForm.title || !takeoverForm.monthly_rent) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    toast.loading('Processing your post...', { id: 'creating-takeover-post' });

    try {
      // Upload photos first if any were selected
      let photoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        toast.loading('Uploading photos...', { id: 'uploading-takeover-photos' });
        photoUrls = await uploadPhotos.mutateAsync({
          userId: user.id,
          files: selectedFiles
        });
        toast.dismiss('uploading-takeover-photos');
      }

      // Create the lease takeover post with photo URLs already included
      await createLeaseTakeoverPost.mutateAsync({
        user_id: user.id,
        title: takeoverForm.title,
        monthly_rent: parseFloat(takeoverForm.monthly_rent),
        location: takeoverForm.location ? { name: takeoverForm.location } : null,
        description: takeoverForm.description || null,
        available_from: takeoverForm.available_from || null,
        lease_ends: takeoverForm.lease_ends || null,
        takeover_reason: takeoverForm.takeover_reason as any || null,
        photos: photoUrls,
        active: true
      });

      toast.success('Lease takeover post uploaded successfully!', { id: 'creating-takeover-post' });
      toast.dismiss('uploading-takeover-photos');
      
      // Reset form
      setTakeoverForm({
        title: '',
        monthly_rent: '',
        location: '',
        available_from: '',
        lease_ends: '',
        takeover_reason: '',
        description: ''
      });
      
      // Clean up image previews
      imagePreview.forEach(url => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setImagePreview([]);
    } catch (error) {
      console.error('Error creating lease takeover post:', error);
      toast.error('Failed to create lease takeover post. Please try again.', { id: 'creating-takeover-post' });
      toast.dismiss('uploading-takeover-photos');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePreference = (preference: string) => {
    setRoommateForm(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Create Post
          </h1>
          <p className="text-primary-foreground/90">
            Find roommates or post lease takeovers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="roommate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="roommate" className="flex items-center gap-2">
              <Users size={16} />
              Find Roommates
            </TabsTrigger>
            <TabsTrigger value="takeover" className="flex items-center gap-2">
              <RefreshCw size={16} />
              Lease Takeover
            </TabsTrigger>
          </TabsList>


          {/* Roommate Finder */}
          <TabsContent value="roommate">
            <Card>
              <CardHeader>
                <CardTitle>Find Roommates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleRoommateSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="roommate-title">Post Title *</Label>
                    <Input 
                      id="roommate-title" 
                      placeholder="e.g., Looking for 2 roommates in Dalsig"
                      value={roommateForm.title}
                      onChange={(e) => setRoommateForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget-per-person">Budget per Person (R)</Label>
                      <Input 
                        id="budget-per-person" 
                        type="number" 
                        placeholder="2500"
                        step="1000"
                        min="0"
                        value={roommateForm.price_per_person}
                        onChange={(e) => setRoommateForm(prev => ({ ...prev, price_per_person: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Increments of R1000</p>
                    </div>
                    <div>
                      <Label htmlFor="location-roommate">Location</Label>
                      <Input 
                        id="location-roommate" 
                        placeholder="e.g., Dalsig, Die Boord"
                        value={roommateForm.location}
                        onChange={(e) => setRoommateForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-roommates">Other Roommates Already There</Label>
                      <Select 
                        value={roommateForm.current_roommates}
                        onValueChange={(value) => setRoommateForm(prev => ({ ...prev, current_roommates: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="How many others are there?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Just me (no others)</SelectItem>
                          <SelectItem value="1">1 other person</SelectItem>
                          <SelectItem value="2">2 other people</SelectItem>
                          <SelectItem value="3">3+ other people</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        This is how many other people are already living there
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="looking-for">How Many More Roommates Needed *</Label>
                      <Select 
                        value={roommateForm.roommates_needed}
                        onValueChange={(value) => setRoommateForm(prev => ({ ...prev, roommates_needed: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="How many more do you need?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 more roommate</SelectItem>
                          <SelectItem value="2">2 more roommates</SelectItem>
                          <SelectItem value="3">3 more roommates</SelectItem>
                          <SelectItem value="4">4+ more roommates</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        How many additional roommates you're looking for
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Preferences</Label>
                    <Select onValueChange={(value) => {
                      if (value && !roommateForm.preferences.includes(value)) {
                        setRoommateForm(prev => ({
                          ...prev,
                          preferences: [...prev.preferences, value]
                        }));
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Quiet hours">Quiet hours</SelectItem>
                        <SelectItem value="Female only">Female only</SelectItem>
                        <SelectItem value="Male only">Male only</SelectItem>
                        <SelectItem value="Study-focused">Study-focused</SelectItem>
                        <SelectItem value="Pet-friendly">Pet-friendly</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        
                      </SelectContent>
                    </Select>
                    {roommateForm.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {roommateForm.preferences.map((pref) => (
                          <Badge 
                            key={pref}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => togglePreference(pref)}
                          >
                            {pref} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lifestyle Compatibility Preferences */}
                  <div>
                    <Label className="text-base font-semibold">Lifestyle Compatibility</Label>
                    <p className="text-sm text-muted-foreground mb-4">Help potential roommates find the best match</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="study-habits">Study Habits</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.study_habits}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, study_habits: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select study habits" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quiet-focus">Quiet study environment</SelectItem>
                            <SelectItem value="social-study">Social studying (study groups)</SelectItem>
                            <SelectItem value="flexible">Flexible (both quiet and social)</SelectItem>
                            <SelectItem value="library-focused">Library-focused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cleanliness">Cleanliness Level</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.cleanliness}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, cleanliness: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select cleanliness preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="very-clean">Very clean & organized</SelectItem>
                            <SelectItem value="moderately-clean">Moderately clean</SelectItem>
                            <SelectItem value="relaxed">Relaxed about mess</SelectItem>
                            <SelectItem value="shared-chores">Shared cleaning responsibilities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="social-level">Social Level</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.social_level}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, social_level: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select social preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="very-social">Very social (parties, events)</SelectItem>
                            <SelectItem value="moderately-social">Moderately social</SelectItem>
                            <SelectItem value="quiet">Quiet & private</SelectItem>
                            <SelectItem value="flexible-social">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="sleep-schedule">Sleep Schedule</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.sleep_schedule}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, sleep_schedule: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sleep preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="early-bird">Early bird (early to bed/rise)</SelectItem>
                            <SelectItem value="night-owl">Night owl (late to bed/rise)</SelectItem>
                            <SelectItem value="flexible">Flexible schedule</SelectItem>
                            <SelectItem value="respectful">Respectful of others' schedules</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="guests">Guest Policy</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.guests}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, guests: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select guest preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="frequent-guests">Frequent guests welcome</SelectItem>
                            <SelectItem value="occasional-guests">Occasional guests OK</SelectItem>
                            <SelectItem value="rare-guests">Rare guests only</SelectItem>
                            <SelectItem value="no-guests">No overnight guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="smoking">Smoking Policy</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.smoking}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, smoking: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select smoking preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non-smoker">Non-smoker (strict)</SelectItem>
                            <SelectItem value="outdoor-smoking">Outdoor smoking OK</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                            <SelectItem value="smoker-friendly">Smoker-friendly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="pets">Pet Policy</Label>
                        <Select 
                          value={roommateForm.lifestyle_preferences.pets}
                          onValueChange={(value) => setRoommateForm(prev => ({
                            ...prev,
                            lifestyle_preferences: { ...prev.lifestyle_preferences, pets: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-pets">No pets</SelectItem>
                            <SelectItem value="small-pets">Small pets OK</SelectItem>
                            <SelectItem value="pet-friendly">Pet-friendly</SelectItem>
                            <SelectItem value="has-pets">I have pets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="roommate-description">Description</Label>
                    <Textarea 
                      id="roommate-description" 
                      placeholder="Tell potential roommates about yourself, your lifestyle, and what you're looking for..."
                      rows={4}
                      value={roommateForm.description}
                      onChange={(e) => setRoommateForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <Label>Photos of your place</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">Click to upload photos</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 10 photos)</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    {imagePreview.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Image previews:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {selectedFiles[index]?.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full bg-blue-800 hover:opacity-90 transition-smooth"
                    disabled={isUploading || createRoommatePost.isPending}
                  >
                    {isUploading ? 'Uploading...' : createRoommatePost.isPending ? 'Creating Post...' : 'Post Roommate Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lease Takeover */}
          <TabsContent value="takeover">
            <Card>
              <CardHeader>
                <CardTitle>Lease Takeover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleTakeoverSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="takeover-title">Post Title *</Label>
                    <Input 
                      id="takeover-title" 
                      placeholder="e.g., Lease takeover available - Die Boord"
                      value={takeoverForm.title}
                      onChange={(e) => setTakeoverForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthly-rent">Monthly Rent (R) *</Label>
                      <Input 
                        id="monthly-rent" 
                        type="number" 
                        placeholder="3200"
                        value={takeoverForm.monthly_rent}
                        onChange={(e) => setTakeoverForm(prev => ({ ...prev, monthly_rent: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="takeover-location">Location</Label>
                      <Input 
                        id="takeover-location" 
                        placeholder="e.g., Die Boord, Universiteitsoord"
                        value={takeoverForm.location}
                        onChange={(e) => setTakeoverForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lease-start">Available From *</Label>
                      <Input 
                        id="lease-start" 
                        type="date" 
                        value={takeoverForm.available_from}
                        onChange={(e) => setTakeoverForm(prev => ({ ...prev, available_from: e.target.value }))}
                        required
                      />
                      {takeoverForm.available_from && (
                        <div className="mt-2">
                          {(() => {
                            const availableDate = new Date(takeoverForm.available_from);
                            const today = new Date();
                            const daysUntilAvailable = Math.ceil((availableDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            
                            if (daysUntilAvailable < 0) {
                              return (
                                <Badge variant="destructive" className="text-xs">
                                  <Clock size={12} className="mr-1" />
                                  Already Available
                                </Badge>
                              );
                            } else if (daysUntilAvailable <= 7) {
                              return (
                                <Badge variant="destructive" className="text-xs">
                                  <Clock size={12} className="mr-1" />
                                  Urgent - {daysUntilAvailable} days
                                </Badge>
                              );
                            } else if (daysUntilAvailable <= 30) {
                              return (
                                <Badge variant="secondary" className="text-xs">
                                  <Clock size={12} className="mr-1" />
                                  Soon - {daysUntilAvailable} days
                                </Badge>
                              );
                            } else {
                              return (
                                <Badge variant="outline" className="text-xs">
                                  <Clock size={12} className="mr-1" />
                                  {daysUntilAvailable} days away
                                </Badge>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lease-end">Lease Ends</Label>
                      <Input 
                        id="lease-end" 
                        type="date"
                        value={takeoverForm.lease_ends}
                        onChange={(e) => setTakeoverForm(prev => ({ ...prev, lease_ends: e.target.value }))}
                      />
                      {takeoverForm.lease_ends && takeoverForm.available_from && (
                        <div className="mt-2">
                          {(() => {
                            const availableDate = new Date(takeoverForm.available_from);
                            const endDate = new Date(takeoverForm.lease_ends);
                            const leaseDuration = Math.ceil((endDate.getTime() - availableDate.getTime()) / (1000 * 60 * 60 * 24 * 30)); // months
                            
                            return (
                              <Badge variant="outline" className="text-xs">
                                {leaseDuration} month lease
                              </Badge>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="takeover-reason">Reason for Takeover</Label>
                    <Select 
                      value={takeoverForm.takeover_reason}
                      onValueChange={(value) => setTakeoverForm(prev => ({ ...prev, takeover_reason: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Why are you leaving?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abroad">Studying abroad</SelectItem>
                        <SelectItem value="graduation">Graduating</SelectItem>
                        <SelectItem value="moving">Moving cities</SelectItem>
                        <SelectItem value="financial">Financial reasons</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="takeover-description">Description</Label>
                    <Textarea 
                      id="takeover-description" 
                      placeholder="Describe the place, why you're leaving, what's included, and any important details..."
                      rows={4}
                      value={takeoverForm.description}
                      onChange={(e) => setTakeoverForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <Label>Photos of your place</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">Click to upload photos</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 10 photos)</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    {imagePreview.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Image previews:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {selectedFiles[index]?.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-blue-800 hover:opacity-90 transition-smooth"
                    disabled={isUploading || createLeaseTakeoverPost.isPending}
                  >
                    {isUploading || createLeaseTakeoverPost.isPending ? 'Creating Post...' : 'Post Lease Takeover'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatePost;