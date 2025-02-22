import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PlanSelection } from "@/components/subscription/PlanSelection";
import { subscriptionService } from "@/services/subscriptionService";

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const organizationId = cookies().get("currentOrganizationId")?.value;
  if (!organizationId) {
    redirect("/switch-organization");
  }

  const subscription = await subscriptionService.getCurrentSubscription(
    session.accessToken,
    organizationId
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Subscription Management</h1>

      {subscription && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Current Subscription</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium capitalize">{subscription.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Period</p>
              <p className="font-medium">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()}{" "}
                - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <PlanSelection organizationId={organizationId} />
      </div>
    </div>
  );
}
