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
    if (offsetX > 80) {
      setSwiping("right");
    } else if (offsetX < -80) {
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

  // Prevent swiping when viewing expanded preferences
  const handleTouchStartWithPreventionCheck = (e: React.TouchEvent) => {
    if (showAllPreferences) {
      // Don't initiate swipe when preferences are expanded
      return;
    }
    handleTouchStart(e);
  };

  const handleTouchMoveWithPreventionCheck = (e: React.TouchEvent) => {
    if (showAllPreferences) {
      // Don't handle swipe when preferences are expanded
      return;
    }
    handleTouchMove(e);
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${showAllPreferences ? 'min-h-[650px] max-h-[90vh] overflow-y-auto overscroll-contain' : ''}`}
      style={cardStyle}
      onTouchStart={handleTouchStartWithPreventionCheck}
      onTouchMove={handleTouchMoveWithPreventionCheck}
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
                  {/* Work Environment Preference - Remote vs Office */}
                  {profile.preferences.preferences.officeVsRemote && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Office vs Remote</div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>In-office</span>
                        <span>Fully Remote</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(profile.preferences.preferences.officeVsRemote / 10) * 100}%`,
                            background: "#5ce1e6"
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Work Style Preference */}
                  {profile.preferences.preferences.structureVsAmbiguity && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Structure vs Ambiguity</div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Prefers Structure</span>
                        <span>Thrives in Ambiguity</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(profile.preferences.preferences.structureVsAmbiguity / 10) * 100}%`,
                            background: "#5ce1e6"
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Mission & Vision Preference */}
                  {profile.preferences.preferences.purposeVsProfit && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Purpose vs Profit</div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Purpose-Driven Impact</span>
                        <span>Profit-Driven Focus</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(profile.preferences.preferences.purposeVsProfit / 10) * 100}%`,
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
                      <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 pb-28 overscroll-contain" style={{WebkitOverflowScrolling: "touch"}}>
                        
                        {/* Mission & Vision Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Mission & Vision</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["purposeVsProfit", "innovationVsTradition", "diversityVsPerformance", "cooperativeVsCompetitive", "socialResponsibilityVsPragmatism"]
                              .includes(key))
                            .map(([key, value]) => {
                              if (key === 'purposeVsProfit') return null; // Skip, already displayed above
                              
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels based on actual form
                              let leftLabel = "";
                              let rightLabel = "";
                              
                              // Custom labels based on the jobseeker form
                              if (key === "innovationVsTradition") {
                                leftLabel = "Innovation & Disruption";
                                rightLabel = "Tradition & Stability";
                              } else if (key === "diversityVsPerformance") {
                                leftLabel = "Diversity & Inclusion";
                                rightLabel = "Performance-First Culture";
                              } else if (key === "cooperativeVsCompetitive") {
                                leftLabel = "Cooperative & Supportive";
                                rightLabel = "Highly Competitive";
                              } else if (key === "socialResponsibilityVsPragmatism") {
                                leftLabel = "Social Responsibility";
                                rightLabel = "Business Pragmatism";
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
                        
                        {/* Work Style Preferences Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Work Style Preferences</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["logicalVsIntuitive", "structureVsAmbiguity", "focusVsMultitasking", "deadlinesVsFlexibility", "planningVsAdaptability"]
                              .includes(key))
                            .map(([key, value]) => {
                              if (key === 'structureVsAmbiguity') return null; // Skip, already displayed above
                              
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels based on actual form
                              let leftLabel = "";
                              let rightLabel = "";
                              
                              // Custom labels based on the jobseeker form
                              if (key === "logicalVsIntuitive") {
                                leftLabel = "Logical Decision-Making";
                                rightLabel = "Intuitive Decision-Making";
                              } else if (key === "focusVsMultitasking") {
                                leftLabel = "Deep Focus";
                                rightLabel = "Multitasking";
                              } else if (key === "deadlinesVsFlexibility") {
                                leftLabel = "Strict Deadlines";
                                rightLabel = "Flexible Timelines";
                              } else if (key === "planningVsAdaptability") {
                                leftLabel = "Detailed Planning";
                                rightLabel = "Adaptability";
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
                        
                        {/* Preferred Style for Supervisor Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Preferred Style for Supervisor</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["handsOnVsHandsOff", "directVsDiplomatic", "professionalVsCasual", "frequentVsInfrequentFeedback", "fixedVsFlexibleHours"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels based on actual form
                              let leftLabel = "";
                              let rightLabel = "";
                              
                              // Custom labels based on the jobseeker form
                              if (key === "handsOnVsHandsOff") {
                                leftLabel = "Hands-On Guidance";
                                rightLabel = "Hands-Off Autonomy";
                              } else if (key === "directVsDiplomatic") {
                                leftLabel = "Direct Feedback";
                                rightLabel = "Diplomatic Approach";
                              } else if (key === "professionalVsCasual") {
                                leftLabel = "Professional Formality";
                                rightLabel = "Casual Informality";
                              } else if (key === "frequentVsInfrequentFeedback") {
                                leftLabel = "Frequent Check-ins";
                                rightLabel = "Infrequent Check-ins";
                              } else if (key === "fixedVsFlexibleHours") {
                                leftLabel = "Fixed Work Hours";
                                rightLabel = "Flexible Work Hours";
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
                        
                        {/* Preferred Work Environment Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Preferred Work Environment</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["officeVsRemote", "openVsEnclosed", "formalVsInformal", "quietVsEnergetic", "smallTeamVsLargeTeam"]
                              .includes(key))
                            .map(([key, value]) => {
                              if (key === 'officeVsRemote') return null; // Skip, already displayed above
                              
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels based on actual form
                              let leftLabel = "";
                              let rightLabel = "";
                              
                              // Custom labels based on the jobseeker form
                              if (key === "openVsEnclosed") {
                                leftLabel = "Open Floor Plan";
                                rightLabel = "Private Offices";
                              } else if (key === "formalVsInformal") {
                                leftLabel = "Formal Atmosphere";
                                rightLabel = "Informal Culture";
                              } else if (key === "quietVsEnergetic") {
                                leftLabel = "Quiet Environment";
                                rightLabel = "Energetic Atmosphere";
                              } else if (key === "smallTeamVsLargeTeam") {
                                leftLabel = "Small Team";
                                rightLabel = "Large Team";
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
                        
                        {/* Preferred Collaboration Styles Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Preferred Collaboration Styles</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["independentVsCollaborative", "specialistVsGeneralist", "writtenVsVerbalCommunication", 
                              "projectVsTaskFocus", "leaderVsSupporter"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels based on actual form
                              let leftLabel = "";
                              let rightLabel = "";
                              
                              // Custom labels based on the jobseeker form
                              if (key === "independentVsCollaborative") {
                                leftLabel = "Independent Work";
                                rightLabel = "Collaborative Work";
                              } else if (key === "specialistVsGeneralist") {
                                leftLabel = "Specialist Focus";
                                rightLabel = "Generalist Approach";
                              } else if (key === "writtenVsVerbalCommunication") {
                                leftLabel = "Written Communication";
                                rightLabel = "Verbal Communication";
                              } else if (key === "projectVsTaskFocus") {
                                leftLabel = "Project-Based Work";
                                rightLabel = "Task-Based Work";
                              } else if (key === "leaderVsSupporter") {
                                leftLabel = "Leader Role";
                                rightLabel = "Supporter Role";
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
                        
                        {/* Growth & Development Goals Section */}
                        <div className="space-y-3">
                          <h6 className="font-medium text-gray-800 border-l-2 pl-2" style={{borderColor: "#5ce1e6"}}>Growth & Development Goals</h6>
                          {Object.entries(profile.preferences.preferences)
                            .filter(([key]) => 
                              ["technicalVsLeadership", "depthVsBreadth", "onTheJobVsFormalTraining", 
                              "mentorshipVsIndependentGrowth", "internalVsExternalPrograms"]
                              .includes(key))
                            .map(([key, value]) => {
                              // Create human-readable labels from camelCase
                              const label = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                                
                              // Generate opposites for slider labels based on actual form
                              let leftLabel = "";
                              let rightLabel = "";
                              
                              // Custom labels based on the jobseeker form
                              if (key === "technicalVsLeadership") {
                                leftLabel = "Technical Path";
                                rightLabel = "Leadership Path";
                              } else if (key === "depthVsBreadth") {
                                leftLabel = "Depth in Specialty";
                                rightLabel = "Breadth of Knowledge";
                              } else if (key === "onTheJobVsFormalTraining") {
                                leftLabel = "On-the-job Learning";
                                rightLabel = "Formal Training";
                              } else if (key === "mentorshipVsIndependentGrowth") {
                                leftLabel = "Mentorship";
                                rightLabel = "Independent Growth";
                              } else if (key === "internalVsExternalPrograms") {
                                leftLabel = "Internal Programs";
                                rightLabel = "External Programs";
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
