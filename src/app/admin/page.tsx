"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalSales: number;
    ordersCount: number;
    productsCount: number;
    usersCount: number;
  };
  recentOrders: {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: string;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
}

const statusStyles: Record<string, string> = {
  PRIMLJENO: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  POSLATO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ISPORUCENO: "bg-lime/20 text-lime border-lime/30",
  OTKAZANO: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  PRIMLJENO: "Primljeno",
  POSLATO: "Poslato",
  ISPORUCENO: "Isporučeno",
  OTKAZANO: "Otkazano",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const time = date.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" });

    if (orderDate.getTime() === today.getTime()) {
      return `Danas, ${time}`;
    } else if (orderDate.getTime() === yesterday.getTime()) {
      return `Juče, ${time}`;
    } else {
      return date.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-800 w-48 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 h-32 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-zinc-900 border border-zinc-800 h-96 animate-pulse" />
          <div className="bg-zinc-900 border border-zinc-800 h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Ukupna prodaja",
      value: formatPrice(data?.stats.totalSales || 0),
      icon: TrendingUp,
    },
    {
      title: "Porudžbine",
      value: (data?.stats.ordersCount || 0).toString(),
      icon: ShoppingCart,
    },
    {
      title: "Proizvodi",
      value: (data?.stats.productsCount || 0).toString(),
      icon: Package,
    },
    {
      title: "Korisnici",
      value: (data?.stats.usersCount || 0).toString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Zap className="h-6 w-6 text-lime" />
        <div>
          <h1 className="font-display text-2xl text-white">DASHBOARD</h1>
          <p className="text-zinc-500">Pregled poslovanja i statistike</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-zinc-900 border border-zinc-800 p-6 relative group hover:border-zinc-700 transition-colors"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lime opacity-50" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <stat.icon className="h-5 w-5 text-zinc-600" />
            </div>
            <div className="font-display text-3xl text-white mb-2">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="bg-zinc-900 border border-zinc-800 relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
          <div className="p-6 border-b border-zinc-800">
            <h2 className="font-display text-lg text-white flex items-center gap-2">
              <span className="text-lime">//</span> NEDAVNE PORUDŽBINE
            </h2>
          </div>
          <div className="p-6">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-white">{order.id}</p>
                      <p className="text-sm text-zinc-500">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lime">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider border ${
                          statusStyles[order.status] || "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Nema porudžbina
              </div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-zinc-900 border border-zinc-800 relative">
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
          <div className="p-6 border-b border-zinc-800">
            <h2 className="font-display text-lg text-white flex items-center gap-2">
              <span className="text-lime">//</span> NAJPRODAVANIJI PROIZVODI
            </h2>
          </div>
          <div className="p-6">
            {data?.topProducts && data.topProducts.length > 0 ? (
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-4 py-3 border-b border-zinc-800 last:border-0"
                  >
                    <span className="w-8 h-8 bg-lime/10 border border-lime/30 flex items-center justify-center text-sm font-bold text-lime">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {product.sales} prodaja
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lime">
                        {formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Nema podataka o prodaji
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
