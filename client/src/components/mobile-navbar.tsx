import { useLocation } from "wouter";
import { Home, Briefcase, MessageSquare, User, Calendar } from "lucide-react";

interface MobileNavbarProps {
  activeItem?: string;
}

export function MobileNavbar({ activeItem = "home" }: MobileNavbarProps) {
  const [_, navigate] = useLocation();

  // Define navigation items based on user role (to be extended in a real app)
  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "matches", label: "Matches", icon: Briefcase, path: "/jobseeker/match-feed" },
    { id: "events", label: "Events", icon: Calendar, path: "/" },
    { id: "messages", label: "Messages", icon: MessageSquare, path: "/" },
    { id: "profile", label: "Profile", icon: User, path: "/jobseeker/profile-setup" },
  ];

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
