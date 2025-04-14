import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

// Analytics data type
interface AnalyticsData {
  totalSwipes: number;
  yesSwipes: number;
  noSwipes: number;
  pendingSwipes: number;
  yesToNoRatio: string;
}

// Chart colors based on our branding
const COLORS = ['#5ce1e6', '#ff66c4', '#ddd']; // cyan, pink, gray for pending

export default function EmployerAnalytics() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['/api/employer/analytics'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Error</CardTitle>
          <CardDescription>
            There was an error loading your analytics data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load analytics. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Analytics Available</CardTitle>
          <CardDescription>
            Analytics will appear here once you receive some swipes from jobseekers.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Prepare data for pie chart
  const pieData = [
    { name: 'Yes Swipes', value: analytics.yesSwipes },
    { name: 'No Swipes', value: analytics.noSwipes },
    { name: 'Pending', value: analytics.pendingSwipes }
  ].filter(item => item.value > 0); // Only display sections with values

  // Prepare data for bar chart
  const barData = [
    { name: 'Yes', value: analytics.yesSwipes },
    { name: 'No', value: analytics.noSwipes },
    { name: 'Pending', value: analytics.pendingSwipes }
  ].filter(item => item.value > 0); // Only display bars with values

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employer Analytics</CardTitle>
        <CardDescription>
          Track how jobseekers are interacting with your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Total Swipes</h3>
                <p className="text-3xl font-bold" style={{ color: '#5ce1e6' }}>{analytics.totalSwipes}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Yes Swipes</h3>
                <p className="text-3xl font-bold" style={{ color: '#5ce1e6' }}>{analytics.yesSwipes}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">No Swipes</h3>
                <p className="text-3xl font-bold" style={{ color: '#ff66c4' }}>{analytics.noSwipes}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-50 to-purple-50 p-6 rounded-lg mt-4">
              <h3 className="text-xl font-semibold mb-2">Yes:No Ratio</h3>
              <div className="flex items-center">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-pink-500">
                  {analytics.yesToNoRatio}
                </span>
                <span className="ml-2 text-gray-500">(yes swipes : no swipes)</span>
              </div>
              <p className="mt-2 text-gray-600">
                {parseFloat(analytics.yesToNoRatio) > 1 
                  ? "Great job! More jobseekers are interested in your profile than not."
                  : parseFloat(analytics.yesToNoRatio) === 1
                  ? "You're getting equal interest and passes on your profile."
                  : "You might want to improve your profile to attract more interest."}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 text-center">Swipe Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No data available to display chart</p>
                  )}
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 text-center">Swipe Counts</h3>
                <div className="h-64 flex items-center justify-center">
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill="#5ce1e6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No data available to display chart</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}