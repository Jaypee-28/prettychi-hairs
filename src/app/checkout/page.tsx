"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CreditCard, 
  Loader2, 
  ShieldCheck, 
  Truck,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useSettings } from "@/components/providers/settings-provider";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { currency } = useSettings();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(2000); // Default Nigeria
  const [settingsFee, setSettingsFee] = useState(2000);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    state: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data && data.ukDeliveryFee !== undefined) {
            const fee = Number(data.ukDeliveryFee);
            setDeliveryFee(fee);
            setSettingsFee(fee);
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (items.length === 0 && !loading && !isSuccess) {
      router.push("/products");
    }
  }, [items, loading, isSuccess, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update delivery fee if country changes
    if (name === "country") {
      setDeliveryFee(value === "Nigeria" ? settingsFee : settingsFee);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variantSnapshot: item.attributes,
          imageUrl: item.image,
          slug: item.slug
        }))
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create order");

      toast.success("Order created successfully!");
      setIsSuccess(true);
      clearCart();
      router.push(`/checkout/payment?orderId=${data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-[#FBFCFD] pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#FF4D8D]">
              <Sparkles size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Checkout</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              FINAL <span className="text-[#FF4D8D]">STEP</span>
            </h1>
          </div>
          <Link href="/cart" className="inline-flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} strokeWidth={3} />
            Back to Cart
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
          
          {/* Left: Delivery Form */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Contact Info */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="jane@example.com" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="+234 803 123 4567" />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Delivery Address</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                  <select name="country" value={formData.country} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 appearance-none">
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other International</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="Enugu" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State / Province</label>
                  <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="Enugu State" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Line 1</label>
                  <input required name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="House number and street name" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Line 2 (Optional)</label>
                  <input name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="Apartment, suite, etc." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                  <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900" placeholder="400102" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-pink-50/20 sticky top-10 space-y-10">
              <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                <h3 className="text-xl font-black text-gray-900 uppercase">Cart Summary</h3>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{totalItems} ITEMS</span>
              </div>

              {/* Items List */}
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate uppercase">{item.name}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">Qty: {item.quantity}</p>
                      <div className="flex gap-2 mt-1">
                        {Object.values(item.attributes).map((v, i) => (
                          <span key={i} className="text-[8px] font-black text-[#FF4D8D] uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-md">{v}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-black text-gray-900">{formatPrice(item.price * item.quantity, currency)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{formatPrice(totalPrice, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>Delivery</span>
                    <Truck size={14} className="text-[#FF4D8D]" />
                  </div>
                  <span className="text-gray-900 font-black">{formatPrice(deliveryFee, currency)}</span>
                </div>
                <div className="h-px bg-gray-50 w-full my-4"></div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                    <p className="text-4xl font-black text-[#FF4D8D] leading-none">{formatPrice(finalTotal, currency)}</p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="space-y-6">
                <button 
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-base flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-70 uppercase tracking-widest"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Place Order
                    </>
                  )}
                </button>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-green-500" />
                    Encrypted Snapshot Created
                  </p>
                  <p className="text-[9px] text-gray-400 text-center leading-relaxed font-medium">
                    By placing this order, you agree to Pretty Chi Hairs's <br/> Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
