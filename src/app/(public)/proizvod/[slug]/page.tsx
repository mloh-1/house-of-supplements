"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/components/ui/use-toast";

interface VariantOption {
  id: string;
  value: string;
  price: number | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  price: number;
  salePrice: number | null;
  sku: string | null;
  stock?: number;
  inStock: boolean;
  isAdmin: boolean;
  images: string[];
  featured: boolean;
  active: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  variants: Record<string, VariantOption[]>;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session, status } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const isLoggedIn = status === "authenticated" && session?.user;

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Proizvod nije pronađen");
          return;
        }

        setProduct(data);
      } catch {
        setError("Došlo je do greške prilikom učitavanja proizvoda");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-lime animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Učitavanje proizvoda...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-zinc-950 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-red-500" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-red-500" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-red-500" />

            <h1 className="font-display text-2xl text-white mb-4">
              PROIZVOD NIJE PRONAĐEN
            </h1>
            <p className="text-zinc-400 mb-6">{error}</p>
            <Link href="/">
              <button className="bg-lime text-black font-bold px-6 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors">
                Nazad na početnu
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount =
    product.salePrice && product.salePrice < product.price
      ? calculateDiscount(product.price, product.salePrice)
      : 0;

  const effectivePrice = product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;

  // Check if all required variants are selected
  const variantNames = Object.keys(product.variants || {});
  const allVariantsSelected = variantNames.every(name => selectedVariants[name]);

  // Build variant info string for cart
  const variantInfo = variantNames.length > 0 && allVariantsSelected
    ? variantNames.map(name => `${name}: ${selectedVariants[name]}`).join(", ")
    : undefined;

  // Find the selected variant ID (for single variant category products)
  const getSelectedVariantId = (): string | undefined => {
    if (variantNames.length === 0 || !allVariantsSelected) return undefined;

    // For products with a single variant category, find the variant ID
    if (variantNames.length === 1) {
      const variantName = variantNames[0];
      const selectedValue = selectedVariants[variantName];
      const variant = product.variants[variantName]?.find(v => v.value === selectedValue);
      return variant?.id;
    }

    // For products with multiple variant categories, we can't track individual variant stock
    // In this case, we only track main product stock
    return undefined;
  };

  const selectedVariantId = getSelectedVariantId();

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast({
        title: "Nema na stanju",
        description: "Ovaj proizvod trenutno nije dostupan.",
        variant: "destructive",
      });
      return;
    }

    // Check if variants are required but not selected
    if (variantNames.length > 0 && !allVariantsSelected) {
      toast({
        title: "Izaberite opcije",
        description: "Molimo izaberite sve opcije pre dodavanja u korpu.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.images[0] || "/placeholder-product.jpg",
      quantity,
      variantInfo,
      variantId: selectedVariantId,
    });

    toast({
      title: "Dodato u korpu",
      description: `${product.name}${variantInfo ? ` (${variantInfo})` : ""} je dodat u vašu korpu.`,
    });
  };

  const inWishlist = product && isLoggedIn ? isInWishlist(product.id) : false;

  const handleWishlist = () => {
    if (!product) return;

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
        image: product.images[0] || "/placeholder-product.jpg",
      });
      toast({
        title: "Dodato na listu želja",
        description: `${product.name} je dodat na vašu listu želja.`,
      });
    }
  };

  // Build breadcrumb path
  const parentCategory = product.category?.parent;
  const category = product.category;

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-zinc-500 hover:text-lime transition-colors">
              Početna
            </Link>
            {parentCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-700" />
                <Link
                  href={`/proizvodi?kategorija=${parentCategory.slug}`}
                  className="text-zinc-500 hover:text-lime transition-colors"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}
            {category && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-700" />
                <Link
                  href={parentCategory
                    ? `/proizvodi?kategorija=${parentCategory.slug}&potkategorija=${category.slug}`
                    : `/proizvodi?kategorija=${category.slug}`
                  }
                  className="text-zinc-500 hover:text-lime transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 text-zinc-700" />
            <span className="text-lime font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-lime" />

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-black border border-zinc-800 overflow-hidden group">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-grid opacity-10" />

                  {product.images.length > 0 ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-contain p-8 relative z-10 group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                      Nema slike
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-lime text-black font-bold text-lg px-4 py-2 clip-corner">
                        -{discount}%
                      </div>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 h-20 flex-shrink-0 border-2 transition-all bg-black ${
                          selectedImage === index
                            ? "border-lime"
                            : "border-zinc-800 hover:border-zinc-600"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-contain p-2"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  {product.brand && (
                    <>
                      <Link
                        href={`/proizvodi?brend=${product.brand.slug}`}
                        className="text-sm text-lime hover:underline font-bold uppercase tracking-wider"
                      >
                        {product.brand.name}
                      </Link>
                      <span className="text-zinc-700">|</span>
                    </>
                  )}
                  {product.sku && (
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-4xl text-white mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-zinc-800">
                  {discount > 0 ? (
                    <>
                      <span className="font-display text-4xl text-lime">
                        {formatPrice(product.salePrice!)}
                      </span>
                      <span className="text-xl text-zinc-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 text-sm font-bold">
                        UŠTEDA {formatPrice(product.price - product.salePrice!)}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-4xl text-lime">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Stock status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="inline-flex items-center gap-2 bg-lime/10 text-lime px-4 py-2 border border-lime/30">
                      <Check className="h-4 w-4" />
                      <span className="font-bold text-sm uppercase tracking-wider">
                        Na stanju{product.isAdmin && product.stock !== undefined ? ` (${product.stock} kom)` : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 border border-red-500/30">
                      <span className="font-bold text-sm uppercase tracking-wider">
                        Nije na stanju
                      </span>
                    </div>
                  )}
                </div>

                {/* Variant Selection */}
                {Object.keys(product.variants || {}).length > 0 && (
                  <div className="mb-6 space-y-4">
                    {Object.entries(product.variants).map(([variantName, options]) => (
                      <div key={variantName}>
                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                          {variantName}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [variantName]: option.value }))}
                              disabled={option.stock === 0}
                              className={`px-4 py-2 border font-medium transition-all ${
                                selectedVariants[variantName] === option.value
                                  ? "border-lime bg-lime/10 text-lime"
                                  : option.stock === 0
                                    ? "border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed line-through"
                                    : "border-zinc-700 bg-black text-zinc-300 hover:border-lime hover:text-lime"
                              }`}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Short description */}
                {product.shortDesc && (
                  <p className="text-zinc-400 mb-6">{product.shortDesc}</p>
                )}

                {/* Quantity and Add to cart */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center border border-zinc-700 bg-black">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-lime"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-14 text-center font-bold text-white text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-lime"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 md:flex-none bg-lime text-black font-bold text-lg px-8 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Dodaj u korpu
                  </button>

                  {isLoggedIn && (
                    <button
                      onClick={handleWishlist}
                      className={cn(
                        "h-12 w-12 border bg-black transition-colors flex items-center justify-center",
                        inWishlist
                          ? "border-lime text-lime"
                          : "border-zinc-700 text-zinc-400 hover:border-lime hover:text-lime"
                      )}
                    >
                      <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                    </button>
                  )}

                  <button className="h-12 w-12 border border-zinc-700 bg-black text-zinc-400 hover:border-lime hover:text-lime transition-colors flex items-center justify-center">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Features */}
                <div className="bg-black border border-zinc-800 p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-lime/10 border border-lime/30 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-lime" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Besplatna dostava</div>
                      <div className="text-zinc-500 text-sm">Za porudžbine preko 4.000 RSD</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-lime/10 border border-lime/30 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-lime" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">100% originalni proizvodi</div>
                      <div className="text-zinc-500 text-sm">Garantovana autentičnost</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-lime/10 border border-lime/30 flex items-center justify-center">
                      <RotateCcw className="h-5 w-5 text-lime" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Povrat robe</div>
                      <div className="text-zinc-500 text-sm">U roku od 14 dana</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product description */}
      {product.description && (
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b border-zinc-800 rounded-none h-auto p-0 bg-transparent mb-6">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-lime data-[state=active]:text-lime data-[state=active]:bg-transparent text-zinc-400 px-6 py-3 uppercase tracking-wider font-bold"
                  >
                    Opis proizvoda
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-2">
                  <div
                    className="prose prose-invert prose-lime max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
