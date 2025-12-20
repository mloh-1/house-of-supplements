import Link from "next/link";
import { ChevronRight, Filter, Zap } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { CategoryFilters } from "@/components/category/category-filters";

// Demo data
const allProducts = [
  {
    id: "1",
    name: "100% Pure Whey 2270g",
    slug: "100-pure-whey-2270g",
    price: 7250,
    salePrice: 6100,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Whey Protein", slug: "whey-protein" },
    stock: 15,
  },
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
    name: "Whey Izolat Premium 1000g",
    slug: "whey-izolat-premium-1000g",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Whey Izolat", slug: "whey-izolat" },
    stock: 12,
  },
  {
    id: "4",
    name: "Kazein Protein 900g",
    slug: "kazein-protein-900g",
    price: 3900,
    salePrice: 3500,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Kazein", slug: "kazein" },
    stock: 8,
  },
  {
    id: "5",
    name: "Veganski Protein 750g",
    slug: "veganski-protein-750g",
    price: 3200,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Veganski Proteini", slug: "veganski-proteini" },
    stock: 5,
  },
  {
    id: "6",
    name: "Beef Protein Izolat 1800g",
    slug: "beef-protein-izolat-1800g",
    price: 5500,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Beef Protein", slug: "beef-protein" },
    stock: 0,
  },
  {
    id: "7",
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
    id: "8",
    name: "EAA Complex 400g",
    slug: "eaa-complex-400g",
    price: 2800,
    salePrice: 2400,
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&q=80",
    ],
    category: { name: "EAA", slug: "eaa" },
    stock: 18,
  },
];

const categories = [
  {
    name: "Proteini",
    slug: "proteini",
    description: "Proteini u prahu postali su popularni među sportistima, bodybuilderima i osobama koje žele da poboljšaju svoju ishranu i postignu određene fizičke ciljeve.",
    subcategories: [
      { name: "Whey Protein", slug: "whey-protein", count: 24 },
      { name: "Whey Izolat", slug: "whey-izolat", count: 18 },
      { name: "Kazein", slug: "kazein", count: 12 },
      { name: "Veganski Proteini", slug: "veganski-proteini", count: 8 },
      { name: "Beef Protein", slug: "beef-protein", count: 6 },
    ],
  },
  {
    name: "Aminokiseline",
    slug: "aminokiseline",
    description: "Aminokiseline su gradivni blokovi proteina i esencijalne su za oporavak i rast mišića.",
    subcategories: [
      { name: "BCAA", slug: "bcaa", count: 15 },
      { name: "EAA", slug: "eaa", count: 10 },
      { name: "Glutamin", slug: "glutamin", count: 8 },
      { name: "L-Karnitin", slug: "l-karnitin", count: 12 },
    ],
  },
];

const brands = [
  { name: "BioTech USA", slug: "biotech-usa", count: 45 },
  { name: "Optimum Nutrition", slug: "optimum-nutrition", count: 32 },
  { name: "MyProtein", slug: "myprotein", count: 28 },
  { name: "VemoHerb", slug: "vemoherb", count: 15 },
  { name: "Ultimate Nutrition", slug: "ultimate-nutrition", count: 22 },
];

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categorySlug = slug[0];
  const subcategorySlug = slug[1];

  const category = categories.find((c) => c.slug === categorySlug);
  const subcategory = category?.subcategories.find(
    (s) => s.slug === subcategorySlug
  );

  const title = subcategory?.name || category?.name || "Svi proizvodi";
  const description = category?.description || "";

  // Filter products based on category/subcategory
  const filteredProducts = allProducts;

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="bg-black border-b border-zinc-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-lime/10 blur-[100px]" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-lime" />
            <span className="text-lime font-bold text-sm uppercase tracking-[0.2em]">
              {category?.name || "Kategorija"}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white mb-3">{title}</h1>
          {description && (
            <p className="text-zinc-400 max-w-2xl text-lg">{description}</p>
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
            {category && (
              <>
                <Link
                  href={`/kategorija/${category.slug}`}
                  className={
                    subcategory
                      ? "text-zinc-500 hover:text-lime transition-colors"
                      : "text-lime font-medium"
                  }
                >
                  {category.name}
                </Link>
                {subcategory && (
                  <>
                    <ChevronRight className="h-4 w-4 text-zinc-700" />
                    <span className="text-lime font-medium">
                      {subcategory.name}
                    </span>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <CategoryFilters
              categories={categories}
              brands={brands}
              currentCategory={categorySlug}
              currentSubcategory={subcategorySlug}
            />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
              <p className="text-zinc-400">
                Prikazuje se <span className="text-lime font-bold">{filteredProducts.length}</span> proizvoda
              </p>
              <select className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 text-sm focus:border-lime focus:outline-none">
                <option>Sortiraj po: Popularnosti</option>
                <option>Cena: od najniže</option>
                <option>Cena: od najviše</option>
                <option>Naziv: A-Z</option>
                <option>Najnovije</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-lime hover:border-lime/50 transition-colors">
                Prethodna
              </button>
              <button className="px-4 py-2 bg-lime text-black font-bold">
                1
              </button>
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-lime hover:border-lime/50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-lime hover:border-lime/50 transition-colors">
                3
              </button>
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-lime hover:border-lime/50 transition-colors">
                Sledeća
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
