import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Clock, Headphones, Zap, Flame, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CountdownTimer } from "@/components/home/countdown-timer";
import { ProductCard } from "@/components/products/product-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const defaultHeroSlides = [
  {
    id: "1",
    title: "VRHUNSKI PROTEINI",
    subtitle: "Novo u ponudi",
    description:
      "Otkrijte našu premium kolekciju whey proteina za maksimalne rezultate u teretani.",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1920&q=80",
    buttonText: "Pogledaj ponudu",
    buttonLink: "/proizvodi?kategorija=proteini",
  },
];

const features = [
  {
    icon: Truck,
    title: "Besplatna dostava",
    description: "Preko 4.000 RSD",
  },
  {
    icon: Shield,
    title: "Sigurna kupovina",
    description: "100% bezbedno",
  },
  {
    icon: Clock,
    title: "Brza isporuka",
    description: "24-48h dostava",
  },
  {
    icon: Headphones,
    title: "Podrška 24/7",
    description: "Tu smo za vas",
  },
];

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getHeroPromos() {
  const promos = await db.heroPromo.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  if (promos.length === 0) {
    return defaultHeroSlides;
  }

  return promos.map(promo => ({
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle || undefined,
    description: promo.description || undefined,
    image: promo.image,
    buttonText: promo.buttonText || undefined,
    buttonLink: promo.buttonLink || undefined,
  }));
}

async function getSettings() {
  let settings = await db.siteSettings.findUnique({
    where: { id: "settings" },
  });

  if (!settings) {
    return {
      freeShippingMin: 4000,
      shippingCost: 350,
    };
  }

  return settings;
}

async function getProducts() {
  const products = await db.product.findMany({
    where: { active: true },
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
    take: 8,
  });

  return products.map(product => ({
    ...product,
    images: parseImages(product.images),
  }));
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
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return products.map(product => ({
    ...product,
    images: parseImages(product.images),
  }));
}

