import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-outfit mb-8">Add New Service</h1>
      <ServiceForm />
    </div>
  );
}
