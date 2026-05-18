"use client";

import { useState, useEffect } from "react";
import { Booking, Service } from "@/generated/prisma";
type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  ChevronDown, 
  Filter, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookingWithService = Booking & { service: Service };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const url = filter === "ALL" ? "/api/bookings" : `/api/bookings?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error();

      toast.success("Status updated");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING": return { label: "Pending", className: "bg-amber-50 text-amber-600 border-amber-100", icon: AlertCircle };
      case "CONFIRMED": return { label: "Confirmed", className: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 };
      case "COMPLETED": return { label: "Completed", className: "bg-blue-50 text-blue-600 border-blue-100", icon: Sparkles };
      case "CANCELLED": return { label: "Cancelled", className: "bg-red-50 text-red-600 border-red-100", icon: XCircle };
      default: return { label: status, className: "bg-gray-50 text-gray-600 border-gray-100", icon: Clock };
    }
  };

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Close dropdown on click outside
    useEffect(() => {
      const handleClickOutside = () => setActiveDropdown(null);
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Bookings
              <Calendar size={28} className="text-[#FF4D8D]" />
            </h1>
            <p className="text-gray-500 font-semibold mt-1">Manage and track all service appointments.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-pink-50 text-[#FF4D8D] px-4 py-2 rounded-xl font-bold text-sm border border-pink-100">
              {bookings.length} Total Bookings
            </div>
            <div className="relative group">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="appearance-none bg-white border border-gray-100 hover:border-[#FF4D8D]/30 rounded-xl px-5 py-2.5 pr-12 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-pink-50 transition-all shadow-sm cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-[#FF4D8D] transition-colors" />
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Service</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Appointment</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                      <Loader2 className="animate-spin text-[#FF4D8D] mx-auto mb-4" size={32} />
                      <p className="font-bold text-gray-500">Fetching bookings...</p>
                    </td>
                  </tr>
                ) : bookings.map((booking) => {
                  const badge = getStatusBadge(booking.status);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-[#FF4D8D] border border-pink-100 font-bold text-sm">
                            {booking.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-tight">{booking.name}</p>
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5">{booking.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
                            <Sparkles size={14} />
                          </div>
                          <p className="text-sm font-bold text-gray-900">{booking.service.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                            <Calendar size={14} className="text-gray-400" />
                            {format(new Date(booking.preferredDate), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mt-1">
                            <Clock size={12} />
                            {booking.preferredTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          badge.className
                        )}>
                          <badge.icon size={12} strokeWidth={3} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === booking.id ? null : booking.id)}
                            className={cn(
                              "inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all border",
                              activeDropdown === booking.id 
                                ? "bg-[#FF4D8D] text-white border-transparent" 
                                : "bg-gray-50 text-gray-600 hover:bg-[#FF4D8D] hover:text-white border-gray-200 hover:border-transparent"
                            )}
                          >
                            Update Status <ChevronDown size={14} strokeWidth={2.5} className={cn("transition-transform duration-200", activeDropdown === booking.id && "rotate-180")} />
                          </button>
                          {activeDropdown === booking.id && (
                            <div className="absolute right-0 top-full pt-2 w-48 origin-top-right z-50 animate-in fade-in zoom-in-95 duration-200">
                              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden ring-1 ring-black/5">
                                {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => {
                                      updateStatus(booking.id, status as BookingStatus);
                                      setActiveDropdown(null);
                                    }}
                                    className={cn(
                                      "w-full text-left px-5 py-2.5 text-xs font-bold transition-colors",
                                      booking.status === status ? "text-[#FF4D8D] bg-pink-50" : "text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D]"
                                    )}
                                  >
                                    Mark as {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <Loader2 className="animate-spin text-[#FF4D8D] mx-auto mb-3" size={24} />
              <p className="font-bold text-gray-500 text-sm">Loading bookings...</p>
            </div>
          ) : bookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            return (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center text-[#FF4D8D] border border-pink-100 font-bold">
                      {booking.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{booking.name}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">{booking.service.name}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                    badge.className
                  )}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-xs font-bold text-gray-900">{format(new Date(booking.preferredDate), "MMM d, yyyy")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                    <p className="text-xs font-bold text-gray-900">{booking.preferredTime}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    <a href={`tel:${booking.phone}`} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#FF4D8D] border border-gray-100">
                      <Phone size={14} />
                    </a>
                    <a href={`mailto:${booking.email}`} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#FF4D8D] border border-gray-100">
                      <Mail size={14} />
                    </a>
                  </div>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                     <button 
                       onClick={() => setActiveDropdown(activeDropdown === booking.id ? null : booking.id)}
                       className={cn(
                         "text-xs font-bold px-4 py-2 rounded-xl transition-all border",
                         activeDropdown === booking.id 
                           ? "bg-[#FF4D8D] text-white border-transparent"
                           : "text-[#FF4D8D] border-[#FF4D8D]/20 bg-pink-50/30"
                       )}
                     >
                       Update Status
                     </button>
                     {activeDropdown === booking.id && (
                       <div className="absolute bottom-full right-0 mb-3 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                updateStatus(booking.id, status as BookingStatus);
                                setActiveDropdown(null);
                              }}
                              className={cn(
                                "w-full text-left px-5 py-2.5 text-[11px] font-bold transition-colors",
                                booking.status === status ? "text-[#FF4D8D] bg-pink-50" : "text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D]"
                              )}
                            >
                              Mark as {status}
                            </button>
                          ))}
                       </div>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
