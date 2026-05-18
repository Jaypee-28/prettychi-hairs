"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Settings2, 
  Image as ImageIcon,
  Layers,
  Sparkles,
  Info,
  Coins
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import { ProductWithRelations } from "@/modules/products/product.types";

interface EditProductFormProps {
  product: ProductWithRelations;
  categories: any[];
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState("GBP");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    basePrice: product.basePrice.toString(),
    categoryId: product.categoryId,
    thumbnailUrl: product.thumbnailUrl || "",
    isFeatured: product.isFeatured,
    tags: product.tags.join(", "),
    images: product.images.map(img => ({ url: img.url, sortOrder: img.sortOrder })),
    variants: product.variants.map(v => ({
      sku: v.sku || "",
      price: v.price ? v.price.toString() : "",
      stock: v.stock,
      options: v.options.map(opt => ({ attribute: opt.attribute, value: opt.value }))
    }))
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.currency) setCurrency(data.currency);
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, { url: "", sortOrder: formData.images.length }] });
  };

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { sku: "", price: "", stock: 0, options: [] }] });
  };

  const handleAddOptionToVariant = (vIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].options.push({ attribute: "", value: "" });
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      images: formData.images.filter(img => img.url),
      variants: formData.variants
        .map((v) => {
          // Deduplicate options by attribute name (case-insensitive)
          const uniqueOptions = v.options
            .filter(opt => opt.attribute && opt.value)
            .reduce((acc: any[], current) => {
              const exists = acc.find(
                item => item.attribute.toLowerCase().trim() === current.attribute.toLowerCase().trim()
              );
              if (!exists) acc.push(current);
              return acc;
            }, []);

          return {
            ...v,
            price: v.price ? parseFloat(v.price) : undefined,
            stock: parseInt(v.stock.toString(), 10),
            options: uniqueOptions
          };
        })
        .filter(v => v.options.length > 0) // Only send variants that have at least one attribute
    };

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const err = await res.json();
        alert("Error: " + JSON.stringify(err));
      }
    } catch (err) {
      alert("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all mb-8 font-bold text-sm"
      >
        <div className="p-2 bg-white rounded-xl border border-gray-100 group-hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={16} strokeWidth={3} />
        </div>
        Back to Products
      </button>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Edit Product
            <Sparkles className="text-amber-400" size={24} />
          </h1>
          <p className="text-gray-500 font-semibold mt-2 text-lg">Update your product details and variants.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Basic Details */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-[#FF4D8D]">
                <Info size={20} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-black text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-8 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
                <div className="space-y-3 min-w-0">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Product Name</label>
                  <input required type="text" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 min-w-0" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Brazilian Body Wave Frontal" />
                </div>
                <div className="space-y-3 min-w-0">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
                    Base Price ({currency})
                  </label>
                  <input required type="number" step="0.01" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 min-w-0" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-3 min-w-0">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Description</label>
                <textarea required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 min-h-[160px] min-w-0" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the hair quality, source, and maintenance..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
                <div className="space-y-3 min-w-0">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Category</label>
                  <select required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 appearance-none min-w-0" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="">Select a category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3 min-w-0">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Tags (comma separated)</label>
                  <input type="text" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 min-w-0" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="Best Seller, New Arrival" />
                </div>
              </div>
            </div>
          </section>

          {/* Variants Section */}
          <section className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 md:space-y-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-50 pb-6 mb-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Layers size={20} strokeWidth={3} />
                </div>
                <h2 className="text-xl font-black text-gray-900">Product Variants</h2>
              </div>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition font-bold text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} strokeWidth={3} />
                Add Variant
              </button>
            </div>

            <div className="space-y-6 md:space-y-8">
              {formData.variants.map((v, vIndex) => (
                <div key={vIndex} className="p-5 md:p-8 border-2 border-gray-50 rounded-[1.5rem] md:rounded-[2rem] bg-gray-50/50 space-y-6 md:space-y-8 relative group/variant">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newVariants = [...formData.variants];
                      newVariants.splice(vIndex, 1);
                      setFormData({...formData, variants: newVariants});
                    }}
                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 p-2.5 bg-white border-2 border-red-50 rounded-xl text-red-500 transition-all shadow-lg hover:bg-red-500 hover:text-white z-10"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 min-w-0">
                    <div className="space-y-2 min-w-0">
                      <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">SKU <span className="text-gray-300 font-semibold normal-case">(optional)</span></label>
                      <input type="text" placeholder="Auto-generated if empty" className="w-full px-4 py-3.5 md:py-3 rounded-xl bg-white border border-gray-200 focus:border-[#FF4D8D] outline-none transition-all font-bold text-sm placeholder:text-gray-300 placeholder:font-medium min-w-0" value={v.sku} onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[vIndex].sku = e.target.value;
                        setFormData({...formData, variants: newVariants});
                      }} />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Price Override ({currency})</label>
                      <input type="number" step="0.01" placeholder="Leave blank for base" className="w-full px-4 py-3.5 md:py-3 rounded-xl bg-white border border-gray-200 focus:border-[#FF4D8D] outline-none transition-all font-bold text-sm min-w-0" value={v.price} onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[vIndex].price = e.target.value;
                        setFormData({...formData, variants: newVariants});
                      }} />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Stock Level</label>
                      <input type="number" className="w-full px-4 py-3.5 md:py-3 rounded-xl bg-white border border-gray-200 focus:border-[#FF4D8D] outline-none transition-all font-bold text-sm min-w-0" value={v.stock} onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[vIndex].stock = parseInt(e.target.value) || 0;
                        setFormData({...formData, variants: newVariants});
                      }} />
                    </div>
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 space-y-4 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        Attributes
                        <span className="text-gray-300 font-medium">({v.options.length})</span>
                      </p>
                      <button type="button" onClick={() => handleAddOptionToVariant(vIndex)} className="text-[10px] md:text-xs font-black text-[#FF4D8D] hover:underline underline-offset-4">
                        + Add Attribute
                      </button>
                    </div>
                    
                    <div className="space-y-4 md:space-y-3 min-w-0">
                      {v.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center p-4 sm:p-0 bg-gray-50 sm:bg-transparent rounded-xl sm:rounded-none animate-in fade-in slide-in-from-top-2 duration-300 min-w-0">
                          <div className="sm:w-1/3 min-w-0">
                            <select className="w-full px-4 py-3.5 sm:py-3 rounded-xl bg-white sm:bg-gray-50 border sm:border-transparent focus:border-[#FF4D8D] outline-none transition-all font-bold text-xs appearance-none min-w-0" value={opt.attribute} onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].options[oIndex].attribute = e.target.value;
                              setFormData({...formData, variants: newVariants});
                            }}>
                              <option value="">Type</option>
                              <option value="Length">Length</option>
                              <option value="Color">Color</option>
                              <option value="Texture">Texture</option>
                              <option value="Density">Density</option>
                            </select>
                          </div>
                          <div className="flex gap-2 flex-1 items-center min-w-0">
                            <input type="text" placeholder="Value (e.g. 14 inches)" className="flex-1 px-4 py-3.5 sm:py-3 rounded-xl bg-white sm:bg-gray-50 border sm:border-transparent focus:border-[#FF4D8D] outline-none transition-all font-bold text-xs min-w-0" value={opt.value} onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].options[oIndex].value = e.target.value;
                              setFormData({...formData, variants: newVariants});
                            }} />
                            <button type="button" onClick={() => {
                              const newVariants = [...formData.variants];
                              newVariants[vIndex].options.splice(oIndex, 1);
                              setFormData({...formData, variants: newVariants});
                            }} className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors p-3 sm:p-2 bg-white sm:bg-transparent border sm:border-none rounded-xl sm:rounded-none flex items-center justify-center">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {v.options.length === 0 && (
                        <p className="text-[10px] font-bold text-gray-400 italic text-center py-4">No attributes defined. Add "Length" or "Color" to differentiate this variant.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {formData.variants.length === 0 && (
                <div className="py-16 border-2 border-dashed border-gray-100 rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col items-center gap-3 bg-gray-50/20">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                    <Layers size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No variants added yet</p>
                    <p className="text-xs text-gray-300 font-medium">Add variants for different lengths or colors.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Media Section */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <ImageIcon size={20} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-black text-gray-900">Media</h2>
            </div>

            <div className="space-y-10">
              <ImageUpload 
                label="Main Thumbnail"
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({...formData, thumbnailUrl: url})}
                onRemove={() => setFormData({...formData, thumbnailUrl: ""})}
              />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Gallery Images</label>
                  <button type="button" onClick={handleAddImage} className="text-xs font-black text-[#FF4D8D] hover:underline underline-offset-4">
                    + Add New
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {formData.images.map((img, index) => (
                    <ImageUpload 
                      key={index}
                      value={img.url}
                      onChange={(url) => {
                        const newImgs = [...formData.images];
                        newImgs[index].url = url;
                        setFormData({...formData, images: newImgs});
                      }}
                      onRemove={() => {
                        const newImgs = [...formData.images];
                        newImgs.splice(index, 1);
                        setFormData({...formData, images: newImgs});
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Visibility Section */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
             <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Settings2 size={20} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-black text-gray-900">Settings</h2>
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="font-black text-gray-900 text-sm tracking-tight">Featured Product</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Show on homepage</p>
              </div>
              <input 
                type="checkbox" 
                className="w-6 h-6 rounded-lg text-[#FF4D8D] focus:ring-[#FF4D8D] border-gray-300 transition-all cursor-pointer"
                checked={formData.isFeatured} 
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} 
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.name}
              className="w-full bg-[#FF4D8D] text-white p-8 rounded-[2rem] hover:bg-[#E6457E] transition shadow-xl shadow-pink-100 font-black text-2xl flex items-center justify-center gap-4 disabled:opacity-50 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={28} strokeWidth={3} />
              ) : (
                <>
                  <Save size={28} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                  Update Product
                </>
              )}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}
