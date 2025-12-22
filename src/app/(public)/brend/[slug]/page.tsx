import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Award } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getBrand(slug: string) {
  return db.brand.findUnique({
    where: { slug },
  });
}

async function getProductsByBrand(brandId: string) {
  const products = await db.product.findMany({
    where: {
      active: true,
      brandId: brandId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return products.map(product => ({
    ...product,
    images: parseImages(product.images),
  }));
}

async function getAllBrands() {
  return db.brand.findMany({
    orderBy: { name: "asc" },
  });
}

async function getAllCategories() {
  return db.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
    },
    orderBy: { name: "asc" },
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const [brand, allBrands, allCategories] = await Promise.all([
    getBrand(slug),
    getAllBrands(),
    getAllCategories(),
  ]);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrand(brand.id);

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="bg-black border-b border-zinc-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-lime/10 blur-[100px]" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-lime" />
            <span className="text-lime font-bold text-sm uppercase tracking-[0.2em]">
              Brend
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white mb-3">{brand.name}</h1>
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
            <span className="text-lime font-medium">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-lime">//</span> Kategorije
                </h3>
                <ul className="space-y-2">
                  {allCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/kategorija/${cat.slug}`}
                        className="block py-2 px-3 text-zinc-400 hover:text-lime hover:bg-zinc-800 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              {allBrands.length > 0 && (
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-lime">//</span> Brendovi
                  </h3>
                  <ul className="space-y-2">
                    {allBrands.map((b) => (
                      <li key={b.id}>
                        <Link
                          href={`/brend/${b.slug}`}
                          className={`block py-2 px-3 transition-colors ${
                            b.slug === slug
                              ? "bg-lime/10 text-lime border-l-2 border-lime"
                              : "text-zinc-400 hover:text-lime hover:bg-zinc-800"
                          }`}
                        >
                          {b.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
              <p className="text-zinc-400">
                Prikazuje se <span className="text-lime font-bold">{products.length}</span> proizvoda
              </p>
              <select className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 text-sm focus:border-lime focus:outline-none">
                <option>Sortiraj po: Popularnosti</option>
                <option>Cena: od najniže</option>
                <option>Cena: od najviše</option>
                <option>Naziv: A-Z</option>
                <option>Najnovije</option>
              </select>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-lg">Nema proizvoda za ovaj brend.</p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-lime hover:underline"
                >
                  Nazad na početnu
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
