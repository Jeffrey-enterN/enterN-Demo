import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

interface MatchCardProps {
  profile: any; // Jobseeker profile with preferences
  onAccept: () => void;
  onReject: () => void;
}

export default function MatchCard({ profile, onAccept, onReject }: MatchCardProps) {
  const [swiping, setSwiping] = useState<string | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [showAllPreferences, setShowAllPreferences] = useState(false);

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
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${showAllPreferences ? 'min-h-[650px]' : ''}`}
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
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 border-l-4 pl-2" style={{borderColor: "#5ce1e6"}}>Key Preferences</h4>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#5ce1e6] hover:text-[#0097b1] hover:bg-[rgba(92,225,230,0.1)]"
                onClick={() => setShowAllPreferences(!showAllPreferences)}
              >
                <span className="mr-1">{showAllPreferences ? "Show Less" : "View All"}</span>
                {showAllPreferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>
            
            <div className="mt-3 space-y-3">
              {/* Always display key preferences */}
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
                  
                  {/* Expandable section for all other preferences */}
                  {showAllPreferences && profile.preferences.preferences && (
                    <div className="mt-4 border-t pt-3">
                      <h5 className="font-medium text-gray-900 mb-3 text-center" style={{color: "#0097b1"}}>All Preferences</h5>
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 pb-4">
                        {Object.entries(profile.preferences.preferences).map(([key, value]) => {
                          // Skip the ones we already displayed above
                          if (key === 'remoteWork' || key === 'organizationSize' || key === 'growthTrajectory') {
                            return null;
                          }
                          
                          // Create human-readable labels from camelCase
                          const label = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());
                            
                          // Generate opposites for slider labels
                          let leftLabel = "Low";
                          let rightLabel = "High";
                          
                          // Custom labels for common preference types
                          if (key.includes("work")) {
                            leftLabel = "Less";
                            rightLabel = "More";
                          } else if (key.includes("structure")) {
                            leftLabel = "Flexible";
                            rightLabel = "Structured";  
                          } else if (key.includes("risk")) {
                            leftLabel = "Risk-Averse";
                            rightLabel = "Risk-Taking";
                          } else if (key.includes("communication")) {
                            leftLabel = "Direct";
                            rightLabel = "Diplomatic";
                          }
                          
                          return (
                            <div key={key}>
                              <div className="text-sm font-medium text-gray-900 mb-1">{label}</div>
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{leftLabel}</span>
                                <span>{rightLabel}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${(Number(value) / 10) * 100}%`,
                                    background: "#5ce1e6"
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
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
