"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useOrganization } from "@/hooks/useOrganization";

export default function DashboardPage() {
  const { organization } = useOrganization();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome to {organization?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add your dashboard cards/widgets here */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            {/* Add quick action buttons */}
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {/* Add recent activity list */}
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            {/* Add subscription info */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
