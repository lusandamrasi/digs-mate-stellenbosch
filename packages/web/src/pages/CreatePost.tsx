import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Users, RefreshCw, Upload, Clock, Calendar as CalendarIcon, Home, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { useCreateRoommatePost, useUploadRoommatePostPhotosTemporary, useCreateLeaseTakeoverPost } from "shared/hooks/useQueries";
import { toast } from "sonner";
import Autocomplete from 'react-google-autocomplete';


const CreatePost = () => {
  const { user } = useAuth();
  const createRoommatePost = useCreateRoommatePost();
  const createLeaseTakeoverPost = useCreateLeaseTakeoverPost();
  const uploadPhotos = useUploadRoommatePostPhotosTemporary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Form state for roommate post
  const [roommateForm, setRoommateForm] = useState({
    title: '',
    price_per_person: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    placeId: '',
    listing_capacity: '',
    roommates_needed: '',
    accommodation_type: '',
    accommodation_type_other: '',
    description: '',
    preferences: [] as string[]
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Form state for lease takeover post
  const [takeoverForm, setTakeoverForm] = useState({
    title: '',
    monthly_rent: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    placeId: '',
    listing_capacity: '',
    accommodation_type: '',
    accommodation_type_other: '',
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

    if (!roommateForm.title || !roommateForm.roommates_needed || !roommateForm.listing_capacity) {
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
        location: roommateForm.location ? { 
          name: roommateForm.location,
          latitude: roommateForm.latitude,
          longitude: roommateForm.longitude,
          place_id: roommateForm.placeId
        } : null,
        description: roommateForm.description || null,
        roommates_needed: parseInt(roommateForm.roommates_needed),
        listing_capacity: parseInt(roommateForm.listing_capacity),
        accommodation_type: roommateForm.accommodation_type === 'other' ? roommateForm.accommodation_type_other : roommateForm.accommodation_type,
        preferences: roommateForm.preferences,
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
        latitude: null,
        longitude: null,
        placeId: '',
        listing_capacity: '',
        roommates_needed: '',
        accommodation_type: '',
        accommodation_type_other: '',
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
        location: takeoverForm.location ? { 
          name: takeoverForm.location,
          latitude: takeoverForm.latitude,
          longitude: takeoverForm.longitude,
          place_id: takeoverForm.placeId
        } : null,
        description: takeoverForm.description || null,
        listing_capacity: takeoverForm.listing_capacity ? parseInt(takeoverForm.listing_capacity) : null,
        accommodation_type: takeoverForm.accommodation_type === 'other' ? takeoverForm.accommodation_type_other : takeoverForm.accommodation_type,
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
        latitude: null,
        longitude: null,
        placeId: '',
        listing_capacity: '',
        accommodation_type: '',
        accommodation_type_other: '',
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

                <div>
                  <Label htmlFor="accommodation-type">Type of Accommodation *</Label>
                  <Select 
                    value={roommateForm.accommodation_type}
                    onValueChange={(value) => setRoommateForm(prev => ({ ...prev, accommodation_type: value, accommodation_type_other: value === 'other' ? prev.accommodation_type_other : '' }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="digs">Digs</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {roommateForm.accommodation_type === 'other' && (
                    <div className="mt-2">
                      <Label htmlFor="accommodation-type-other">Please specify *</Label>
                      <Input 
                        id="accommodation-type-other"
                        placeholder="e.g., House, Cottage, etc."
                        value={roommateForm.accommodation_type_other}
                        onChange={(e) => setRoommateForm(prev => ({ ...prev, accommodation_type_other: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget-per-person">Estimated budget per Person (R)</Label>
                      <Input 
                        id="budget-per-person" 
                        type="number" 
                        placeholder="2500"
                        step="1000"
                        min="0"
                        value={roommateForm.price_per_person}
                        onChange={(e) => setRoommateForm(prev => ({ ...prev, price_per_person: e.target.value }))}
                      />
                  </div>
                  <div>
                    <Label htmlFor="location-roommate">Location</Label>
                      <Autocomplete
                        id="location-roommate"
                        apiKey={GOOGLE_MAPS_KEY}
                        onPlaceSelected={(place) => {
                          if (!place.formatted_address) return;
                          
                          setRoommateForm(prev => ({ 
                            ...prev, 
                            location: place.formatted_address,
                            latitude: place.geometry?.location?.lat() || null,
                            longitude: place.geometry?.location?.lng() || null,
                            placeId: place.place_id || '',
                          }));
                        }}
                        options={{
                          types: ['address'],
                          componentRestrictions: { country: 'za' },
                          fields: ['formatted_address', 'geometry', 'place_id'],
                        }}
                        value={roommateForm.location}
                        placeholder="Start typing your address..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setRoommateForm(prev => ({ ...prev, location: e.target.value }));
                        }}
                      />
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="listing-capacity">Listing Capacity *</Label>
                      <Input 
                        id="listing-capacity"
                        type="number" 
                        placeholder="2"
                        step="1"
                        min="2"
                        max="10"
                        value={roommateForm.listing_capacity}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
                          setRoommateForm(prev => ({ ...prev, listing_capacity: value }));
                        }}
                        onKeyDown={(e) => {
                          // Prevent non-digit characters
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Total number of people the place can accommodate
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="looking-for">Roommates Needed *</Label>
                      <Input 
                        id="looking-for"
                        type="number" 
                        placeholder="1"
                        step="1"
                        min="1"
                        max="10"
                        value={roommateForm.roommates_needed}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
                          setRoommateForm(prev => ({ ...prev, roommates_needed: value }));
                        }}
                        onKeyDown={(e) => {
                          // Prevent non-digit characters
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This is how many additional roommates you're looking for
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Preferences</Label>
                    <Select onValueChange={(value) => {
                      if (value) {
                        if (value === 'None') {
                          // If "None" is selected, clear all other preferences and set only "None"
                          setRoommateForm(prev => ({
                            ...prev,
                            preferences: ['None']
                          }));
                        } else if (!roommateForm.preferences.includes(value) && !roommateForm.preferences.includes('None')) {
                          // Add preference only if "None" is not selected
                          setRoommateForm(prev => ({
                            ...prev,
                            preferences: [...prev.preferences, value]
                          }));
                        }
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const hasNone = roommateForm.preferences.includes('None');
                          const hasOtherPreferences = roommateForm.preferences.filter(p => p !== 'None').length > 0;
                          const allPreferences = ['None', 'Non-smoker', 'Student', 'Female only', 'Male only', 'Study-focused', 'Pet-friendly', 'Social'];
                          
                          // If "None" is selected, only show "None"
                          // If other preferences are selected, disable "None"
                          const filteredPreferences = hasNone 
                            ? ['None'] 
                            : allPreferences;
                          
                          return filteredPreferences.map((pref) => {
                            const isSelected = roommateForm.preferences.includes(pref);
                            const isNone = pref === 'None';
                            const shouldDisable = isSelected || (isNone && hasOtherPreferences);
                            
                            return (
                              <SelectItem 
                                key={pref}
                                value={pref}
                                disabled={shouldDisable}
                                className={`${shouldDisable ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>{pref}</span>
                                  {isSelected && <Check size={16} className="ml-2 text-primary opacity-100" />}
                                </div>
                              </SelectItem>
                            );
                          });
                        })()}
                      </SelectContent>
                    </Select>
                    {roommateForm.preferences.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                        {roommateForm.preferences.map((pref) => (
                          <Badge 
                            key={pref}
                            variant="secondary"
                            className="cursor-pointer bg-muted hover:bg-muted/80 flex items-center gap-1"
                            onClick={() => togglePreference(pref)}
                          >
                            {pref}
                            <X size={14} className="ml-1" />
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

                <div>
                    <Label htmlFor="takeover-accommodation-type">Type of Accommodation *</Label>
                    <Select 
                      value={takeoverForm.accommodation_type}
                      onValueChange={(value) => setTakeoverForm(prev => ({ ...prev, accommodation_type: value, accommodation_type_other: value === 'other' ? prev.accommodation_type_other : '' }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accommodation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="digs">Digs</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {takeoverForm.accommodation_type === 'other' && (
                      <div className="mt-2">
                        <Label htmlFor="takeover-accommodation-type-other">Please specify *</Label>
                        <Input 
                          id="takeover-accommodation-type-other"
                          placeholder="e.g., House, Cottage, etc."
                          value={takeoverForm.accommodation_type_other}
                          onChange={(e) => setTakeoverForm(prev => ({ ...prev, accommodation_type_other: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="monthly-rent">Monthly Rent (R) *</Label>
                      <Input 
                        id="monthly-rent" 
                        type="number" 
                        placeholder="3200"
                        step="1000"
                        value={takeoverForm.monthly_rent}
                        onChange={(e) => setTakeoverForm(prev => ({ ...prev, monthly_rent: e.target.value }))}
                        required
                      />
                  </div>
                  <div>
                    <Label htmlFor="takeover-location">Location</Label>
                      <Autocomplete
                        id="takeover-location"
                        apiKey={GOOGLE_MAPS_KEY}
                        onPlaceSelected={(place) => {
                          if (!place.formatted_address) return;
                          
                          setTakeoverForm(prev => ({ 
                            ...prev, 
                            location: place.formatted_address,
                            latitude: place.geometry?.location?.lat() || null,
                            longitude: place.geometry?.location?.lng() || null,
                            placeId: place.place_id || '',
                          }));
                        }}
                        options={{
                          types: ['address'],
                          componentRestrictions: { country: 'za' },
                          fields: ['formatted_address', 'geometry', 'place_id'],
                        }}
                        value={takeoverForm.location}
                        placeholder="Start typing your address..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setTakeoverForm(prev => ({ ...prev, location: e.target.value }));
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="takeover-listing-capacity">Listing Capacity</Label>
                    <Input 
                      id="takeover-listing-capacity"
                      type="number" 
                      placeholder="2"
                      step="1"
                      min="2"
                      max="10"
                      value={takeoverForm.listing_capacity}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
                        setTakeoverForm(prev => ({ ...prev, listing_capacity: value }));
                      }}
                      onKeyDown={(e) => {
                        // Prevent non-digit characters
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total number of people the place can accommodate
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="lease-start">Available From *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!takeoverForm.available_from ? 'text-muted-foreground' : ''}`}
                            id="lease-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {takeoverForm.available_from ? (
                              format(new Date(takeoverForm.available_from), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={takeoverForm.available_from ? new Date(takeoverForm.available_from) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const selectedDate = format(date, 'yyyy-MM-dd');
                                const selectedDateObj = new Date(selectedDate);
                                
                                // Check if lease_ends is already selected and if this date is after it
                                if (takeoverForm.lease_ends) {
                                  const leaseEndsDate = new Date(takeoverForm.lease_ends);
                                  if (selectedDateObj > leaseEndsDate) {
                                    toast.error('Available From date must be before Lease Ends date');
                                    return;
                                  }
                                }
                                
                                setTakeoverForm(prev => ({ 
                                  ...prev, 
                                  available_from: selectedDate
                                }));
                              }
                            }}
                            disabled={(date) => {
                              // Disable dates after lease_ends if it's already selected
                              if (takeoverForm.lease_ends) {
                                const leaseEndsDate = new Date(takeoverForm.lease_ends);
                                return date > leaseEndsDate;
                              }
                              return false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {takeoverForm.available_from && (
                        <div className="mt-2">
                          {(() => {
                            const availableDate = new Date(takeoverForm.available_from);
                            const today = new Date();
                            const daysUntilAvailable = Math.ceil((availableDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            
                            // Check if available_from is after lease_ends (invalid)
                            if (takeoverForm.lease_ends) {
                              const leaseEndsDate = new Date(takeoverForm.lease_ends);
                              if (availableDate > leaseEndsDate) {
                                return (
                                  <p className="text-xs text-destructive">
                                    Available From must be before Lease Ends date
                                  </p>
                                );
                              }
                            }
                            
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!takeoverForm.lease_ends ? 'text-muted-foreground' : ''}`}
                            id="lease-end"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {takeoverForm.lease_ends ? (
                              format(new Date(takeoverForm.lease_ends), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={takeoverForm.lease_ends ? new Date(takeoverForm.lease_ends) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const selectedDate = format(date, 'yyyy-MM-dd');
                                const selectedDateObj = new Date(selectedDate);
                                
                                // Check if available_from is already selected and if this date is before it
                                if (takeoverForm.available_from) {
                                  const availableFromDate = new Date(takeoverForm.available_from);
                                  if (selectedDateObj < availableFromDate) {
                                    toast.error('Lease Ends date must be after Available From date');
                                    return;
                                  }
                                }
                                
                                setTakeoverForm(prev => ({ 
                                  ...prev, 
                                  lease_ends: selectedDate
                                }));
                              }
                            }}
                            disabled={(date) => {
                              // Disable dates before available_from if it's already selected
                              if (takeoverForm.available_from) {
                                const availableFromDate = new Date(takeoverForm.available_from);
                                return date < availableFromDate;
                              }
                              return false;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {takeoverForm.lease_ends && takeoverForm.available_from && (
                        <div className="mt-2">
                          {(() => {
                            const availableDate = new Date(takeoverForm.available_from);
                            const endDate = new Date(takeoverForm.lease_ends);
                            const leaseDuration = Math.ceil((endDate.getTime() - availableDate.getTime()) / (1000 * 60 * 60 * 24 * 30)); // months
                            
                            // Check if lease_ends is before available_from (invalid)
                            if (endDate < availableDate) {
                              return (
                                <p className="text-xs text-destructive">
                                  Lease Ends must be after Available From date
                                </p>
                              );
                            }
                            
                            // Show red text for 0 month lease
                            if (leaseDuration <= 0) {
                              return (
                                <Badge variant="destructive" className="text-xs">
                                  {leaseDuration} month lease - Please pick a date after Available From
                                </Badge>
                              );
                            }
                            
                            return (
                              <Badge variant="outline" className="text-xs">
                                {leaseDuration} month lease
                              </Badge>
                            );
                          })()}
                        </div>
                      )}
                      {takeoverForm.lease_ends && !takeoverForm.available_from && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Available From date should be before this date
                          </p>
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