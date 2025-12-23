"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Eye, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string } | null;
  inStock: boolean;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products || []);
          setTotal(data.total || 0);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setProducts([]);
          setTotal(0);
        })
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
      setTotal(0);
    }
  }, [query]);

  const handleViewProduct = (product: Product) => {
    router.push(`/proizvod/${product.slug}`);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-lime" />
            <h1 className="font-display text-3xl text-white">PRETRAGA</h1>
          </div>
          {query && (
            <p className="text-zinc-400">
              {loading ? (
                "Pretraživanje..."
              ) : (
                <>
                  Pronađeno <span className="text-lime font-bold">{total}</span>{" "}
                  rezultata za &quot;<span className="text-white">{query}</span>&quot;
                </>
              )}
            </p>
          )}
        </div>

        {/* No query */}
        {!query && (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <Search className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">Unesite pojam za pretragu</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 animate-pulse">
                <div className="aspect-square bg-zinc-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-800 w-3/4" />
                  <div className="h-4 bg-zinc-800 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && query && products.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-white font-bold mb-2">Nema rezultata</p>
            <p className="text-zinc-400 mb-6">
              Nismo pronašli proizvode koji odgovaraju vašoj pretrazi.
            </p>
            <Link href="/">
              <Button className="bg-lime text-black hover:bg-lime-400 font-bold">
                Pogledaj sve proizvode
              </Button>
            </Link>
          </div>
        )}

        {/* Results */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <Link href={`/proizvod/${product.slug}`}>
                  <div className="relative aspect-square bg-black overflow-hidden">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600">
                        <Package className="h-12 w-12" />
                      </div>
                    )}
                    {product.salePrice && product.salePrice < product.price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
                        -{Math.round((1 - product.salePrice / product.price) * 100)}%
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-zinc-800 text-zinc-400 text-sm font-bold px-3 py-1">
                          Nije na stanju
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  {product.brand && (
                    <p className="text-xs text-lime font-bold uppercase tracking-wider mb-1">
                      {product.brand.name}
                    </p>
                  )}
                  <Link href={`/proizvod/${product.slug}`}>
                    <h3 className="font-bold text-white group-hover:text-lime transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      {product.salePrice && product.salePrice < product.price ? (
                        <>
                          <span className="font-display text-lg text-lime">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-zinc-500 text-sm line-through ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-display text-lg text-white">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      onClick={() => handleViewProduct(product)}
                      className="h-9 w-9 bg-lime text-black hover:bg-lime-400"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-zinc-950 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-zinc-800 w-48 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 h-64" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
