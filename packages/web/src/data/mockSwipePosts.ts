export interface SwipePost {
  id: string;
  images: string[];
  matchPercentage: number;
  matchReason: string;
  propertyType: string;
  bedrooms: number;
  price: number;
  location: string;
  distance: number;
  availableDate: string;
  isHotProperty: boolean;
  interestedCount?: number;
  preferences: string[];
  poster: {
    name: string;
    age: number;
    program: string;
    bio: string;
    profileImage: string;
  };
}

export const mockSwipePosts: SwipePost[] = [
  {
    id: "1",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    matchPercentage: 92,
    matchReason: "Similar lifestyle & schedule",
    propertyType: "2 bed digs",
    bedrooms: 2,
    price: 3500,
    location: "Die Boord",
    distance: 1.2,
    availableDate: "2025-02-01",
    isHotProperty: true,
    interestedCount: 34,
    preferences: ["Clean, quiet roommate", "Non-smoker", "Night owl friendly"],
    poster: {
      name: "Sarah",
      age: 21,
      program: "Engineering Student",
      bio: "Love hiking & cooking",
      profileImage: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: "2",
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&h=600&fit=crop",
    ],
    matchPercentage: 85,
    matchReason: "Similar study habits",
    propertyType: "Apartment",
    bedrooms: 1,
    price: 4200,
    location: "Stellenbosch Central",
    distance: 0.5,
    availableDate: "2025-01-15",
    isHotProperty: true,
    interestedCount: 28,
    preferences: ["Study-focused", "Early bird", "Pet-friendly"],
    poster: {
      name: "Michael",
      age: 22,
      program: "Law Student",
      bio: "Gym enthusiast & book lover",
      profileImage: "https://i.pravatar.cc/150?img=12"
    }
  },
  {
    id: "3",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
    ],
    matchPercentage: 78,
    matchReason: "Compatible preferences",
    propertyType: "3 bed house",
    bedrooms: 3,
    price: 2800,
    location: "Dalsig",
    distance: 2.3,
    availableDate: "2025-02-15",
    isHotProperty: false,
    preferences: ["Social & friendly", "Movie nights", "Shared cooking"],
    poster: {
      name: "Emma",
      age: 20,
      program: "Arts & Design",
      bio: "Creative soul, coffee addict ☕",
      profileImage: "https://i.pravatar.cc/150?img=9"
    }
  },
  {
    id: "4",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop",
    ],
    matchPercentage: 88,
    matchReason: "Similar budget & location",
    propertyType: "Student digs",
    bedrooms: 2,
    price: 3200,
    location: "Universiteitsoord",
    distance: 0.8,
    availableDate: "2025-01-20",
    isHotProperty: true,
    interestedCount: 19,
    preferences: ["Close to campus", "WiFi essential", "Quiet study space"],
    poster: {
      name: "David",
      age: 23,
      program: "Computer Science",
      bio: "Gamer, coder, coffee drinker",
      profileImage: "https://i.pravatar.cc/150?img=14"
    }
  },
  {
    id: "5",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    matchPercentage: 91,
    matchReason: "Great match on lifestyle",
    propertyType: "Modern apartment",
    bedrooms: 2,
    price: 4500,
    location: "Stellenbosch Central",
    distance: 0.6,
    availableDate: "2025-02-01",
    isHotProperty: false,
    preferences: ["Clean & organized", "Respectful of space", "Occasional social"],
    poster: {
      name: "Jessica",
      age: 21,
      program: "Business Management",
      bio: "Foodie & fitness junkie 💪",
      profileImage: "https://i.pravatar.cc/150?img=10"
    }
  },
  {
    id: "6",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    ],
    matchPercentage: 73,
    matchReason: "Similar interests",
    propertyType: "Cottage",
    bedrooms: 1,
    price: 5200,
    location: "Paradyskloof",
    distance: 3.5,
    availableDate: "2025-03-01",
    isHotProperty: false,
    preferences: ["Nature lover", "Quiet environment", "Pet owner (cat)"],
    poster: {
      name: "Liam",
      age: 24,
      program: "Environmental Science",
      bio: "Hiker, cyclist, conservationist",
      profileImage: "https://i.pravatar.cc/150?img=15"
    }
  },
  {
    id: "7",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
    ],
    matchPercentage: 82,
    matchReason: "Compatible schedule",
    propertyType: "2 bed flat",
    bedrooms: 2,
    price: 3800,
    location: "Die Boord",
    distance: 1.5,
    availableDate: "2025-01-25",
    isHotProperty: false,
    preferences: ["Music lover", "Flexible schedule", "Good communicator"],
    poster: {
      name: "Sophia",
      age: 20,
      program: "Music Therapy",
      bio: "Piano player, tea enthusiast 🎹",
      profileImage: "https://i.pravatar.cc/150?img=16"
    }
  },
  {
    id: "8",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-afd83c34c163?w=800&h=600&fit=crop",
    ],
    matchPercentage: 95,
    matchReason: "Perfect match!",
    propertyType: "Luxury apartment",
    bedrooms: 2,
    price: 5800,
    location: "Stellenbosch Central",
    distance: 0.3,
    availableDate: "2025-02-10",
    isHotProperty: true,
    interestedCount: 42,
    preferences: ["Professional student", "Clean & tidy", "Respectful & mature"],
    poster: {
      name: "Oliver",
      age: 23,
      program: "Med Student",
      bio: "Future doctor, current coffee addict",
      profileImage: "https://i.pravatar.cc/150?img=13"
    }
  },
  {
    id: "9",
    images: [
      "https://images.unsplash.com/photo-1600566752229-250ed79470d4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
    ],
    matchPercentage: 79,
    matchReason: "Similar preferences",
    propertyType: "Townhouse",
    bedrooms: 3,
    price: 3000,
    location: "Mostertsdrift",
    distance: 2.8,
    availableDate: "2025-02-20",
    isHotProperty: false,
    preferences: ["Group study sessions", "Sport enthusiast", "Easy-going"],
    poster: {
      name: "Chloe",
      age: 22,
      program: "Physiotherapy",
      bio: "Runner, yogi, health nut 🏃‍♀️",
      profileImage: "https://i.pravatar.cc/150?img=20"
    }
  },
  {
    id: "10",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&h=600&fit=crop",
    ],
    matchPercentage: 86,
    matchReason: "Great personality match",
    propertyType: "Garden cottage",
    bedrooms: 1,
    price: 4000,
    location: "Jonkershoek",
    distance: 4.2,
    availableDate: "2025-03-15",
    isHotProperty: false,
    preferences: ["Love outdoors", "Braai weekends", "Laid-back vibe"],
    poster: {
      name: "Noah",
      age: 21,
      program: "Agriculture",
      bio: "Farm boy at heart 🌾",
      profileImage: "https://i.pravatar.cc/150?img=11"
    }
  },
  {
    id: "11",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210491632-4e9c37ea16c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop",
    ],
    matchPercentage: 90,
    matchReason: "Excellent compatibility",
    propertyType: "Modern digs",
    bedrooms: 2,
    price: 3600,
    location: "Dalsig",
    distance: 1.8,
    availableDate: "2025-01-30",
    isHotProperty: false,
    preferences: ["Tech-savvy", "Netflix & chill", "Foodie"],
    poster: {
      name: "Ava",
      age: 20,
      program: "Digital Marketing",
      bio: "Social media guru & meme queen 📱",
      profileImage: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: "12",
    images: [
      "https://images.unsplash.com/photo-1600573472356-f79c4e04e52d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
    ],
    matchPercentage: 74,
    matchReason: "Compatible lifestyle",
    propertyType: "Studio apartment",
    bedrooms: 1,
    price: 4800,
    location: "Stellenbosch Central",
    distance: 0.4,
    availableDate: "2025-02-05",
    isHotProperty: false,
    preferences: ["Minimalist", "Independent", "Quiet nights"],
    poster: {
      name: "Ethan",
      age: 24,
      program: "PhD Candidate",
      bio: "Researcher, introvert, cat person",
      profileImage: "https://i.pravatar.cc/150?img=8"
    }
  },
  {
    id: "13",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
    ],
    matchPercentage: 87,
    matchReason: "Similar values & goals",
    propertyType: "Shared house",
    bedrooms: 3,
    price: 2600,
    location: "Universiteitsoord",
    distance: 0.9,
    availableDate: "2025-02-12",
    isHotProperty: true,
    interestedCount: 25,
    preferences: ["Budget-conscious", "Friendly & social", "Shared responsibilities"],
    poster: {
      name: "Mia",
      age: 19,
      program: "Psychology",
      bio: "People person, coffee lover ☕",
      profileImage: "https://i.pravatar.cc/150?img=45"
    }
  },
  {
    id: "14",
    images: [
      "https://images.unsplash.com/photo-1600585152915-d208bec867e1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop",
    ],
    matchPercentage: 81,
    matchReason: "Good match overall",
    propertyType: "Apartment",
    bedrooms: 2,
    price: 4100,
    location: "Die Boord",
    distance: 1.3,
    availableDate: "2025-03-01",
    isHotProperty: false,
    preferences: ["Active lifestyle", "Weekend adventures", "Good vibes only"],
    poster: {
      name: "James",
      age: 22,
      program: "Sports Science",
      bio: "Athlete, coach, motivator 🏋️",
      profileImage: "https://i.pravatar.cc/150?img=33"
    }
  },
  {
    id: "15",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
    ],
    matchPercentage: 93,
    matchReason: "Nearly perfect match!",
    propertyType: "2 bed apartment",
    bedrooms: 2,
    price: 3900,
    location: "Stellenbosch Central",
    distance: 0.7,
    availableDate: "2025-02-08",
    isHotProperty: true,
    interestedCount: 31,
    preferences: ["Organized & clean", "Study-friendly", "Mutual respect"],
    poster: {
      name: "Isabella",
      age: 21,
      program: "Accounting",
      bio: "Numbers nerd, baking enthusiast 🧁",
      profileImage: "https://i.pravatar.cc/150?img=44"
    }
  }
];

