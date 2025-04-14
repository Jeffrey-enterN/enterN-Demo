import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { 
  Bell, 
  Menu,
  User,
  LogOut,
  Settings,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [_, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };

  // Determine navigation items based on user role
  const getNavItems = () => {
    if (!user) {
      return [
        { label: "Home", href: "/" },
        { label: "Login", href: "/auth" },
      ];
    }

    if (user.role === "employer") {
      return [
        { label: "Match Feed", href: "/employer/match-feed" },
        { label: "Job Postings", href: "/employer/job-posting" },
        { label: "Messages", href: "/employer/matches" },
        { label: "Analytics", href: "/employer/analytics" },
      ];
    }

    // Jobseeker navigation
    return [
      { label: "Match Feed", href: "/jobseeker/match-feed" },
      { label: "My Matches", href: "#" },
      { label: "Messages", href: "#" },
      { label: "Events", href: "#" },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-primary-600 font-heading font-bold text-xl">enterN</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item, index) => {
                const isActive = window.location.pathname === item.href;
                return (
                  <a 
                    key={index}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.href);
                    }}
                    className={`${
                      isActive 
                        ? "border-primary-500 text-gray-900" 
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {user && (
            <div className="flex items-center">
              {/* Notifications */}
              <div className="flex-shrink-0">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </Button>
              </div>

              {/* Messages - Desktop */}
              <div className="hidden md:flex-shrink-0 md:flex md:ml-2">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </Button>
              </div>

              {/* User Menu - Desktop */}
              <div className="hidden md:ml-2 md:flex-shrink-0 md:flex md:items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate(user.role === "employer" ? "/employer/profile-setup" : "/jobseeker/profile-setup")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu Button */}
              <div className="ml-2 md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6 text-gray-500" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                        </div>
                      </div>
                      <nav className="flex flex-col space-y-3">
                        {navItems.map((item, index) => (
                          <a 
                            key={index}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(item.href);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                          >
                            {item.label}
                          </a>
                        ))}
                        <div className="pt-4 border-t border-gray-200">
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(user.role === "employer" ? "/employer/profile-setup" : "/jobseeker/profile-setup");
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                          >
                            <User className="h-5 w-5 mr-3 text-gray-500" />
                            Profile
                          </a>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // Handle settings
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center py-2 text-base font-medium text-gray-600 hover:text-gray-900"
                          >
                            <Settings className="h-5 w-5 mr-3 text-gray-500" />
                            Settings
                          </a>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center py-2 text-base font-medium text-red-600 hover:text-red-700"
                          >
                            <LogOut className="h-5 w-5 mr-3 text-red-500" />
                            Logout
                          </a>
                        </div>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex items-center">
              <Button 
                variant="default" 
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
