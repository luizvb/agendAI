import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { organizationService } from "@/services/organizationService";

export default async function SwitchOrganizationPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const organizations = await organizationService.getUserOrganizations();

  async function setOrganization(organizationId: string) {
    "use server";
    cookies().set("currentOrganizationId", organizationId);
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Select an Organization
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <form
            key={org.id}
            action={async () => {
              await setOrganization(org.id);
            }}
          >
            <button
              type="submit"
              className="w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
              {org.description && (
                <p className="text-gray-600">{org.description}</p>
              )}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
