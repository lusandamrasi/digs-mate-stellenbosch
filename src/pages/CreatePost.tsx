import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Home, Users, RefreshCw, Upload, MapPin, Calendar } from "lucide-react";

const CreatePost = () => {
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
            Post your property or find roommates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="property" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="property" className="flex items-center gap-2">
              <Home size={16} />
              Property Listing
            </TabsTrigger>
            <TabsTrigger value="roommate" className="flex items-center gap-2">
              <Users size={16} />
              Find Roommates
            </TabsTrigger>
            <TabsTrigger value="takeover" className="flex items-center gap-2">
              <RefreshCw size={16} />
              Lease Takeover
            </TabsTrigger>
          </TabsList>

          {/* Property Listing */}
          <TabsContent value="property">
            <Card>
              <CardHeader>
                <CardTitle>Post Property Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input id="title" placeholder="e.g., Modern 2-bedroom apartment near campus" />
                  </div>
                  <div>
                    <Label htmlFor="price">Monthly Rent (R)</Label>
                    <Input id="price" type="number" placeholder="4500" />
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Property Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="digs">Student Digs</SelectItem>
                        <SelectItem value="room">Single Room</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </Label>
                  <Input id="location" placeholder="e.g., Stellenbosch Central, Die Boord" />
                </div>

                {/* Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="available-from" className="flex items-center gap-2">
                      <Calendar size={16} />
                      Available From
                    </Label>
                    <Input id="available-from" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="max-occupants">Max Occupants</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Max occupants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your property, amenities, rules, and what makes it special..."
                    rows={4}
                  />
                </div>

                {/* Photos */}
                <div>
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 10 photos)</p>
                    <Button variant="outline" className="mt-4">Choose Files</Button>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-gradient-accent hover:opacity-90 transition-smooth">
                  Post Property Listing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roommate Finder */}
          <TabsContent value="roommate">
            <Card>
              <CardHeader>
                <CardTitle>Find Roommates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="roommate-title">Post Title</Label>
                  <Input id="roommate-title" placeholder="e.g., Looking for 2 roommates in Dalsig" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget-per-person">Budget per Person (R)</Label>
                    <Input id="budget-per-person" type="number" placeholder="2500" />
                  </div>
                  <div>
                    <Label htmlFor="location-roommate">Location</Label>
                    <Input id="location-roommate" placeholder="e.g., Dalsig, Die Boord" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current-roommates">Current Roommates</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="How many now?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Just me</SelectItem>
                        <SelectItem value="1">1 other</SelectItem>
                        <SelectItem value="2">2 others</SelectItem>
                        <SelectItem value="3">3+ others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="looking-for">Looking For</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="How many more?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 roommate</SelectItem>
                        <SelectItem value="2">2 roommates</SelectItem>
                        <SelectItem value="3">3 roommates</SelectItem>
                        <SelectItem value="4">4+ roommates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Preferences</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Non-smoker</Badge>
                    <Badge variant="outline">Student</Badge>
                    <Badge variant="outline">Quiet hours</Badge>
                    <Badge variant="outline">Female only</Badge>
                    <Badge variant="outline">Male only</Badge>
                    <Badge variant="outline">Study-focused</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">+ Add preference</Button>
                </div>

                <div>
                  <Label htmlFor="roommate-description">Description</Label>
                  <Textarea 
                    id="roommate-description" 
                    placeholder="Tell potential roommates about yourself, your lifestyle, and what you're looking for..."
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
                  Post Roommate Request
                </Button>
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