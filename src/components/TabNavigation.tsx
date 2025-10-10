import { Link, useLocation } from "react-router-dom";
import { Home, Search, Plus, MessageCircle, User, Flame } from "lucide-react";

const TabNavigation = () => {
  const location = useLocation();

  const tabs = [
    { path: "/", label: "Home", icon: Home },
    { path: "/roommates", label: "Browse", icon: Search },
    { path: "/post", label: "Post", icon: Plus },
    { path: "/swipe", label: "Swipe", icon: Flame },
    { path: "/messages", label: "Messages", icon: MessageCircle },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-6 h-16">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center space-y-1 transition-smooth ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;