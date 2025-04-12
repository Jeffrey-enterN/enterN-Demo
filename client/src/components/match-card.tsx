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
                      <div className="text-xs text-center text-gray-500 mb-3">
                        <span>Scroll to see more</span>
                        <ChevronDown className="mx-auto mt-1 h-4 w-4 text-gray-400 animate-bounce" />
                      </div>
                      <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2 pb-28 overscroll-contain" style={{WebkitOverflowScrolling: "touch"}}>
                        
                        {/* Workplace Environment Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Workplace Environment</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["remoteWork", "workStructure", "openOffice", "dressCasual", "workFromAnywhere", "flexibleHours"]
                              .includes(key))
                            .map(([key, value]) => {
                              if (key === 'remoteWork') return null; // Skip, already displayed above
                              
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels
                              let leftLabel = "Low";
                              let rightLabel = "High";
                              
                              // Custom labels for workplace environment
                              if (key === "workStructure") {
                                leftLabel = "Structured";
                                rightLabel = "Flexible";  
                              } else if (key === "openOffice") {
                                leftLabel = "Private";
                                rightLabel = "Open Space";
                              } else if (key === "dressCasual") {
                                leftLabel = "Formal";
                                rightLabel = "Casual";
                              } else if (key === "workFromAnywhere") {
                                leftLabel = "Fixed Location";
                                rightLabel = "Anywhere";
                              } else if (key === "flexibleHours") {
                                leftLabel = "Fixed Hours";
                                rightLabel = "Flexible";
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
                            })
                          }
                        </div>
                        
                        {/* Company Characteristics Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Company Characteristics</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["organizationSize", "growthTrajectory", "innovationFocus", "companyStability", 
                              "socialImpact", "environmentalFocus", "diversityCommitment", "internationalPresence", "companyAge"]
                              .includes(key))
                            .map(([key, value]) => {
                              if (key === 'organizationSize' || key === 'growthTrajectory') return null; // Skip, already displayed above
                              
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels
                              let leftLabel = "Low";
                              let rightLabel = "High";
                              
                              // Custom labels for company characteristics
                              if (key === "companyAge") {
                                leftLabel = "Startup";
                                rightLabel = "Established";
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
                            })
                          }
                        </div>
                        
                        {/* Team & Management Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Team & Management</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["communicationStyle", "feedbackFrequency", "decisionMaking", "managementStyle", 
                              "teamSize", "crossFunctionalWork", "mentorshipAccess", "autonomyLevel", "teamDynamics"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels
                              let leftLabel = "Low";
                              let rightLabel = "High";
                              
                              // Custom labels for team & management
                              if (key === "communicationStyle") {
                                leftLabel = "Direct";
                                rightLabel = "Diplomatic";
                              } else if (key === "decisionMaking") {
                                leftLabel = "Consensus";
                                rightLabel = "Decisive";
                              } else if (key === "managementStyle") {
                                leftLabel = "Hands-off";
                                rightLabel = "Involved";
                              } else if (key === "teamSize") {
                                leftLabel = "Small";
                                rightLabel = "Large";
                              } else if (key === "teamDynamics") {
                                leftLabel = "Individual";
                                rightLabel = "Team-based";
                              } else if (key === "autonomyLevel") {
                                leftLabel = "Directed";
                                rightLabel = "Autonomous";
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
                            })
                          }
                        </div>
                        
                        {/* Professional Development Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Professional Development</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["learningOpportunities", "careerAdvancement", "performanceRecognition", 
                              "skillDevelopment", "industryNetworking", "certificationSupport", 
                              "conferencesSupport", "continuousLearning", "learningStyle"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels
                              let leftLabel = "Low";
                              let rightLabel = "High";
                              
                              // Custom labels
                              if (key === "learningStyle") {
                                leftLabel = "Independent";
                                rightLabel = "Collaborative";
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
                            })
                          }
                        </div>
                        
                        {/* Compensation & Benefits Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Compensation & Benefits</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["compensationPreference", "equityVsSalary", "benefitsPackage", "retirementBenefits", 
                              "healthWellnessFocus", "paidTimeOff", "parentalLeave", "tuitionReimbursement"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels
                              let leftLabel = "Low";
                              let rightLabel = "High";
                              
                              // Custom labels
                              if (key === "equityVsSalary") {
                                leftLabel = "Salary";
                                rightLabel = "Equity";
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
                            })
                          }
                        </div>
                        
                        {/* Work Dynamics Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Work Dynamics</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["riskTolerance", "travelRequirements", "projectVariety", "deadlinePressure", 
                              "customerInteraction", "workIndependence", "mentorshipImportance", "recognitionStyle",
                              "problemSolvingApproach", "paceOfWork", "adaptabilityRequirement"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels
                              let leftLabel = "Low";
                              let rightLabel = "High";
                              
                              // Custom labels for work dynamics
                              if (key === "riskTolerance") {
                                leftLabel = "Risk-Averse";
                                rightLabel = "Risk-Taking";
                              } else if (key === "deadlinePressure") {
                                leftLabel = "Relaxed";
                                rightLabel = "Deadline-Driven";
                              } else if (key === "workIndependence") {
                                leftLabel = "Collaborative";
                                rightLabel = "Independent";
                              } else if (key === "recognitionStyle") {
                                leftLabel = "Private";
                                rightLabel = "Public";
                              } else if (key === "problemSolvingApproach") {
                                leftLabel = "Analytical";
                                rightLabel = "Creative";
                              } else if (key === "paceOfWork") {
                                leftLabel = "Measured";
                                rightLabel = "Fast-Paced";
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
                            })
                          }
                        </div>
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
      <div className="absolute bottom-0 left-0 right-0 py-6 flex justify-center space-x-10 z-10 bg-gradient-to-t from-white via-white to-transparent">
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
