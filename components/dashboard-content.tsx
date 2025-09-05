"use client";

import { Session } from "next-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceInput } from "./attendance-input";

interface DashboardContentProps {
  session: Session;
}

export function DashboardContent({ session }: DashboardContentProps) {
  const { user } = session;

  const handleManageUsers = () => {
    // Mock user data
    const users = [
      { name: 'Super Administrator', email: 'admin@asad.com', role: 'SUPER_ADMIN', village: '-' },
      { name: 'Regional Coordinator', email: 'regional@asad.com', role: 'REGIONAL_COORDINATOR', village: '-' },
      { name: 'Cengkareng Coordinator', email: 'cengkareng@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Cengkareng' },
      { name: 'Kapuk Melati Coordinator', email: 'kapukmelati@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Kapuk Melati' },
      { name: 'Jelambar Coordinator', email: 'jelambar@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Jelambar' },
      { name: 'Kebon Jahe Coordinator', email: 'kebonjahe@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Kebon Jahe' },
      { name: 'Bandara Coordinator', email: 'bandara@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Bandara' },
      { name: 'Taman Kota Coordinator', email: 'tamankota@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Taman Kota' },
      { name: 'Kalideres Coordinator', email: 'kalideres@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Kalideres' },
      { name: 'Cipondoh Coordinator', email: 'cipondoh@asad.com', role: 'VILLAGE_COORDINATOR', village: 'Cipondoh' }
    ];

    // Create user list display
    const userList = users.map(user => 
      `${user.name} (${user.email}) - ${user.role.replace('_', ' ')} ${user.village !== '-' ? '- ' + user.village : ''}`
    ).join('\n');

    alert(`ASAD System Users:\n\n${userList}\n\nTotal Users: ${users.length}\n\nNote: User management interface coming soon!`);
  };

  const handleSystemReports = () => {
    alert('System Reports feature will show real data from database once attendance records are available. Currently no data has been entered by village coordinators.');
  };

  const handleExportData = () => {
    alert('Export Data feature will generate real CSV reports once attendance data is available. Currently no data has been entered by village coordinators.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ASAD Attendance System
              </h1>
              <p className="text-gray-600">
                Welcome, {user.name} ({user.role.replace("_", " ")})
                {user.village && ` - ${user.village}`}
              </p>
            </div>
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Statistics */}
            <div className="lg:col-span-2">
              <AttendanceStats userRole={user.role} village={user.village} />
            </div>

            {/* Attendance Input - Only for Village Coordinators */}
            {user.role === "VILLAGE_COORDINATOR" && user.village && (
              <div className="lg:col-span-2">
                <AttendanceInput 
                  village={user.village} 
                  userId={user.id}
                />
              </div>
            )}

            {/* Role-specific content */}
            {user.role === "SUPER_ADMIN" && (
              <Card>
                <CardHeader>
                  <CardTitle>System Administration</CardTitle>
                  <CardDescription>
                    Manage users and system settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline" onClick={handleManageUsers}>
                      Manage Users
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleSystemReports}>
                      System Reports
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleExportData}>
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === "REGIONAL_COORDINATOR" && (
              <Card>
                <CardHeader>
                  <CardTitle>Regional Reports</CardTitle>
                  <CardDescription>
                    View attendance across all villages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline" onClick={() => alert('Village Comparison - Coming Soon!')}>
                      Village Comparison
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => alert('Monthly Trends - Coming Soon!')}>
                      Monthly Trends
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => alert('Generate Reports - Coming Soon!')}>
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}