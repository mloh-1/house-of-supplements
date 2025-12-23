"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    images: string[];
    category?: {
      name: string;
      slug: string;
    };
    stock: number;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const isLoggedIn = status === "authenticated" && session?.user;

  const discount =
    product.salePrice && product.salePrice < product.price
      ? calculateDiscount(product.price, product.salePrice)
      : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const inWishlist = mounted && isLoggedIn && isInWishlist(product.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/proizvod/${product.slug}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Uklonjeno sa liste želja",
        description: `${product.name} je uklonjen sa vaše liste želja.`,
      });
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice || undefined,
        image: product.images[0] || "/placeholder.jpg",
      });
      toast({
        title: "Dodato na listu želja",
        description: `${product.name} je dodat na vašu listu želja.`,
      });
    }
  };

  return (
    <div
      className={cn(
        "group bg-zinc-900 border border-zinc-800 overflow-hidden product-card hover:border-lime/30 transition-all duration-300",
        className
      )}
    >
      <Link href={`/proizvod/${product.slug}`}>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-black">
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain p-4 product-image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-lime/20 group-hover:border-lime/50 transition-colors" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-lime text-black font-bold rounded-none px-2 py-1 text-xs">
                -{discount}%
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-red-500/90 text-white font-bold rounded-none px-2 py-1 text-xs">
                Rasprodato
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500/90 text-white font-bold rounded-none px-2 py-1 text-xs flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Poslednji
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            {isLoggedIn && (
              <Button
                size="icon"
                onClick={handleWishlist}
                className={cn(
                  "h-9 w-9 rounded-none border",
                  inWishlist
                    ? "bg-lime text-black border-lime hover:bg-lime-500"
                    : "bg-zinc-800/90 hover:bg-lime hover:text-black text-zinc-300 border-zinc-700"
                )}
              >
                <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
              </Button>
            )}
            <Button
              size="icon"
              className="h-9 w-9 bg-zinc-800/90 hover:bg-lime hover:text-black text-zinc-300 rounded-none border border-zinc-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* View product button - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <Button
              className="w-full bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider rounded-none"
              onClick={handleViewProduct}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Rasprodato" : "Pogledaj proizvod"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 border-t border-zinc-800">
          {product.category && (
            <p className="text-xs font-bold text-lime uppercase tracking-wider mb-1.5">
              {product.category.name}
            </p>
          )}
          <h3 className="font-medium text-white line-clamp-2 mb-3 group-hover:text-lime transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            {discount > 0 ? (
              <>
                <span className="text-xl font-bold text-lime">
                  {formatPrice(product.salePrice!)}
                </span>
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
