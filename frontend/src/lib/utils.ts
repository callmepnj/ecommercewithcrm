import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-gray-100 text-gray-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string, lang: "EN" | "HI" = "EN"): string {
  const labels: Record<string, { EN: string; HI: string }> = {
    PENDING: { EN: "Pending", HI: "लंबित" },
    CONFIRMED: { EN: "Confirmed", HI: "पुष्टि हुई" },
    PROCESSING: { EN: "Processing", HI: "प्रक्रिया में" },
    SHIPPED: { EN: "Shipped", HI: "भेज दिया" },
    OUT_FOR_DELIVERY: { EN: "Out for Delivery", HI: "डिलीवरी के लिए निकला" },
    DELIVERED: { EN: "Delivered", HI: "पहुँचा दिया" },
    CANCELLED: { EN: "Cancelled", HI: "रद्द" },
    RETURNED: { EN: "Returned", HI: "वापस" },
  };
  return labels[status]?.[lang] || status;
}
