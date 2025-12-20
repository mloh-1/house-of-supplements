import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const stats = [
  {
    title: "Ukupna prodaja",
    value: formatPrice(1245680),
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Porudžbine",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Proizvodi",
    value: "234",
    change: "+3",
    trend: "up",
    icon: Package,
  },
  {
    title: "Korisnici",
    value: "1,847",
    change: "+24",
    trend: "up",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "HOS-ABC123",
    customer: "Marko Petrović",
    date: "Danas, 14:32",
    total: 6800,
    status: "pending",
  },
  {
    id: "HOS-DEF456",
    customer: "Ana Jovanović",
    date: "Danas, 12:15",
    total: 4200,
    status: "confirmed",
  },
  {
    id: "HOS-GHI789",
    customer: "Ivan Nikolić",
    date: "Juče, 18:45",
    total: 12500,
    status: "shipped",
  },
  {
    id: "HOS-JKL012",
    customer: "Jelena Stojanović",
    date: "Juče, 09:20",
    total: 3400,
    status: "delivered",
  },
  {
    id: "HOS-MNO345",
    customer: "Stefan Đorđević",
    date: "20.12.2024",
    total: 8900,
    status: "delivered",
  },
];

const topProducts = [
  { name: "100% Pure Whey 2270g", sales: 89, revenue: 542900 },
  { name: "BCAA EAA Strong 400g", sales: 67, revenue: 154100 },
  { name: "Kreatin Monohidrat 500g", sales: 54, revenue: 99900 },
  { name: "Omega 3 Fish Oil 120 caps", sales: 48, revenue: 71520 },
  { name: "Pre-Workout Extreme 300g", sales: 41, revenue: 102090 },
];

const statusStyles = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  delivered: "bg-lime/20 text-lime border-lime/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels = {
  pending: "Na čekanju",
  confirmed: "Potvrđeno",
  processing: "U obradi",
  shipped: "Poslato",
  delivered: "Dostavljeno",
  cancelled: "Otkazano",
};

export default function AdminDashboard() {
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
            <div className="flex items-center text-sm">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-lime" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span
                className={
                  stat.trend === "up" ? "text-lime" : "text-red-400"
                }
              >
                {stat.change}
              </span>
              <span className="text-zinc-600 ml-2">od prošlog meseca</span>
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
            <div className="space-y-4">
              {recentOrders.map((order) => (
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
                        statusStyles[order.status as keyof typeof statusStyles]
                      }`}
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {topProducts.map((product, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
