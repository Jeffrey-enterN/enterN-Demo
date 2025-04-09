import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, FileText, CheckSquare } from "lucide-react";
import { EmploymentTypeEnum, LocationTypeEnum, UserRoleEnum } from "@shared/schema";

interface JobCardProps {
  job: any;
  onAccept: () => void;
  onReject: () => void;
  userRole?: string;
}

export default function JobCard({ job, onAccept, onReject, userRole }: JobCardProps) {
  if (!job) {
    return (
      <Card className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <CardHeader className="px-6 py-4 bg-gray-50">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format job type for display
  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Format location type for display
  const formatLocationType = (locationType: string) => {
    switch (locationType) {
      case LocationTypeEnum.ONSITE:
        return "On-site";
      case LocationTypeEnum.HYBRID:
        return "Hybrid";
      case LocationTypeEnum.REMOTE:
        return "Remote";
      default:
        return locationType;
    }
  };

  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <CardTitle className="text-lg font-heading font-semibold text-gray-900">{job.title}</CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {formatJobType(job.type)}
        </Badge>
      </CardHeader>
      
      <CardContent className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          {job.location} • {formatLocationType(job.locationType)}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            About The Role
          </h4>
          <p className="text-sm text-gray-600 mb-4">{job.description}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <CheckSquare className="h-4 w-4 mr-2 text-gray-500" />
            Responsibilities
          </h4>
          <p className="text-sm text-gray-600 mb-4">{job.responsibilities}</p>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={onReject}
            className="flex items-center"
          >
            <X className="h-4 w-4 mr-2 text-gray-400" />
            Not Interested
          </Button>
          <Button
            onClick={onAccept}
            className="flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            {userRole === UserRoleEnum.JOBSEEKER ? "I'm Interested" : "Share with Candidate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
