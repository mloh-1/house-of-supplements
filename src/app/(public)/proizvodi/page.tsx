"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Package, Loader2, X, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlug = searchParams.get("kategorija");
  const subcategorySlug = searchParams.get("potkategorija");
  const brandSlug = searchParams.get("brend");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get current filter names for display
  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const currentSubcategory = currentCategory?.children.find((s) => s.slug === subcategorySlug);
  const currentBrand = brands.find((b) => b.slug === brandSlug);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) params.set("kategorija", categorySlug);
      if (subcategorySlug) params.set("potkategorija", subcategorySlug);
      if (brandSlug) params.set("brend", brandSlug);

      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      const [productsData, categoriesData, brandsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        brandsRes.json(),
      ]);

      setProducts(productsData.products || []);
      setCategories(categoriesData || []);
      setBrands(brandsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, subcategorySlug, brandSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
      // If changing category, clear subcategory
      if (key === "kategorija") {
        params.delete("potkategorija");
      }
    } else {
      params.delete(key);
      // If clearing category, also clear subcategory
      if (key === "kategorija") {
        params.delete("potkategorija");
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `/proizvodi?${queryString}` : "/proizvodi");
  };

  const clearAllFilters = () => {
    router.push("/proizvodi");
  };

  const hasActiveFilters = categorySlug || brandSlug;

  // Build page title
  let pageTitle = "SVI PROIZVODI";
  if (currentSubcategory) {
    pageTitle = currentSubcategory.name.toUpperCase();
  } else if (currentCategory) {
    pageTitle = currentCategory.name.toUpperCase();
  } else if (currentBrand) {
    pageTitle = currentBrand.name.toUpperCase();
  }

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="bg-black border-b border-zinc-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-lime/10 blur-[100px]" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-lime" />
            <span className="text-lime font-bold text-sm uppercase tracking-[0.2em]">
              Prodavnica
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white mb-3">{pageTitle}</h1>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {currentCategory && (
                <span className="inline-flex items-center gap-2 bg-lime/20 text-lime px-3 py-1 text-sm">
                  {currentCategory.name}
                  {currentSubcategory && ` / ${currentSubcategory.name}`}
                  <button
                    onClick={() => updateFilter("kategorija", null)}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {currentBrand && (
                <span className="inline-flex items-center gap-2 bg-lime/20 text-lime px-3 py-1 text-sm">
                  {currentBrand.name}
                  <button
                    onClick={() => updateFilter("brend", null)}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-zinc-400 hover:text-white text-sm underline"
              >
                Obriši sve filtere
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-zinc-500 hover:text-lime transition-colors">
              Početna
            </Link>
            <ChevronRight className="h-4 w-4 text-zinc-700" />
            <Link
              href="/proizvodi"
              className={!hasActiveFilters ? "text-lime font-medium" : "text-zinc-500 hover:text-lime transition-colors"}
            >
              Proizvodi
            </Link>
            {currentCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-700" />
                <Link
                  href={`/proizvodi?kategorija=${currentCategory.slug}`}
                  className={!currentSubcategory ? "text-lime font-medium" : "text-zinc-500 hover:text-lime transition-colors"}
                >
                  {currentCategory.name}
                </Link>
              </>
            )}
            {currentSubcategory && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-700" />
                <span className="text-lime font-medium">{currentSubcategory.name}</span>
              </>
            )}
            {currentBrand && !currentCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-zinc-700" />
                <span className="text-lime font-medium">{currentBrand.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            variant="outline"
            className="w-full border-zinc-700 text-white hover:bg-zinc-800 rounded-none"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filteri
            {hasActiveFilters && (
              <span className="ml-2 bg-lime text-black text-xs px-2 py-0.5">
                Aktivni
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-lime">//</span> Kategorije
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => updateFilter("kategorija", null)}
                      className={`block w-full text-left py-2 px-3 transition-colors ${
                        !categorySlug
                          ? "bg-lime/10 text-lime border-l-2 border-lime"
                          : "text-zinc-400 hover:text-lime hover:bg-zinc-800"
                      }`}
                    >
                      Sve kategorije
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => updateFilter("kategorija", cat.slug)}
                        className={`block w-full text-left py-2 px-3 transition-colors ${
                          cat.slug === categorySlug && !subcategorySlug
                            ? "bg-lime/10 text-lime border-l-2 border-lime"
                            : "text-zinc-400 hover:text-lime hover:bg-zinc-800"
                        }`}
                      >
                        {cat.name}
                      </button>
                      {cat.children.length > 0 && cat.slug === categorySlug && (
                        <ul className="ml-4 mt-1 space-y-1 border-l border-zinc-800">
                          {cat.children.map((sub) => (
                            <li key={sub.id}>
                              <button
                                onClick={() => {
                                  const params = new URLSearchParams();
                                  params.set("kategorija", cat.slug);
                                  params.set("potkategorija", sub.slug);
                                  if (brandSlug) params.set("brend", brandSlug);
                                  router.push(`/proizvodi?${params.toString()}`);
                                }}
                                className={`block w-full text-left py-1.5 px-3 text-sm transition-colors ${
                                  sub.slug === subcategorySlug
                                    ? "text-lime"
                                    : "text-zinc-500 hover:text-lime"
                                }`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-lime">//</span> Brendovi
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => updateFilter("brend", null)}
                        className={`block w-full text-left py-2 px-3 transition-colors ${
                          !brandSlug
                            ? "bg-lime/10 text-lime border-l-2 border-lime"
                            : "text-zinc-400 hover:text-lime hover:bg-zinc-800"
                        }`}
                      >
                        Svi brendovi
                      </button>
                    </li>
                    {brands.map((brand) => (
                      <li key={brand.id}>
                        <button
                          onClick={() => updateFilter("brend", brand.slug)}
                          className={`block w-full text-left py-2 px-3 transition-colors ${
                            brand.slug === brandSlug
                              ? "bg-lime/10 text-lime border-l-2 border-lime"
                              : "text-zinc-400 hover:text-lime hover:bg-zinc-800"
                          }`}
                        >
                          {brand.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mobile close button */}
              <div className="lg:hidden mt-6">
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-lime hover:bg-lime-500 text-black font-bold rounded-none"
                >
                  Prikaži rezultate ({products.length})
                </Button>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
              <p className="text-zinc-400">
                {loading ? (
                  "Učitavanje..."
                ) : (
                  <>
                    Prikazuje se <span className="text-lime font-bold">{products.length}</span> proizvoda
                  </>
                )}
              </p>
              <select className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 text-sm focus:border-lime focus:outline-none">
                <option>Sortiraj po: Popularnosti</option>
                <option>Cena: od najniže</option>
                <option>Cena: od najviše</option>
                <option>Naziv: A-Z</option>
                <option>Najnovije</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-lime animate-spin" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-lg mb-4">Nema proizvoda za izabrane filtere.</p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-lime hover:bg-lime-500 text-black font-bold rounded-none"
                >
                  Obriši filtere
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-lime animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
