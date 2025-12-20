"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/products/product-card";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/ui/use-toast";

// Demo product data
const product = {
  id: "1",
  name: "100% Pure Whey 2270g",
  slug: "100-pure-whey-2270g",
  price: 7250,
  salePrice: 6100,
  sku: "BT-PW-2270",
  description: `
    <p>100% Pure Whey je visokokvalitetni whey protein koncentrat koji sadrži 78% proteina po porciji. Idealan je za sve koji žele da povećaju unos proteina i podrže rast mišića.</p>

    <h4>Karakteristike:</h4>
    <ul>
      <li>78% proteina po porciji</li>
      <li>Nizak sadržaj masti i ugljenih hidrata</li>
      <li>Brza apsorpcija</li>
      <li>Odličan ukus</li>
      <li>Lako se meša</li>
    </ul>

    <h4>Nutritivne vrednosti (po porciji od 30g):</h4>
    <ul>
      <li>Energetska vrednost: 118 kcal</li>
      <li>Proteini: 23.4g</li>
      <li>Ugljeni hidrati: 2.1g</li>
      <li>Masti: 1.8g</li>
    </ul>
  `,
  usage:
    "Pomešajte jednu mericu (30g) sa 200-250ml vode ili mleka. Konzumirajte 1-2 porcije dnevno, idealno posle treninga i/ili između obroka.",
  images: [
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800&q=80",
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80",
  ],
  category: { name: "Proteini", slug: "proteini" },
  subcategory: { name: "Whey Protein", slug: "whey-protein" },
  brand: { name: "BioTech USA", slug: "biotech-usa" },
  stock: 15,
  variants: [
    { name: "Ukus", values: ["Čokolada", "Vanila", "Jagoda", "Banana", "Karamel"] },
  ],
};

const relatedProducts = [
  {
    id: "2",
    name: "100% Pure Whey 1000g",
    slug: "100-pure-whey-1000g",
    price: 3650,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Whey Protein", slug: "whey-protein" },
    stock: 20,
  },
  {
    id: "3",
    name: "BCAA Powder 300g",
    slug: "bcaa-powder-300g",
    price: 2100,
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&q=80",
    ],
    category: { name: "BCAA", slug: "bcaa" },
    stock: 25,
  },
  {
    id: "4",
    name: "Kreatin Monohidrat 500g",
    slug: "kreatin-monohidrat-500g",
    price: 1850,
    images: [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80",
    ],
    category: { name: "Kreatin", slug: "kreatin" },
    stock: 15,
  },
  {
    id: "5",
    name: "Pre-Workout Extreme 300g",
    slug: "pre-workout-extreme-300g",
    price: 2990,
    salePrice: 2490,
    images: [
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&q=80",
    ],
    category: { name: "Pre-Workout", slug: "pre-workout" },
    stock: 3,
  },
];

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);

  const discount =
    product.salePrice && product.salePrice < product.price
      ? calculateDiscount(product.price, product.salePrice)
      : 0;

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      toast({
        title: "Izaberite varijantu",
        description: "Molimo izaberite ukus pre dodavanja u korpu.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.images[0],
      quantity,
      variant: selectedVariant
        ? { name: "Ukus", value: selectedVariant }
        : undefined,
    });

    toast({
      title: "Dodato u korpu",
      description: `${product.name}${selectedVariant ? ` (${selectedVariant})` : ""} je dodat u vašu korpu.`,
    });
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-zinc-500 hover:text-lime transition-colors">
              Početna
            </Link>
            <ChevronRight className="h-4 w-4 text-zinc-700" />
            <Link
              href={`/kategorija/${product.category.slug}`}
              className="text-zinc-500 hover:text-lime transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-zinc-700" />
            <Link
              href={`/kategorija/${product.category.slug}/${product.subcategory.slug}`}
              className="text-zinc-500 hover:text-lime transition-colors"
            >
              {product.subcategory.name}
            </Link>
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

                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 relative z-10 group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-lime text-black font-bold text-lg px-4 py-2 clip-corner">
                        -{discount}%
                      </div>
                    </div>
                  )}
                </div>
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
              </div>

              {/* Details */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Link
                    href={`/brend/${product.brand.slug}`}
                    className="text-sm text-lime hover:underline font-bold uppercase tracking-wider"
                  >
                    {product.brand.name}
                  </Link>
                  <span className="text-zinc-700">|</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    SKU: {product.sku}
                  </span>
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
                  {product.stock > 0 ? (
                    <div className="inline-flex items-center gap-2 bg-lime/10 text-lime px-4 py-2 border border-lime/30">
                      <Check className="h-4 w-4" />
                      <span className="font-bold text-sm uppercase tracking-wider">
                        Na stanju ({product.stock} kom)
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

                {/* Variants */}
                {product.variants.map((variant) => (
                  <div key={variant.name} className="mb-6">
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      {variant.name}
                    </label>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger className="w-full md:w-72 bg-black border-zinc-700 text-white focus:border-lime">
                        <SelectValue placeholder={`Izaberite ${variant.name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {variant.values.map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="text-zinc-300 focus:bg-lime focus:text-black"
                          >
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

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
                    disabled={product.stock <= 0}
                    className="flex-1 md:flex-none bg-lime text-black font-bold text-lg px-8 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Dodaj u korpu
                  </button>

                  <button className="h-12 w-12 border border-zinc-700 bg-black text-zinc-400 hover:border-lime hover:text-lime transition-colors flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                  </button>

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

      {/* Product tabs */}
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
                <TabsTrigger
                  value="usage"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-lime data-[state=active]:text-lime data-[state=active]:bg-transparent text-zinc-400 px-6 py-3 uppercase tracking-wider font-bold"
                >
                  Način korišćenja
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-2">
                <div
                  className="prose prose-invert prose-lime max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </TabsContent>
              <TabsContent value="usage" className="pt-2">
                <p className="text-zinc-400 leading-relaxed">{product.usage}</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Zap className="h-6 w-6 text-lime" />
            <h2 className="font-display text-2xl md:text-3xl text-white">
              POVEZANI PROIZVODI
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
