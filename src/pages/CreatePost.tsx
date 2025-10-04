import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { useCreateRoommatePost, useUploadRoommatePostPhotosTemporary } from "@/hooks/useQueries";
import { toast } from "sonner";

const CreatePost = () => {
  const { user } = useAuth();
  const createRoommatePost = useCreateRoommatePost();
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
    preferences: [] as string[]
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

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
        preferences: []
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
                        <SelectItem value="Clean">Clean</SelectItem>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
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
                <div>
                  <Label htmlFor="takeover-title">Post Title</Label>
                  <Input id="takeover-title" placeholder="e.g., Lease takeover available - Die Boord" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly-rent">Monthly Rent (R)</Label>
                    <Input id="monthly-rent" type="number" placeholder="3200" />
                  </div>
                  <div>
                    <Label htmlFor="takeover-location">Location</Label>
                    <Input id="takeover-location" placeholder="e.g., Die Boord, Universiteitsoord" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lease-start">Available From</Label>
                    <Input id="lease-start" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="lease-end">Lease Ends</Label>
                    <Input id="lease-end" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="takeover-reason">Reason for Takeover</Label>
                  <Select>
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
                  />
                </div>

                {/* Photos */}
                <div>
                  <Label>Photos of your place</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 10 photos)</p>
                    <Button variant="outline" className="mt-4">Choose Files</Button>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-gradient-accent hover:opacity-90 transition-smooth">
                  Post Lease Takeover
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatePost;