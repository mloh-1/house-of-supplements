"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Loader2,
  HeartOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore, WishlistItem } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/ui/use-toast";

function formatPrice(price: number) {
  return price.toLocaleString("sr-RS") + " RSD";
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const getItems = useWishlistStore((state) => state.getItems);
  const items = getItems();
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/lista-zelja");
    }
  }, [status, router]);

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      quantity: 1,
    });
    toast({
      title: "Dodato u korpu",
      description: `${item.name} je dodat u vašu korpu.`,
    });
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Uklonjeno sa liste želja",
      description: "Proizvod je uklonjen sa vaše liste želja.",
    });
  };

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-lime animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 p-3 border border-zinc-800">
              <Heart className="h-6 w-6 text-lime" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-white">
                LISTA <span className="text-lime">ŽELJA</span>
              </h1>
              <p className="text-zinc-500">
                {items.length}{" "}
                {items.length === 1
                  ? "proizvod"
                  : items.length >= 2 && items.length <= 4
                  ? "proizvoda"
                  : "proizvoda"}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                clearWishlist();
                toast({
                  title: "Lista želja očišćena",
                  description: "Svi proizvodi su uklonjeni sa liste želja.",
                });
              }}
              className="text-zinc-500 hover:text-red-400 transition-colors text-sm flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Obriši sve</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <HeartOff className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="font-display text-2xl text-white mb-2">
              LISTA ŽELJA JE PRAZNA
            </h2>
            <p className="text-zinc-500 mb-6">
              Dodajte proizvode koje želite da sačuvate za kasnije
            </p>
            <Link href="/proizvodi">
              <Button className="bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider rounded-none">
                Pregledaj proizvode
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 hover:border-zinc-700 transition-colors"
              >
                {/* Product Image */}
                <Link
                  href={`/proizvod/${item.slug}`}
                  className="relative w-full md:w-32 h-32 flex-shrink-0 bg-black group"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                      Nema slike
                    </div>
                  )}
                  {item.salePrice && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1">
                      -
                      {Math.round(
                        ((item.price - item.salePrice) / item.price) * 100
                      )}
                      %
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/proizvod/${item.slug}`}
                      className="font-bold text-white hover:text-lime transition-colors text-lg"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-baseline gap-3 mt-2">
                      {item.salePrice ? (
                        <>
                          <span className="text-xl font-bold text-lime">
                            {formatPrice(item.salePrice)}
                          </span>
                          <span className="text-zinc-500 line-through">
                            {formatPrice(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-lime">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 justify-end">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider rounded-none flex-1 md:flex-none"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">U korpu</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveItem(item.productId)}
                    className="border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-400 rounded-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/proizvodi">
              <Button
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800 rounded-none"
              >
                Nastavi kupovinu
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/korpa">
                <Button className="bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider rounded-none">
                  Idi na korpu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
