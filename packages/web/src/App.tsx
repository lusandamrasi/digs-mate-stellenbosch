import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { BetterAuthProvider as AuthProvider, useAuth } from "./providers/BetterAuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LocationProvider } from "./contexts/LocationContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Roommates from "./pages/Roommates";
import SwipeScreen from "./pages/SwipeScreen";
import CreatePost from "./pages/CreatePost";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import SimpleAuth from "./pages/SimpleAuth";
import NotFound from "./pages/NotFound";
import TabNavigation from "./components/TabNavigation";

// Component to handle root route logic
const RootRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />;
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <QueryProvider>
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  <Route path="/" element={<RootRoute />} />
                  <Route path="/auth" element={<SimpleAuth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/roommates" element={<ProtectedRoute><Roommates /></ProtectedRoute>} />
                  <Route path="/swipe" element={<ProtectedRoute><SwipeScreen /></ProtectedRoute>} />
                  <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <TabNavigation />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </LocationProvider>
      </QueryProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
