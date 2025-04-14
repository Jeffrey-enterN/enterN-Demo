import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import EmployerAnalytics from "@/components/analytics/employer-analytics";
import { Redirect } from "wouter";

export default function EmployerAnalyticsDashboard() {
  const { user } = useAuth();

  // Make sure only employers can access this page
  if (user && user.role !== "employer") {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Get insights on how jobseekers are interacting with your profile
          </p>
        </div>
        
        <div className="space-y-6">
          <EmployerAnalytics />
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Analytics Usage Tips</h2>
            <ul className="space-y-2 list-disc pl-5 text-gray-700">
              <li>
                <span className="font-medium">Yes:No Ratio</span>: A higher ratio means more 
                jobseekers are interested in your profile than not. Aim for a ratio above 1.
              </li>
              <li>
                <span className="font-medium">Profile Optimization</span>: If your Yes:No ratio 
                is below 1, consider updating your company description or job listings.
              </li>
              <li>
                <span className="font-medium">Pending Swipes</span>: These represent jobseekers 
                who haven't yet swiped on your profile after you've swiped on theirs.
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <MobileNavbar activeItem="analytics" />
    </div>
  );
}