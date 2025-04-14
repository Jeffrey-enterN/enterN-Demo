import { useLocation } from "wouter";
import { Home, Briefcase, MessageSquare, User, Calendar, Building, BarChart } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface MobileNavbarProps {
  activeItem?: string;
}

export function MobileNavbar({ activeItem = "home" }: MobileNavbarProps) {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  // Define navigation items based on user role
  let navItems = [];
  
  if (user?.role === "employer") {
    navItems = [
      { id: "home", label: "Home", icon: Home, path: "/" },
      { id: "matches", label: "Candidates", icon: Briefcase, path: "/employer/match-feed" },
      { id: "messages", label: "Messages", icon: MessageSquare, path: "/employer/matches" },
      { id: "analytics", label: "Analytics", icon: BarChart, path: "/employer/analytics" },
      { id: "profile", label: "Profile", icon: User, path: "/employer/profile-setup" },
    ];
  } else {
    // Default to jobseeker navigation
    navItems = [
      { id: "home", label: "Home", icon: Home, path: "/" },
      { id: "employers", label: "Employers", icon: Building, path: "/jobseeker/employer-feed" },
      { id: "matches", label: "Candidates", icon: Briefcase, path: "/jobseeker/match-feed" },
      { id: "messages", label: "Messages", icon: MessageSquare, path: "/jobseeker/matches" },
      { id: "profile", label: "Profile", icon: User, path: "/jobseeker/profile-setup" },
    ];
  }

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${
              activeItem === item.id
                ? "text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            } flex flex-col items-center justify-center`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
