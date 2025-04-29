import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  BriefcaseIcon,
  Settings,
  Bell,
  Edit,
  Sliders,
  School,
  CheckCircle,
  User,
  MailCheck,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from "@/components/ui/progress";
import { JobseekerProfile } from '@shared/schema';

interface JobseekerAnalytics {
  swipes: {
    total: number;
    yes: number;
    no: number;
    pending: number;
  };
  matches: {
    total: number;
  };
  jobReviews: {
    total: number;
    interested: number;
    notInterested: number;
    pending: number;
  };
  secondLook: {
    total: number;
  };
}

export default function JobseekerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  // Get jobseeker profile
  const { data: profile, isError: profileError, error: profileErrorData } = useQuery<JobseekerProfile>({
    queryKey: ['/api/jobseeker/profile'],
    enabled: !!user,
  });

  // Get analytics data
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery<JobseekerAnalytics>({
    queryKey: ['/api/jobseeker/analytics'],
    enabled: !!user && !!profile,
  });
  
  // Redirect to profile setup if profile doesn't exist
  useEffect(() => {
    if (profileError) {
      console.log("Profile error detected:", profileErrorData);
      // Check if the error is a 404 (profile not found)
      if (profileErrorData instanceof Error && 
          profileErrorData.message.includes("404")) {
        console.log("Profile not found, redirecting to simple profile setup");
        setLocation("/jobseeker/simple-profile-setup");
      }
    }
  }, [profileError, profileErrorData, setLocation]);
  
  // Calculate if we have second look opportunities
  const hasSecondLookOpportunities = analytics?.secondLook?.total ? analytics.secondLook.total > 0 : false;

  // Transform analytics data for charts 
  const swipeData = analytics ? [
    { name: 'Yes', value: analytics.swipes.yes, fill: '#5ce1e6' },
    { name: 'No', value: analytics.swipes.no, fill: '#ff66c4' },
  ] : [
    { name: 'Yes', value: 0, fill: '#5ce1e6' },
    { name: 'No', value: 0, fill: '#ff66c4' },
  ];

  const matchData = analytics ? [
    { name: 'Matches', value: analytics.matches.total, fill: '#5ce1e6' },
  ] : [
    { name: 'Matches', value: 0, fill: '#5ce1e6' },
  ];

  const jobReviewData = analytics ? [
    { name: 'Interested', value: analytics.jobReviews.interested, fill: '#5ce1e6' },
    { name: 'Not Interested', value: analytics.jobReviews.notInterested, fill: '#ff66c4' },
  ] : [
    { name: 'Interested', value: 0, fill: '#5ce1e6' },
    { name: 'Not Interested', value: 0, fill: '#ff66c4' },
  ];

  const completionPercentage = 80; // This would be calculated based on profile completion
  const isSchoolVerified = false; // This would come from the user's profile
  // Check if user has a .edu email in their profile
  const hasEduEmail = profile?.school && profile.school.toLowerCase().includes('.edu') || false;

  // Check if user has a .edu email
  const needsVerification = !hasEduEmail && !isSchoolVerified;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.firstName || 'there'}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
            {notificationsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-[#ff66c4] h-5 w-5 flex items-center justify-center p-0">
                {notificationsCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 bg-[#5ce1e6] rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{profile?.firstName?.charAt(0) || 'U'}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Profile Completion Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completion</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              
              {/* Complete Profile CTA */}
              <div className="bg-gradient-to-r from-[rgba(92,225,230,0.1)] to-[rgba(255,102,196,0.1)] border border-[#5ce1e6] rounded-md p-4 mt-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-[rgba(92,225,230,0.2)] flex items-center justify-center flex-shrink-0">
                      <Edit className="h-5 w-5 text-[#5ce1e6]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Complete Your Full Profile</h3>
                      <p className="text-sm text-gray-600">Finish setting up your profile to improve your matches and get better job opportunities.</p>
                    </div>
                  </div>
                  <Button
                    className="bg-[#5ce1e6] hover:bg-[#4bb7bc] text-white shadow-sm"
                    onClick={() => setLocation('/jobseeker/complete-profile')}
                  >
                    Complete Full Profile
                  </Button>
                </div>
              </div>
              
              {needsVerification && (
                <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mt-3 flex items-start gap-2">
                  <School className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">School verification required</p>
                    <p className="text-xs text-amber-700 mt-1">Verify your school email to access premium features.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/match-feed')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <User className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enter Match Feed</h3>
                  <p className="text-sm text-gray-500">Find employers that match your preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/job-search')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Search for Jobs</h3>
                  <p className="text-sm text-gray-500">Browse and filter available positions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/complete-profile')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Edit className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Complete Full Profile</h3>
                  <p className="text-sm text-gray-500">Add more details to improve matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/preferences')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Sliders className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Update Preferences</h3>
                  <p className="text-sm text-gray-500">Refine your matching criteria</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {needsVerification && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/verify-school')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                    <School className="h-6 w-6 text-[#5ce1e6]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Verify Your School</h3>
                    <p className="text-sm text-gray-500">Connect with your .edu email</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/calendar')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Calendar</h3>
                  <p className="text-sm text-gray-500">Manage interviews and events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {hasSecondLookOpportunities && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/jobseeker/second-look')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-[#5ce1e6]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">Second Look</h3>
                      {analytics?.secondLook?.total && analytics.secondLook.total > 0 && (
                        <Badge className="bg-[#ff66c4]">{analytics.secondLook.total}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Review previously rejected employers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analytics Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Activity</h2>
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Analytics</TabsTrigger>
            <TabsTrigger value="swipes">Swipes</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="jobs">Job Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Swipes Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Swipe Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={swipeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {swipeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 flex justify-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#5ce1e6]"></div>
                        <span className="text-sm text-gray-600">Yes: {swipeData[0].value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#ff66c4]"></div>
                        <span className="text-sm text-gray-600">No: {swipeData[1].value}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Matches Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-800">{matchData[0].value}</span>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#5ce1e6" 
                          strokeWidth="10" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="0" 
                        />
                      </svg>
                    </div>
                    <p className="text-center text-gray-600 mt-4">Total Matches</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Job Reviews Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Job Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={jobReviewData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                          {jobReviewData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="swipes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Swipe Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={swipeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {swipeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    You've swiped on <span className="font-medium">{swipeData.reduce((sum, item) => sum + item.value, 0)}</span> employer profiles so far.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Your Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <div className="relative h-48 w-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-800">{matchData[0].value}</span>
                    </div>
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#5ce1e6" 
                        strokeWidth="10" 
                        strokeDasharray="251.2" 
                        strokeDashoffset="0" 
                      />
                    </svg>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">Total Matches</p>
                    <p className="text-sm text-gray-500 mt-2">
                      You've matched with {matchData[0].value} employers
                    </p>
                    <Button 
                      className="mt-4 bg-[#5ce1e6] hover:bg-[#4bc0c5] text-white"
                      onClick={() => setLocation('/jobseeker/matches')}
                    >
                      View All Matches
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Job Review Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobReviewData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {jobReviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    You've reviewed <span className="font-medium">{jobReviewData.reduce((sum, item) => sum + item.value, 0)}</span> job postings from matched employers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recently Viewed */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* These would be populated with actual data */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Acme Corporation</h3>
              <p className="text-sm text-gray-500">Software Engineer</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Full-time</Badge>
                <Badge variant="secondary">Remote</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-3">Viewed yesterday</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Tech Innovators</h3>
              <p className="text-sm text-gray-500">Product Manager</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Full-time</Badge>
                <Badge variant="secondary">Hybrid</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-3">Viewed 2 days ago</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Global Solutions Inc.</h3>
              <p className="text-sm text-gray-500">Marketing Specialist</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Contract</Badge>
                <Badge variant="secondary">Remote</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-3">Viewed 3 days ago</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}