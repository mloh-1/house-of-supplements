"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Eye,
  MoreHorizontal,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  variantInfo: string | null;
  product: {
    name: string;
    slug: string;
    images: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  guestName: string | null;
  guestPhone: string | null;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingPhone: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  } | null;
}

const STATUS_LABELS: Record<string, string> = {
  PRIMLJENO: "Primljeno",
  POSLATO: "Poslato",
  ISPORUCENO: "Isporučeno",
  OTKAZANO: "Otkazano",
};

const STATUS_COLORS: Record<string, string> = {
  PRIMLJENO: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  POSLATO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ISPORUCENO: "bg-lime/20 text-lime border-lime/30",
  OTKAZANO: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        const data = await response.json();
        alert(data.error || "Greška pri ažuriranju statusa");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Greška pri ažuriranju statusa");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.guestEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-800 w-48 animate-pulse" />
        <div className="bg-zinc-900 border border-zinc-800 h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Package className="h-6 w-6 text-lime" />
        <div>
          <h1 className="font-display text-2xl text-white">PORUDŽBINE</h1>
          <p className="text-zinc-500">Upravljajte porudžbinama kupaca</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Pretraži po broju, imenu ili emailu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-black border-zinc-700 text-zinc-300">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all" className="text-zinc-300 focus:bg-lime focus:text-black">
                Svi statusi
              </SelectItem>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="text-zinc-300 focus:bg-lime focus:text-black"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Porudžbina
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Kupac
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Datum
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Status
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-right">
                Ukupno
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                  Nema porudžbina za prikaz
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell>
                    <p className="font-mono text-lime font-bold">{order.orderNumber}</p>
                    <p className="text-xs text-zinc-500">{order.items.length} proizvod(a)</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-white">{order.shippingName}</p>
                    <p className="text-sm text-zinc-500">
                      {order.user?.email || order.guestEmail}
                    </p>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-bold uppercase border ${STATUS_COLORS[order.status] || "bg-zinc-800 text-zinc-500"}`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-bold text-lime">{formatPrice(order.total)}</p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 text-zinc-500 hover:text-lime transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem
                          className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Pregled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination info */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Prikazano <span className="text-lime font-bold">{filteredOrders.length}</span> od{" "}
            <span className="text-white">{orders.length}</span> porudžbina
          </p>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="font-display text-xl text-white">
                  PORUDŽBINA <span className="text-lime">{selectedOrder.orderNumber}</span>
                </h2>
                <p className="text-zinc-500 text-sm">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Status porudžbine
                </label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  disabled={updating}
                >
                  <SelectTrigger className="w-full bg-black border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="text-zinc-300 focus:bg-lime focus:text-black"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOrder.status === "PRIMLJENO" && (
                  <p className="text-xs text-zinc-500 mt-2">
                    * Kada promenite status na &quot;Poslato&quot;, zalihe proizvoda će se automatski umanjiti.
                  </p>
                )}
              </div>

              {/* Customer info */}
              <div className="bg-black/50 border border-zinc-800 p-4">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-lime" />
                  Podaci o kupcu
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <User className="h-4 w-4 text-zinc-600" />
                    <span className="text-white">{selectedOrder.shippingName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail className="h-4 w-4 text-zinc-600" />
                    <span className="text-white">
                      {selectedOrder.user?.email || selectedOrder.guestEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone className="h-4 w-4 text-zinc-600" />
                    <span className="text-white">{selectedOrder.shippingPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="h-4 w-4 text-zinc-600" />
                    <span className="text-white">
                      {selectedOrder.shippingAddress}, {selectedOrder.shippingPostal}{" "}
                      {selectedOrder.shippingCity}
                    </span>
                  </div>
                </div>
                {selectedOrder.userId ? (
                  <p className="text-xs text-lime mt-3">Registrovan korisnik</p>
                ) : (
                  <p className="text-xs text-zinc-500 mt-3">Gost korisnik</p>
                )}
              </div>

              {/* Order items */}
              <div>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-lime" />
                  Proizvodi
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => {
                    const variant = item.variantInfo ? JSON.parse(item.variantInfo) : null;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-black/50 border border-zinc-800 p-3"
                      >
                        <div>
                          <p className="text-white font-medium">{item.product.name}</p>
                          {variant && (
                            <p className="text-zinc-500 text-sm">
                              {variant.name}: {variant.value}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-white">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                          <p className="text-lime font-bold">
                            {formatPrice(item.quantity * item.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4">
                  <h3 className="font-bold text-yellow-400 mb-2">Napomena kupca</h3>
                  <p className="text-zinc-300">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Međuzbir</span>
                  <span className="text-white">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Dostava</span>
                  <span className="text-white">
                    {selectedOrder.shipping === 0 ? "Besplatno" : formatPrice(selectedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
                  <span className="text-white">Ukupno</span>
                  <span className="text-lime">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
