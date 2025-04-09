import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, MapPin, Users, Building, CheckCircle } from "lucide-react";

interface EmployerCardProps {
  employer: any; // Employer profile with job postings
  onAccept: () => void;
  onReject: () => void;
}

export default function EmployerCard({ employer, onAccept, onReject }: EmployerCardProps) {
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

  const getPerksAndBenefitsList = () => {
    if (!employer.perksAndBenefits) return [];
    return employer.perksAndBenefits.split(',').map((perk: string) => perk.trim()).slice(0, 4);
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
        <div className="w-full h-full bg-gradient-to-r from-primary-100 to-secondary-100"></div>
      </div>
      
      <div className="relative px-6 pb-6">
        <div className="flex justify-center">
          <div className="-mt-12 w-24 h-24 rounded-lg border-4 border-white bg-white overflow-hidden flex items-center justify-center">
            {/* Company logo would be here in a real app */}
            <div className="text-3xl font-bold text-primary-600">
              {employer.companyName ? employer.companyName.charAt(0) : "C"}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-xl font-heading font-bold text-gray-900">{employer.companyName}</h3>
          <p className="text-gray-600">{employer.industry} • {employer.employeeCount} employees</p>
          <div className="mt-2 flex justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              Hiring Actively
            </Badge>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">About</h4>
          <p className="mt-1 text-sm text-gray-600">
            {employer.about || `${employer.companyName} is a company focused on innovation and excellence in the ${employer.industry} industry.`}
          </p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">Locations</h4>
          <p className="mt-1 text-sm text-gray-600 flex items-start">
            <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
            <span>
              <span className="font-medium">HQ:</span> {employer.headquarters}
              {employer.additionalOffices && (
                <>
                  <br />
                  <span className="font-medium">Other:</span> {employer.additionalOffices}
                </>
              )}
            </span>
          </p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">Open Positions</h4>
          {employer.jobPostings && employer.jobPostings.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {employer.jobPostings.map((job: any) => (
                <li key={job.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-600">
                    {job.type.replace('_', '-')} • {job.locationType} • {job.location}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-gray-500 italic">No open positions listed</p>
          )}
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900">Culture & Benefits</h4>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {getPerksAndBenefitsList().map((perk, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2 text-sm text-gray-600 flex items-center">
                <CheckCircle className="h-4 w-4 text-primary-500 mr-1" />
                {perk}
              </div>
            ))}
          </div>
        </div>
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
