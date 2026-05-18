import React from "react";
import Link from "next/link";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  Clock,
  Calendar,
  CheckCircle2,
  Plus,
  Scissors,
  Coins,
} from "lucide-react";
import { cn, formatPrice, getCurrencySymbol } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export const revalidate = 0; // Disable static rendering for the dashboard

export default async function AdminDashboardPage() {
  // Fetch Metrics concurrently
  const [
    totalProducts,
    availableProducts,
    pendingBookings,
    totalBookings,
    completedOrders,
    totalUsers,
    activeServices,
    revenueData,
    recentBookings,
    recentOrders,
    settings,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: { variants: { some: { stock: { gt: 0 } } } },
    }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count(),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.user.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "SUCCESS" },
    }),
    prisma.booking.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { service: true },
    }),
    prisma.order.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.setting.findFirst(),
  ]);

  const currency = settings?.currency || "GBP";

  const totalRevenue = revenueData._sum.totalAmount ? Number(revenueData._sum.totalAmount) : 0;

  const stats = [
    { label: "Available Products", value: availableProducts.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Bookings", value: pendingBookings.toString(), icon: Clock, color: "text-[#FF4D8D]", bg: "bg-pink-50" },
    { label: "Total Revenue", value: formatPrice(totalRevenue, currency), icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50", extra: `Total Orders: ${completedOrders}` },
    { label: "Registered Users", value: totalUsers.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed Orders", value: completedOrders.toString(), icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Products", value: totalProducts.toString(), icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Bookings", value: totalBookings.toString(), icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Services", value: activeServices.toString(), icon: Scissors, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm border border-pink-100 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold text-gray-600 mb-0.5">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-black text-[#FF4D8D] mb-1 tracking-tight">Pretty Chi Hairs Admin</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{currentDate}</p>
        </div>
        
        <Link href="/admin/products/new" className="mt-4 md:mt-0 relative z-10 flex items-center gap-2 bg-white text-[#FF4D8D] px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all shadow-sm group border border-pink-100 text-sm">
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Product</span>
        </Link>
        
        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-white/60 to-transparent rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-pink-200/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[1.75rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-0.5 tracking-tight">{stat.value}</h3>
              <p className="text-gray-500 text-[12px] font-bold">{stat.label}</p>
              {stat.extra && (
                <p className="text-[10px] font-bold text-[#FF4D8D] mt-1.5 bg-pink-50 inline-block px-2 py-0.5 rounded-full">{stat.extra}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Booking Requests</h2>
            <Link href="/admin/bookings" className="text-[10px] font-bold text-gray-400 hover:text-[#FF4D8D] transition-colors flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-3 flex-1">
            {recentBookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <Calendar size={40} className="opacity-20 mb-3" />
                <p className="text-sm font-semibold">No recent bookings</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-[1.25rem] bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 hover:border-gray-100 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm group-hover:text-[#FF4D8D] group-hover:border-pink-100 transition-colors">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.name}`} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{booking.name}</p>
                      <p className="text-[11px] font-bold text-gray-400">{booking.service.name} · {format(new Date(booking.createdAt), "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider",
                    booking.status === "PENDING" ? "bg-amber-50 text-amber-600" :
                    booking.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600" :
                    booking.status === "COMPLETED" ? "bg-blue-50 text-blue-600" :
                    "bg-red-50 text-red-600"
                  )}>
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders/Payments */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold text-gray-400 hover:text-[#FF4D8D] transition-colors flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
          
          <div className="space-y-3 flex-1">
            {recentOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <ShoppingBag size={40} className="opacity-20 mb-3" />
                <p className="text-sm font-semibold">No recent orders</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-[1.25rem] bg-gray-50/50 border border-gray-100/50 hover:bg-gray-50 hover:border-gray-100 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm group-hover:text-[#FF4D8D] group-hover:border-pink-100 transition-colors">
                      <ShoppingBag size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{order.id.slice(-8)}</p>
                      <p className="text-[11px] font-bold text-gray-400">{order.fullName} · {format(new Date(order.createdAt), "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 mb-0.5">{formatPrice(order.totalAmount, currency)}</p>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      order.paymentStatus === "SUCCESS" ? "bg-emerald-50 text-emerald-600" :
                      order.paymentStatus === "PENDING" ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
