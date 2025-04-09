import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MatchCardProps {
  profile: any; // Jobseeker profile with preferences
  onAccept: () => void;
  onReject: () => void;
}

export default function MatchCard({ profile, onAccept, onReject }: MatchCardProps) {
  const [swiping, setSwiping] = useState<string | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  // Handle swipe animation completion
  useEffect(() => {
    if (swiping) {
      const timer = setTimeout(() => {
        if (swiping === "right") {
          onAccept();
        } else if (swiping === "left") {
          onReject();
        }
        setSwiping(null);
        setOffsetX(0);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [swiping, onAccept, onReject]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (offsetX > 100) {
      setSwiping("right");
    } else if (offsetX < -100) {
      setSwiping("left");
    } else {
      setOffsetX(0);
    }
    setStartX(null);
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSwiping("left");
      } else if (e.key === "ArrowRight") {
        setSwiping("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Button click handlers
  const handleAccept = () => {
    setSwiping("right");
  };

  const handleReject = () => {
    setSwiping("left");
  };

  // Determine card transform styles based on swipe direction
  const cardStyle = {
    transform: swiping
      ? swiping === "right"
        ? "translateX(150%) rotate(20deg)"
        : "translateX(-150%) rotate(-20deg)"
      : offsetX
      ? `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)`
      : "translateX(0) rotate(0)",
    transition: swiping ? "transform 0.3s ease-out" : "none",
    opacity: swiping ? 0 : 1,
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden"
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-40 bg-gray-200">
        {/* Background image would be here in a real app */}
        <div className="w-full h-full bg-gradient-to-r from-primary-200 to-secondary-200"></div>
      </div>
      
      <div className="relative px-6 pb-6">
        <div className="flex justify-center">
          <div className="-mt-12 w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {/* Profile photo would be here in a real app */}
            <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold text-2xl">
              {profile.firstName ? profile.firstName.charAt(0) : "J"}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-xl font-heading font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-gray-600">
            {profile.school ? `${profile.degreeLevel || "Student"} • ${profile.major || "Education"}` : "Job Seeker"}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {profile.preferredIndustries && profile.preferredIndustries.slice(0, 3).map((industry: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">Summary</h4>
          <p className="mt-1 text-sm text-gray-600">
            {profile.summary || "Passionate professional seeking opportunities to grow and contribute."}
          </p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">Education</h4>
          <div className="mt-1">
            <p className="text-sm font-medium text-gray-900">{profile.school || "University"}</p>
            <p className="text-sm text-gray-600">{profile.degreeLevel} {profile.major}</p>
          </div>
        </div>
        
        {profile.preferences && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900">Key Preferences</h4>
            <div className="mt-3 space-y-3">
              {/* Display some key preferences as slider visualizations */}
              {profile.preferences.preferences && (
                <>
                  {/* Remote Work Preference */}
                  {profile.preferences.preferences.remoteWork && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>In-office</span>
                        <span>Fully Remote</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${(profile.preferences.preferences.remoteWork / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Organization Size Preference */}
                  {profile.preferences.preferences.organizationSize && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Small Startup</span>
                        <span>Large Enterprise</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${(profile.preferences.preferences.organizationSize / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Growth Trajectory Preference */}
                  {profile.preferences.preferences.growthTrajectory && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Specialist/Expert</span>
                        <span>Management Track</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${(profile.preferences.preferences.growthTrajectory / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Swipe Buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-10">
        <Button 
          onClick={handleReject}
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg text-red-500 bg-white hover:bg-red-50 hover:text-red-600 transition"
        >
          <X className="h-7 w-7" />
        </Button>
        <Button 
          onClick={handleAccept}
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg text-green-500 bg-white hover:bg-green-50 hover:text-green-600 transition"
        >
          <Check className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
