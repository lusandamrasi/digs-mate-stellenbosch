import { Link, useLocation } from "react-router-dom";
import { Home, Search, Plus, MessageCircle, User, Flame } from "lucide-react";
import { useAuth } from "@/providers/BetterAuthProvider";
import { useUnreadCount } from "shared/hooks/useQueries";
import { Badge } from "@/components/ui/badge";

const TabNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount(user?.id || '');

  const tabs = [
    { path: "/", label: "Home", icon: Home },
    { path: "/roommates", label: "Browse", icon: Search },
    { path: "/post", label: "Post", icon: Plus },
    { path: "/swipe", label: "Swipe", icon: Flame },
    { path: "/messages", label: "Messages", icon: MessageCircle, showBadge: true },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-6 h-16">
        {tabs.map(({ path, label, icon: Icon, showBadge }) => {
          const isActive = location.pathname === path;
          const showUnreadBadge = showBadge && unreadCount > 0;
          
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-smooth ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {showUnreadBadge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 min-w-[20px] flex items-center justify-center text-xs px-1.5 rounded-full"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;