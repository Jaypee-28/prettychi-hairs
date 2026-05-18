import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS class merge utility.
 * Used by Client Components throughout the app.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Recursively converts Prisma Decimal objects to plain numbers.
 * 
 * This is needed because Next.js Server Components cannot serialize
 * Decimal objects when passing props to Client Components.
 * 
 * Uses duck-typing instead of importing Prisma types so this file
 * stays safe for both Server AND Client component bundles.
 */
export function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)) as unknown as T;
  }

  if (typeof data === "object") {
    // Duck-type check for Prisma Decimal: has toNumber() and toFixed()
    if (
      typeof (data as any).toNumber === "function" &&
      typeof (data as any).toFixed === "function"
    ) {
      return Number((data as any).toNumber()) as unknown as T;
    }

    // Skip Date objects
    if (data instanceof Date) {
      return data;
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeData(value);
    }
    return sanitized as T;
  }

  return data;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCurrencySymbol(currency: string = "NGN") {
  const symbols: Record<string, string> = {
    GBP: "£",
    USD: "$",
    EUR: "€",
    NGN: "₦",
    CAD: "$",
    XAF: "XAF",
  };
  return symbols[currency] || symbols.NGN;
}

export function formatPrice(amount: number | string | any, currency: string = "NGN") {
  const num = typeof amount === "number" ? amount : parseFloat(amount?.toString() || "0");
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${num.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }
}
