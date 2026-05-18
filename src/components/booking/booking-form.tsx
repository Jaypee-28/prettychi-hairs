"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bookingSchema, BookingInput, TIME_SLOTS } from "@/modules/bookings/booking.schema";
import { Service } from "@/generated/prisma";
import { BookingCalendar } from "./booking-calendar";
import { format } from "date-fns";

interface BookingFormProps {
  services: Service[];
}

export const BookingForm = ({ services }: BookingFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, string[]>>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      serviceId: serviceIdParam || "",
      preferredDate: undefined,
      preferredTime: undefined,
    },
  });

  const selectedDate = watch("preferredDate");
  const selectedTime = watch("preferredTime");

  const fetchAvailability = async (month: Date) => {
    setIsLoadingAvailability(true);
    try {
      const monthParam = month.getMonth() + 1; // 1-12
      const yearParam = month.getFullYear();
      const res = await fetch(`/api/bookings/availability?month=${monthParam}&year=${yearParam}`);
      if (res.ok) {
        const data = await res.json();
        setAvailabilityMap(data);
      }
    } catch (error) {
      console.error("Failed to fetch availability", error);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability(currentMonth);
  }, [currentMonth]);

  const onSubmit = async (data: BookingInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || "Failed to create booking");
      }

      toast.success("Booking submitted successfully!");
      router.push("/booking/success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine available slots for the selected date
  const getAvailableSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    // Convert to Date object if it's a string from React Hook Form
    const dateObj = new Date(selectedDate);
    const dateStr = format(dateObj, "yyyy-MM-dd");
    
    // If date is in map, use those slots, otherwise all slots are available
    return availabilityMap[dateStr] || [...TIME_SLOTS];
  };

  const availableSlots = getAvailableSlotsForSelectedDate();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 font-inter mb-2">
          Select Service
        </label>
        <select
          {...register("serviceId")}
          id="serviceId"
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm font-inter py-3 px-4 border bg-gray-50 hover:bg-white transition-colors"
        >
          <option value="">Choose a premium service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="mt-2 text-sm text-red-600 font-inter">{errors.serviceId.message}</p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 font-inter mb-4">
          Select Date & Time
        </label>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Controller
              control={control}
              name="preferredDate"
              render={({ field }) => (
                <BookingCalendar
                  selectedDate={field.value ? new Date(field.value) : undefined}
                  onSelectDate={(date) => {
                    field.onChange(date);
                    setValue("preferredTime", "" as any); // Reset time when date changes
                  }}
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                  availabilityMap={availabilityMap}
                />
              )}
            />
            {errors.preferredDate && (
              <p className="mt-2 text-sm text-red-600 font-inter text-center">{errors.preferredDate.message}</p>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-gray-700 font-inter mb-4">
              {selectedDate ? format(new Date(selectedDate), "EEEE, MMMM do") : "Select a date first"}
            </h3>
            
            {isLoadingAvailability ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              </div>
            ) : selectedDate ? (
              availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    const isSelected = selectedTime === slot;
                    
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setValue("preferredTime", slot as any, { shouldValidate: true })}
                        className={`
                          py-3 px-4 rounded-xl text-sm font-medium font-inter transition-all border
                          ${isSelected 
                            ? "bg-black text-white border-black shadow-md shadow-gray-300" 
                            : isAvailable 
                              ? "bg-white border-gray-200 text-gray-700 hover:border-black hover:text-black" 
                              : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"}
                        `}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border border-red-100 text-center">
                  <p className="text-red-800 font-medium font-outfit mb-1">Fully Booked</p>
                  <p className="text-red-600 text-sm font-inter">No available slots for this date.</p>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 text-center border-dashed">
                <p className="text-gray-500 text-sm font-inter">Time slots will appear here after you select a date.</p>
              </div>
            )}
            
            {errors.preferredTime && (
              <p className="mt-2 text-sm text-red-600 font-inter">{errors.preferredTime.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4 border-t border-gray-100">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-inter mb-2">
            Full Name
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="Jane Doe"
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm font-inter py-3 px-4 border"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 font-inter">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-inter mb-2">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="jane@example.com"
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm font-inter py-3 px-4 border"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 font-inter">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 font-inter mb-2">
          Phone Number
        </label>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          placeholder="+234 803 123 4567"
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm font-inter py-3 px-4 border"
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600 font-inter">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 font-inter mb-2">
          Notes (Optional)
        </label>
        <textarea
          {...register("notes")}
          id="notes"
          rows={3}
          placeholder="Any special requests or details we should know?"
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm font-inter py-3 px-4 border"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !selectedDate || !selectedTime}
        className="w-full inline-flex items-center justify-center rounded-full bg-black px-6 py-4 text-base font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isSubmitting ? "Processing..." : "Confirm Booking"}
      </button>
    </form>
  );
};
