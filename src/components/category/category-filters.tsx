"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  subcategories?: { name: string; slug: string; count: number }[];
}

interface Brand {
  name: string;
  slug: string;
  count: number;
}

interface CategoryFiltersProps {
  categories: Category[];
  brands: Brand[];
  currentCategory?: string;
  currentSubcategory?: string;
}

export function CategoryFilters({
  categories,
  brands,
  currentCategory,
  currentSubcategory,
}: CategoryFiltersProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    currentCategory || "",
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div className="space-y-6">
      {/* Active filters */}
      {(currentCategory || selectedBrands.length > 0) && (
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Aktivni filteri</h3>
            <button className="text-sm text-lime hover:underline">
              Obriši sve
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <Link
                href="/proizvodi"
                className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 px-3 py-1.5 text-sm hover:bg-lime hover:text-black transition-colors"
              >
                {categories.find((c) => c.slug === currentCategory)?.name}
                <X className="h-3 w-3" />
              </Link>
            )}
            {selectedBrands.map((brandSlug) => {
              const brand = brands.find((b) => b.slug === brandSlug);
              return (
                <button
                  key={brandSlug}
                  onClick={() => toggleBrand(brandSlug)}
                  className="inline-flex items-center gap-1 bg-lime/20 text-lime px-3 py-1.5 text-sm hover:bg-lime hover:text-black transition-colors"
                >
                  {brand?.name}
                  <X className="h-3 w-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
          <span className="text-lime">//</span> KATEGORIJE
        </h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.slug}>
              <button
                onClick={() => toggleCategory(category.slug)}
                className={cn(
                  "flex items-center justify-between w-full py-2.5 px-3 transition-colors text-left",
                  currentCategory === category.slug
                    ? "bg-lime/10 text-lime border-l-2 border-lime"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <span>{category.name}</span>
                {category.subcategories && category.subcategories.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedCategories.includes(category.slug) && "rotate-180"
                    )}
                  />
                )}
              </button>

              {category.subcategories &&
                expandedCategories.includes(category.slug) && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-zinc-800">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/kategorija/${category.slug}/${sub.slug}`}
                        className={cn(
                          "flex items-center justify-between py-2 px-3 text-sm transition-colors",
                          currentSubcategory === sub.slug
                            ? "text-lime bg-lime/10"
                            : "text-zinc-400 hover:text-lime hover:bg-zinc-800"
                        )}
                      >
                        <span>{sub.name}</span>
                        <span className="text-xs text-zinc-600">
                          ({sub.count})
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
          <span className="text-lime">//</span> BRENDOVI
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand.slug}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              <Checkbox
                checked={selectedBrands.includes(brand.slug)}
                onCheckedChange={() => toggleBrand(brand.slug)}
                className="border-zinc-600 data-[state=checked]:bg-lime data-[state=checked]:border-lime"
              />
              <span className="flex-1 text-sm text-zinc-400 group-hover:text-white transition-colors">
                {brand.name}
              </span>
              <span className="text-xs text-zinc-600">({brand.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
          <span className="text-lime">//</span> CENA
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Od"
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm focus:border-lime focus:outline-none placeholder:text-zinc-500"
            />
            <span className="text-zinc-600">-</span>
            <input
              type="number"
              placeholder="Do"
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm focus:border-lime focus:outline-none placeholder:text-zinc-500"
            />
          </div>
          <button className="w-full bg-lime text-black py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-lime-500 transition-colors">
            Primeni
          </button>
        </div>
      </div>

      {/* Stock filter */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
          <span className="text-lime">//</span> DOSTUPNOST
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox className="border-zinc-600 data-[state=checked]:bg-lime data-[state=checked]:border-lime" />
          <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
            Samo proizvodi na stanju
          </span>
        </label>
      </div>
    </div>
  );
}
