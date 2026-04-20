"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminService";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import { Users, Phone, Mail, ShoppingBag, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  createdAt: string;
  _count?: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const language = useAuthStore((s) => s.language);
  const isHi = language === "HI";

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllUsers(page);
      setUsers(data.users || data);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      // silent
    }
    setLoading(false);
  };

  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-heading font-bold text-gray-800 mb-8">
        👥 {isHi ? "ग्राहक" : "Customers"}
      </h1>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={isHi ? "🔍 ग्राहक खोजें..." : "🔍 Search customers..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 text-xl border-2 border-cream-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 bg-white"
        />
      </div>

      {/* ───── USER CARDS ───── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-cream-200 p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-cream-200 rounded w-1/2" />
                  <div className="h-5 bg-cream-200 rounded w-1/3" />
                </div>
              </div>
            ))
          : filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl border-2 border-cream-200 p-5 hover:border-gold-300 hover:shadow-md transition-all"
              >
                {/* Name + role badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-maroon-50 flex items-center justify-center">
                      <Users size={22} className="text-maroon-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-maroon-50 text-maroon-500 border border-maroon-200"
                            : "bg-cream-100 text-gray-500 border border-cream-200"
                        }`}
                      >
                        {user.role === "ADMIN" ? (isHi ? "एडमिन" : "Admin") : (isHi ? "ग्राहक" : "Customer")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-3 text-base text-gray-600">
                    <Phone size={18} className="text-blue-500" />
                    <span className="font-semibold">{user.phone}</span>
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-3 text-base text-gray-600">
                      <Mail size={18} className="text-green-500" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-6 pt-3 border-t border-cream-200">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-purple-500" />
                    <span className="text-lg font-bold text-purple-600">
                      {user._count?.orders ?? 0}
                    </span>
                    <span className="text-base text-gray-500">
                      {isHi ? "ऑर्डर" : "orders"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-orange-500" />
                    <span className="text-base text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border-2 border-cream-200 hover:border-gold-400 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-xl font-bold text-gray-600 px-4">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border-2 border-cream-200 hover:border-gold-400 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
