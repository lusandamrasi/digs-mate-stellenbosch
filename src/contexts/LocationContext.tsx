import { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState("stellenbosch");
  const [radius, setRadius] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <LocationContext.Provider 
      value={{ 
        selectedCity, 
        setSelectedCity, 
        radius, 
        setRadius,
        isFilterOpen,
        setIsFilterOpen
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export default LocationContext;

