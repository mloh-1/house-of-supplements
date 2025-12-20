"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const FREE_SHIPPING_MIN = 4000;
const SHIPPING_COST = 350;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-zinc-950 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 h-32" />
                ))}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remainingForFreeShipping = FREE_SHIPPING_MIN - subtotal;

  if (items.length === 0) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-zinc-900 border border-zinc-800 p-12 max-w-lg mx-auto relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

            <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-zinc-600" />
            </div>
            <h1 className="font-display text-2xl text-white mb-3">
              VAŠA KORPA JE PRAZNA
            </h1>
            <p className="text-zinc-500 mb-8">
              Dodajte proizvode u korpu da biste nastavili sa kupovinom.
            </p>
            <Link href="/">
              <button className="bg-lime text-black font-bold px-8 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors inline-flex items-center gap-2">
                Nastavi kupovinu
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Zap className="h-6 w-6 text-lime" />
            <h1 className="font-display text-3xl md:text-4xl text-white">
              KORPA <span className="text-lime">({items.length})</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider font-bold"
          >
            Isprazni korpu
          </button>
        </div>

        {/* Free shipping progress */}
        {remainingForFreeShipping > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="h-5 w-5 text-lime" />
              <p className="text-zinc-400">
                Dodajte još{" "}
                <span className="font-bold text-lime">
                  {formatPrice(remainingForFreeShipping)}
                </span>{" "}
                za besplatnu dostavu!
              </p>
            </div>
            <div className="bg-zinc-800 h-2 overflow-hidden">
              <div
                className="bg-lime h-full transition-all"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex gap-4">
                  <Link
                    href={`/proizvod/${item.productId}`}
                    className="relative w-24 h-24 md:w-32 md:h-32 bg-black border border-zinc-800 flex-shrink-0 overflow-hidden group"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/proizvod/${item.productId}`}
                          className="font-bold text-white hover:text-lime transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-zinc-500 mt-1">
                            {item.variant.name}: <span className="text-zinc-400">{item.variant.value}</span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-zinc-700 bg-black">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-lime"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-lime"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.salePrice && item.salePrice < item.price ? (
                          <>
                            <p className="font-display text-xl text-lime">
                              {formatPrice(item.salePrice * item.quantity)}
                            </p>
                            <p className="text-sm text-zinc-500 line-through">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </>
                        ) : (
                          <p className="font-display text-xl text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24 relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

              <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                <span className="text-lime">//</span> PREGLED PORUDŽBINE
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Međuzbir</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Dostava</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-lime font-bold">Besplatno</span>
                    ) : (
                      <span className="text-white">{formatPrice(shipping)}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-800 my-4" />

              <div className="flex justify-between mb-6">
                <span className="text-white font-bold uppercase tracking-wider">Ukupno</span>
                <span className="font-display text-2xl text-lime">{formatPrice(total)}</span>
              </div>

              {/* Promo code */}
              <div className="mb-6">
                <label className="text-sm text-zinc-500 mb-2 block uppercase tracking-wider font-bold">
                  Promo kod
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Unesite kod"
                    className="flex-1 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                  />
                  <button className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:border-lime hover:text-lime transition-colors font-bold uppercase text-sm">
                    Primeni
                  </button>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-lime text-black font-bold py-4 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 text-lg">
                  Nastavi na plaćanje
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>

              <Link href="/" className="block mt-4">
                <button className="w-full border border-zinc-700 text-zinc-400 hover:border-lime hover:text-lime py-3 transition-colors font-bold uppercase tracking-wider">
                  Nastavi kupovinu
                </button>
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Shield className="h-4 w-4 text-lime" />
                  <span>Sigurna kupovina</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Zap className="h-4 w-4 text-lime" />
                  <span>100% originalno</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
