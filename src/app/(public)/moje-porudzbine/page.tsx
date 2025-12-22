"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
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
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingPhone: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PRIMLJENO: {
    label: "Primljeno",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <Clock className="h-4 w-4" />,
  },
  POSLATO: {
    label: "Poslato",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: <Truck className="h-4 w-4" />,
  },
  ISPORUCENO: {
    label: "Isporučeno",
    color: "bg-lime/20 text-lime border-lime/30",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  OTKAZANO: {
    label: "Otkazano",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: <XCircle className="h-4 w-4" />,
  },
};

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseVariantInfo(variantInfo: string | null): { name: string; value: string } | null {
  if (!variantInfo) return null;
  try {
    return JSON.parse(variantInfo);
  } catch {
    return null;
  }
}

export default function MyOrdersPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/moje-porudzbine");
    } else if (authStatus === "authenticated") {
      fetchOrders();
    }
  }, [authStatus, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
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

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-lime animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">Učitavanje porudžbina...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Package className="h-8 w-8 text-lime" />
          <div>
            <h1 className="font-display text-3xl text-white">MOJE PORUDŽBINE</h1>
            <p className="text-zinc-500">Pregled istorije vaših porudžbina</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

            <ShoppingBag className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h2 className="font-display text-xl text-white mb-2">NEMATE PORUDŽBINA</h2>
            <p className="text-zinc-500 mb-6">
              Još uvek niste napravili nijednu porudžbinu.
            </p>
            <Link href="/">
              <button className="bg-lime text-black font-bold px-8 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors">
                Započni kupovinu
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const status = statusConfig[order.status] || statusConfig.PRIMLJENO;

              return (
                <div
                  key={order.id}
                  className="bg-zinc-900 border border-zinc-800 overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex w-12 h-12 bg-lime/10 border border-lime/30 items-center justify-center">
                        <Package className="h-6 w-6 text-lime" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold uppercase border ${status.color}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                      <span className="font-display text-xl text-lime">
                        {formatPrice(order.total)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {/* Order Details (Expanded) */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800">
                      {/* Items */}
                      <div className="p-4 md:p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <span className="text-lime">//</span> STAVKE
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item) => {
                            const images = parseImages(item.product.images);
                            const variant = parseVariantInfo(item.variantInfo);

                            return (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 p-3 bg-black border border-zinc-800"
                              >
                                <Link
                                  href={`/proizvod/${item.product.slug}`}
                                  className="relative w-16 h-16 bg-zinc-900 flex-shrink-0 overflow-hidden"
                                >
                                  {images[0] ? (
                                    <Image
                                      src={images[0]}
                                      alt={item.product.name}
                                      fill
                                      className="object-contain p-1"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <Package className="h-6 w-6 text-zinc-600" />
                                    </div>
                                  )}
                                </Link>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/proizvod/${item.product.slug}`}
                                    className="font-medium text-white hover:text-lime transition-colors line-clamp-1"
                                  >
                                    {item.product.name}
                                  </Link>
                                  {variant && (
                                    <p className="text-sm text-zinc-500">
                                      {variant.name}: {variant.value}
                                    </p>
                                  )}
                                  <p className="text-sm text-zinc-400">
                                    {item.quantity} x {formatPrice(item.price)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-white">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Shipping & Summary */}
                      <div className="grid md:grid-cols-2 gap-6 p-4 md:p-6 border-t border-zinc-800 bg-black/50">
                        {/* Shipping Info */}
                        <div>
                          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-lime">//</span> DOSTAVA
                          </h3>
                          <div className="text-sm text-zinc-400 space-y-2">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-zinc-500" />
                              {order.shippingName}
                            </p>
                            <p className="pl-6">
                              {order.shippingAddress}, {order.shippingCity} {order.shippingPostal}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-zinc-500" />
                              {order.shippingPhone}
                            </p>
                          </div>
                          {order.notes && (
                            <div className="mt-3 p-3 bg-zinc-900 border border-zinc-800">
                              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Napomena:</p>
                              <p className="text-sm text-zinc-400">{order.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-lime">//</span> UKUPNO
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-zinc-400">
                              <span>Međuzbir</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                              <span>Dostava</span>
                              <span>
                                {order.shipping === 0 ? (
                                  <span className="text-lime">Besplatno</span>
                                ) : (
                                  formatPrice(order.shipping)
                                )}
                              </span>
                            </div>
                            <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between">
                              <span className="font-bold text-white">Ukupno</span>
                              <span className="font-display text-xl text-lime">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Back to account link */}
        <div className="mt-8">
          <Link
            href="/moj-nalog"
            className="text-zinc-400 hover:text-lime transition-colors"
          >
            ← Nazad na moj nalog
          </Link>
        </div>
      </div>
    </div>
  );
}
