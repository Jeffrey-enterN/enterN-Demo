import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, Briefcase, Globe, MapPin, Users, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Minimum swipe distance required to trigger accept/reject
const SWIPE_THRESHOLD = 80; // Reduced from 100 to make swiping more responsive

interface EmployerCardProps {
  employer: any; // Employer profile with job postings
  onAccept: () => void;
  onReject: () => void;
}

export default function EmployerCard({ employer, onAccept, onReject }: EmployerCardProps) {
  const [showAllJobs, setShowAllJobs] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onAccept();
      } else if (e.key === "ArrowLeft") {
        onReject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onAccept, onReject]);

  // Handle touch/mouse events for swiping
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    
    // Disable scrolling when dragging starts
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }

    // Capture pointer to track movement even when leaving the element
    if (e.pointerId) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diffX = currentX - startX;
    setOffsetX(diffX);

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diffX}px)`;
      
      // Add rotation effect
      const rotation = diffX * 0.05; // Adjust for desired rotation amount
      cardRef.current.style.rotate = `${rotation}deg`;
      
      // Gradually change opacity as the card moves
      const opacity = 1 - Math.abs(diffX) / 500;
      cardRef.current.style.opacity = Math.max(opacity, 0.5).toString();
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    
    // Release pointer capture
    if (e.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore errors if pointer was already released
      }
    }
    
    if (cardRef.current) {
      // Reset transition for smooth animation
      cardRef.current.style.transition = "transform 0.3s ease, opacity 0.3s ease, rotate 0.3s ease";
      
      // Check if swipe was long enough
      if (offsetX > SWIPE_THRESHOLD) {
        handleAccept();
      } else if (offsetX < -SWIPE_THRESHOLD) {
        handleReject();
      } else {
        // Reset the card position if swipe was not enough
        cardRef.current.style.transform = "translateX(0)";
        cardRef.current.style.rotate = "0deg";
        cardRef.current.style.opacity = "1";
      }
    }
    
    setOffsetX(0);
  };

  const handleAccept = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "translateX(150%)";
      cardRef.current.style.opacity = "0";
      setTimeout(onAccept, 300);
    } else {
      onAccept();
    }
  };

  const handleReject = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "translateX(-150%)";
      cardRef.current.style.opacity = "0";
      setTimeout(onReject, 300);
    } else {
      onReject();
    }
  };

  return (
    <div 
      ref={cardRef} 
      className="relative rounded-xl bg-white shadow-lg overflow-hidden max-w-2xl mx-auto transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="flex flex-col h-[80vh] md:h-[600px] overflow-hidden">
        {/* Company Header */}
        <div className="p-6 bg-gradient-to-r from-[#defdff] to-[#ffffff] border-b">
          <h2 className="text-2xl font-bold text-gray-800">{employer.companyName}</h2>
          <div className="flex items-center text-gray-600 mt-1">
            <Building className="h-4 w-4 mr-1" />
            <span className="text-sm">{employer.industry}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{employer.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <Globe className="h-4 w-4 mr-1" />
            <span className="text-sm">{employer.website}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">{employer.companySize} employees</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {employer.jobPostings.slice(0, 3).map((job: any) => (
              <Badge key={job.id} variant="outline" className="bg-[rgba(92,225,230,0.1)] text-gray-700 border-[#5ce1e6]">
                {job.title}
              </Badge>
            ))}
            {employer.jobPostings.length > 3 && (
              <Badge variant="outline" className="bg-[rgba(92,225,230,0.1)] text-gray-700 border-[#5ce1e6]">
                +{employer.jobPostings.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">About</h3>
              <p className="text-gray-600 mt-1">{employer.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Mission</h3>
              <p className="text-gray-600 mt-1">{employer.mission}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Culture</h3>
              <p className="text-gray-600 mt-1">{employer.culture}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Benefits</h3>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                {employer.benefits.map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Job Openings</h3>
                <Button 
                  onClick={() => setShowAllJobs(!showAllJobs)} 
                  variant="ghost" 
                  className="text-xs text-[#5ce1e6] hover:text-[#0097b1]"
                >
                  {showAllJobs ? "Show less" : "Show all"}
                </Button>
              </div>
              
              <div className="mt-2 space-y-4">
                {employer.jobPostings
                  .slice(0, showAllJobs ? undefined : 2)
                  .map((job: any) => (
                    <Card key={job.id} className="p-4 bg-[rgba(92,225,230,0.05)] border-[#e3fcfd]">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{job.title}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="bg-white text-gray-700 text-xs">
                              {job.employmentType.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="bg-white text-gray-700 text-xs">
                              {job.locationType.replace('_', ' ')}
                            </Badge>
                            {job.salary && (
                              <Badge variant="outline" className="bg-white text-gray-700 text-xs">
                                {job.salary}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Briefcase className="h-5 w-5 text-[#5ce1e6]" />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{job.description}</p>
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-gray-700">Requirements:</h5>
                        <p className="text-xs text-gray-600">{job.requirements}</p>
                      </div>
                    </Card>
                  ))}
                
                {!showAllJobs && employer.jobPostings.length > 2 && (
                  <div className="text-center text-sm text-gray-500">
                    <Button 
                      onClick={() => setShowAllJobs(true)} 
                      variant="ghost" 
                      className="flex items-center text-[#5ce1e6] hover:text-[#0097b1]"
                    >
                      See {employer.jobPostings.length - 2} more job openings
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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