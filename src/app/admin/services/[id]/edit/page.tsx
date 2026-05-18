import { serviceService } from "@/modules/services/service.service";
import { ServiceForm } from "@/components/admin/service-form";
import { notFound } from "next/navigation";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await serviceService.getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-outfit mb-8">Edit Service</h1>
      <ServiceForm initialData={service} />
    </div>
  );
}
