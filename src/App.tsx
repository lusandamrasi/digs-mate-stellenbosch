import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { BetterAuthProvider } from "./providers/BetterAuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import Roommates from "./pages/Roommates";
import CreatePost from "./pages/CreatePost";
import SavedListings from "./pages/SavedListings";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TabNavigation from "./components/TabNavigation";

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="flatmate-ui-theme">
    <BetterAuthProvider>
      <QueryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
                <Route path="/roommates" element={<ProtectedRoute><Roommates /></ProtectedRoute>} />
                <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><SavedListings /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <TabNavigation />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryProvider>
    </BetterAuthProvider>
  </ThemeProvider>
);

export default App;