async function getSpecialOffer() {
  // Get the featured special offer from the SpecialOffer table
  const offer = await db.specialOffer.findFirst({
    where: {
      active: true,
      featured: true,
      endDate: { gte: new Date() }, // Not expired
    },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("[SpecialOffer] Featured query result:", offer ? {
    id: offer.id,
    active: offer.active,
    featured: offer.featured,
    productImages: offer.product.images,
  } : "NOT FOUND");

  // Fallback to any active offer if no featured one
  if (!offer) {
    const fallbackOffer = await db.specialOffer.findFirst({
      where: {
        active: true,
        endDate: { gte: new Date() },
      },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("[SpecialOffer] Fallback query result:", fallbackOffer ? "FOUND" : "NOT FOUND");
    return fallbackOffer;
  }

  return offer;
}

export default async function HomePage() {
  const [featuredProducts, saleProducts, specialOfferData, heroSlides, settings] = await Promise.all([
    getProducts(),
    getSaleProducts(),
    getSpecialOffer(),
    getHeroPromos(),
    getSettings(),
  ]);

  const parsedOfferImages = specialOfferData ? parseImages(specialOfferData.product.images) : [];
  console.log("[SpecialOffer] Parsed images:", parsedOfferImages);

  const specialOffer = specialOfferData ? {
    product: {
      id: specialOfferData.product.id,
      name: specialOfferData.product.name,
      slug: specialOfferData.product.slug,
      price: specialOfferData.product.price,
      salePrice: specialOfferData.product.salePrice,
      images: parsedOfferImages,
      stock: specialOfferData.product.stock,
    },
    endDate: new Date(specialOfferData.endDate),
    discountPercent: specialOfferData.discountPercent,
  } : null;

  return (
    <div className="bg-zinc-950">
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* Features bar - industrial style */}
      <section className="bg-black border-y border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 justify-center md:justify-start group"
              >
                <div className="bg-zinc-900 p-3 border border-zinc-800 group-hover:border-lime/30 transition-colors">
                  <feature.icon className="h-5 w-5 text-lime" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-white text-sm uppercase tracking-wide">
                    {feature.title}
                  </p>
                  <p className="text-xs text-zinc-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-lime" />
                <span className="text-lime font-bold text-sm uppercase tracking-[0.2em]">
                  Best sellers
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">
                NAJPOPULARNIJI <span className="text-lime">PROIZVODI</span>
              </h2>
            </div>
            <Link href="/proizvodi" className="hidden md:block">
              <Button
                variant="outline"
                className="border-zinc-700 text-white hover:bg-lime hover:text-black hover:border-lime gap-2 rounded-none font-bold uppercase tracking-wider"
              >
                Vidi sve <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500">Nema proizvoda za prikaz.</p>
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link href="/proizvodi">
              <Button
                variant="outline"
                className="border-zinc-700 text-white hover:bg-lime hover:text-black hover:border-lime gap-2 rounded-none"
              >
                Vidi sve proizvode <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer with Countdown - aggressive design */}
      {specialOffer && (
        <section className="py-16 md:py-24 bg-black relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-lime/10 blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 blur-[150px]" />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-48 h-48 border-l-4 border-t-4 border-lime/20" />
          <div className="absolute bottom-0 right-0 w-48 h-48 border-r-4 border-b-4 border-lime/20" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="text-orange-500 font-bold text-sm uppercase tracking-[0.2em]">
                  Ograničena ponuda
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
                SPECIJALNA <span className="text-lime">AKCIJA</span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <Timer className="h-5 w-5" />
                <span>Ponuda ističe za:</span>
              </div>
            </div>

            <div className="mb-10">
              <CountdownTimer targetDate={specialOffer.endDate} />
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-8 md:p-12 relative">
                {/* Discount badge */}
                <div className="absolute -top-4 -right-4 bg-lime text-black font-display text-3xl px-4 py-2 rotate-3">
                  -{specialOffer.discountPercent}%
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="relative aspect-square w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime/20 to-transparent opacity-50" />
                    {specialOffer.product.images[0] ? (
                      <Image
                        src={specialOffer.product.images[0]}
                        alt={specialOffer.product.name}
                        fill
                        className="object-contain p-8"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600">
                        Nema slike
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-lime font-bold text-sm uppercase tracking-[0.2em] mb-2 inline-block">
                      Samo ove nedelje
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl text-white mb-6">
                      {specialOffer.product.name}
                    </h3>
                    <div className="flex items-baseline gap-4 justify-center md:justify-start mb-6">
                      <span className="text-4xl md:text-5xl font-bold text-lime">
                        {specialOffer.product.salePrice?.toLocaleString("sr-RS")}{" "}
                        <span className="text-xl">RSD</span>
                      </span>
                      <span className="text-xl text-zinc-500 line-through">
                        {specialOffer.product.price.toLocaleString("sr-RS")} RSD
                      </span>
                    </div>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                      Iskoristite ovu jedinstvenu priliku i nabavite ovaj
                      visokokvalitetni suplement po specijalnoj ceni. Količine su
                      strogo ograničene!
                    </p>
                    <Link href={`/proizvod/${specialOffer.product.slug}`}>
                      <Button
                        size="lg"
                        className="bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider px-10 py-6 text-lg rounded-none w-full md:w-auto"
                      >
                        Kupi sada
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 diagonal-stripes opacity-30" />
          <div className="container mx-auto px-4 relative">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-orange-500 font-bold text-sm uppercase tracking-[0.2em]">
                    Hot deals
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl text-white">
                  PROIZVODI NA <span className="text-orange-500">AKCIJI</span>
                </h2>
              </div>
              <Link href="/akcije" className="hidden md:block">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-none font-bold uppercase tracking-wider">
                  Sve akcije <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 text-center md:hidden">
              <Link href="/akcije">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-none">
                  Vidi sve akcije <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shipping Info Banner - bold CTA */}
      <section className="py-16 bg-lime relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-black p-4">
                <Truck className="h-10 w-10 text-lime" />
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-black mb-1">
                  BESPLATNA DOSTAVA
                </h3>
                <p className="text-black/70 font-medium">
                  Za sve porudžbine preko {settings.freeShippingMin.toLocaleString("sr-RS")} RSD
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center sm:text-right">
                <p className="text-black/70 text-sm">Ispod {settings.freeShippingMin.toLocaleString("sr-RS")} RSD</p>
                <p className="font-display text-2xl text-black">{settings.shippingCost.toLocaleString("sr-RS")} RSD</p>
              </div>
              <Link href="/uslovi-kupovine">
                <Button className="bg-black hover:bg-zinc-800 text-lime font-bold uppercase tracking-wider rounded-none px-8 py-6">
                  Saznaj više
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
