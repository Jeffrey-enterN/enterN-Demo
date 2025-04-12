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
      <div className="h-24 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center" style={{background: "linear-gradient(135deg, rgba(92, 225, 230, 0.15), rgba(92, 225, 230, 0.05))"}}>
          <div className="text-lg font-medium" style={{color: "#0097b1"}}>
            {profile.school ? `${profile.degreeLevel || "Student"} • ${profile.major || "Education"}` : "Candidate"}
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">        
        <div className="text-center">
          <p className="mt-2 text-gray-600">
            Looking for opportunities in {profile.preferredIndustries ? profile.preferredIndustries.join(", ") : "various fields"}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {profile.preferredIndustries && profile.preferredIndustries.slice(0, 3).map((industry: string, idx: number) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="bg-[rgba(92,225,230,0.15)] text-[#0097b1] hover:bg-[rgba(92,225,230,0.25)]"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 border-l-4 pl-2" style={{borderColor: "#5ce1e6"}}>Summary</h4>
          <p className="mt-1 text-sm text-gray-600">
            {profile.summary || "Passionate professional seeking opportunities to grow and contribute."}
          </p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 border-l-4 pl-2" style={{borderColor: "#5ce1e6"}}>Education</h4>
          <div className="mt-1">
            <p className="text-sm font-medium text-gray-900">{profile.school || "University"}</p>
            <p className="text-sm text-gray-600">{profile.degreeLevel} {profile.major}</p>
          </div>
        </div>
        
        {profile.preferences && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 border-l-4 pl-2" style={{borderColor: "#5ce1e6"}}>Key Preferences</h4>
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
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(profile.preferences.preferences.remoteWork / 10) * 100}%`,
                            background: "#5ce1e6"
                          }}
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
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(profile.preferences.preferences.organizationSize / 10) * 100}%`,
                            background: "#5ce1e6"
                          }}
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
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(profile.preferences.preferences.growthTrajectory / 10) * 100}%`,
                            background: "#5ce1e6"
                          }}
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
          className="h-14 w-14 rounded-full shadow-lg bg-white hover:bg-[rgba(92,225,230,0.05)] border-[#5ce1e6] transition"
          style={{color: "#5ce1e6"}}
        >
          <X className="h-7 w-7" />
        </Button>
        <Button 
          onClick={handleAccept}
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg bg-white hover:bg-[rgba(92,225,230,0.05)] border-[#5ce1e6] transition"
          style={{color: "#5ce1e6"}}
        >
          <Check className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
