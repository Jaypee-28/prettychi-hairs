"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface DeleteServiceButtonProps {
  id: string;
}

export const DeleteServiceButton = ({ id }: DeleteServiceButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete service");
      }

      toast.success("Service deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`transition-colors ${isDeleting ? "text-gray-300" : "text-gray-400 hover:text-red-600"}`}
      title="Delete Service"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
};
