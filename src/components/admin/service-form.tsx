"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { serviceSchema, ServiceInput } from "@/modules/services/service.schema";
import { Service } from "@/generated/prisma";
import { ImageUpload } from "@/components/ui/image-upload";

interface ServiceFormProps {
  initialData?: Service;
}

export const ServiceForm = ({ initialData }: ServiceFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: (initialData || {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
    }) as any,
  });

  const onSubmit = async (data: ServiceInput) => {
    setIsSubmitting(true);
    try {
      const url = initialData ? `/api/services/${initialData.id}` : "/api/services";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save service");
      }

      toast.success(initialData ? "Service updated!" : "Service created!");
      router.push("/admin/services");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-2xl border border-gray-100 shadow-sm max-w-2xl min-w-0">
      <div className="grid grid-cols-1 gap-6 min-w-0">
        <div className="min-w-0">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name")}
            type="text"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border min-w-0"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="min-w-0">
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            {...register("slug")}
            type="text"
            placeholder="e.g. wig-installation"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border min-w-0"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
        </div>

        <div className="min-w-0">
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                onRemove={() => field.onChange("")}
                label="Service Image"
                className="min-w-0"
              />
            )}
          />
          {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
        </div>

        <div className="min-w-0">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border min-w-0"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <input
            {...register("isActive")}
            type="checkbox"
            id="isActive"
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black shrink-0"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 truncate">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  );
};
