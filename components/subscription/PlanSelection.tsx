"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plan } from "@/types";
import { subscriptionService } from "@/services/subscriptionService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export function PlanSelection({ organizationId }: { organizationId: string }) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (!session?.accessToken) return;
        const plansData = await subscriptionService.getPlans(
          session.accessToken
        );
        setPlans(plansData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch plans");
      }
    };

    fetchPlans();
  }, [session]);

  const handleSelectPlan = async (planId: string) => {
    try {
      setIsLoading(true);
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      const checkoutSession = await subscriptionService.createCheckoutSession(
        session.accessToken,
        organizationId,
        planId
      );

      // Redirect to Stripe Checkout
      window.location.href = checkoutSession.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start checkout process"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="relative">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              ${plan.price}/{plan.interval}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSelectPlan(plan.id)}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Select Plan"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
