import Link from "next/link";
import Image from "next/image";
import { PlusIcon, EditIcon, Sparkles } from "lucide-react";
import { serviceService } from "@/modules/services/service.service";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";

export default async function AdminServicesPage() {
  const services = await serviceService.getAllServices(true); // Include inactive

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Services
            <Sparkles size={28} className="text-[#FF4D8D]" />
          </h1>
          <p className="text-gray-500 font-semibold mt-1">Create, edit, and manage your hair services.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={3} />
          Add Service
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        {service.imageUrl ? (
                          <Image
                            src={service.imageUrl}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                            <Sparkles size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">{service.name}</div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">/{service.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-gray-500">
                      {service.description}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {service.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        <EditIcon className="h-4 w-4" strokeWidth={2.5} />
                      </Link>
                      <DeleteServiceButton id={service.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex-shrink-0 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <Sparkles size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{service.name}</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">/{service.slug}</p>
                </div>
              </div>
              {service.isActive ? (
                <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider border border-emerald-100">
                  Active
                </span>
              ) : (
                <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-[9px] font-bold uppercase tracking-wider border border-gray-100">
                  Inactive
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 font-medium line-clamp-2 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
              {service.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-1">
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-100 transition-all border border-gray-100"
              >
                <EditIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                Edit
              </Link>
              <DeleteServiceButton id={service.id} />
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 border-dashed p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <Sparkles size={32} />
          </div>
          <p className="font-bold text-gray-500">No services found.</p>
          <Link 
            href="/admin/services/new" 
            className="text-[#FF4D8D] font-bold text-sm mt-2 hover:underline inline-block"
          >
            Create your first service →
          </Link>
        </div>
      )}
    </div>
  );
}
