import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import PropertyGrid from "@/components/PropertyGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SearchFilters />
      <PropertyGrid />
      <Footer />
    </div>
  );
};

export default Index;
