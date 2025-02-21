import { CreateOrganization } from "@/components/organization/CreateOrganization";

export default function CreateOrganizationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Welcome! Let's set up your organization
      </h1>
      <CreateOrganization />
    </div>
  );
}
