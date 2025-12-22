import { Metadata } from "next";
import { Flame, Percent, Clock, Tag } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akcije | House of Supplements",
  description: "Pogledajte sve proizvode na akciji. Iskoristite specijalne popuste na vrhunske suplemente.",
};

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getSaleProducts() {
  const products = await db.product.findMany({
    where: {
      active: true,
      salePrice: { not: null },
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
      { createdAt: "desc" },
    ],
  });

  return products.map((product) => ({
    ...product,
    images: parseImages(product.images),
  }));
}

export default async function SalesPage() {
  const products = await getSaleProducts();

  // Calculate stats
  const totalProducts = products.length;
  const maxDiscount = products.reduce((max, product) => {
    if (product.salePrice) {
      const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
      return Math.max(max, discount);
    }
    return max;
  }, 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-black overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 diagonal-stripes opacity-30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime/10 blur-[150px]" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
              <span className="text-orange-500 font-bold text-sm uppercase tracking-[0.2em]">
                Hot Deals
              </span>
              <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-4">
              PROIZVODI NA <span className="text-orange-500">AKCIJI</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Iskoristite neverovatne popuste na vrhunske suplemente.
              Ograničene količine - požurite dok traje zaliha!
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <Tag className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{totalProducts}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Proizvoda</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <Percent className="h-5 w-5 text-lime" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-lime">Do {maxDiscount}%</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Popusta</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-3 border border-zinc-800">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">24-48h</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Isporuka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <>
              {/* Products count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-zinc-500">
                  Prikazano <span className="text-white font-bold">{products.length}</span> proizvoda
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Flame className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-white mb-2">
                NEMA PROIZVODA NA AKCIJI
              </h2>
              <p className="text-zinc-500">
                Trenutno nema proizvoda na akciji. Pratite nas za nove ponude!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-orange-500/20 via-transparent to-lime/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-400 mb-2">Želite da budete prvi koji saznaju za akcije?</p>
          <p className="text-white font-bold text-lg">
            Pratite nas na društvenim mrežama za ekskluzivne ponude!
          </p>
        </div>
      </section>
    </div>
  );
}
