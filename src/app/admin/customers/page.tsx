import React from "react";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Users, ShoppingBag, Coins } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getGlobalCurrency } from "@/lib/settings";

import { CustomerActions } from "@/components/admin/customer-actions";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  // Fetch all users with order aggregation
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isBanned: true,
      createdAt: true,
      orders: {
        select: {
          totalAmount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Compute aggregated data
  const customers = users.map((user) => ({
    id: user.id,
    name: user.name || "—",
    email: user.email || "—",
    isBanned: user.isBanned,
    createdAt: user.createdAt,
    totalOrders: user.orders.length,
    totalSpent: user.orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    ),
  }));

  const currency = await getGlobalCurrency();

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-8">
      {/* Header ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="text-gray-500 font-semibold mt-1">
            View registered customers and their order history.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 flex items-center gap-2">
            <Users size={14} strokeWidth={2.5} />
            {totalCustomers} Customers
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100 flex items-center gap-2">
            <Coins size={14} strokeWidth={2.5} />
            {formatPrice(totalRevenue, currency)} Total Revenue
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Email
                </th>
                <th className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                  Orders
                </th>
                <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                  Total Spent
                </th>
                <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                  Joined
                </th>
                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50/50 transition group"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center border border-pink-100 shadow-sm text-[#FF4D8D] font-bold text-sm">
                        {(customer.name || "?")[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          {customer.name}
                          {customer.isBanned && (
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider border border-red-100">
                              Banned
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-sm text-gray-500 font-medium">
                      {customer.email}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                      <ShoppingBag size={12} strokeWidth={2.5} />
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <p className="text-lg font-black text-gray-900">
                      {formatPrice(customer.totalSpent, currency)}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <p className="text-sm text-gray-500 font-medium">
                      {format(new Date(customer.createdAt), "MMM d, yyyy")}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right whitespace-nowrap">
                    <CustomerActions 
                      userId={customer.id} 
                      isBanned={customer.isBanned} 
                      userName={customer.name} 
                    />
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                        <Users size={32} />
                      </div>
                      <p className="font-bold text-gray-500">
                        No customers found yet.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {customers.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200 mx-auto mb-4">
              <Users size={28} />
            </div>
            <p className="font-bold text-gray-500">No customers found yet.</p>
          </div>
        )}
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center border border-pink-100 shadow-sm text-[#FF4D8D] font-bold text-base">
                  {(customer.name || "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
                    {customer.name}
                    {customer.isBanned && (
                      <span className="inline-flex px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-wider border border-red-100">
                        Banned
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                </div>
              </div>
              <CustomerActions 
                userId={customer.id} 
                isBanned={customer.isBanned} 
                userName={customer.name} 
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-gray-900">
                  {customer.totalOrders}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Orders
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-gray-900">
                  {formatPrice(customer.totalSpent, currency)}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Spent
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-gray-900">
                  {format(new Date(customer.createdAt), "MMM yy")}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Joined
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
