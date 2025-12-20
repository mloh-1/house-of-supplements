import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Clock, Headphones, Zap, Flame, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CountdownTimer } from "@/components/home/countdown-timer";
import { ProductCard } from "@/components/products/product-card";

// Demo data - in production, this would come from the database
const heroSlides = [
  {
    id: "1",
    title: "VRHUNSKI PROTEINI",
    subtitle: "Novo u ponudi",
    description:
      "Otkrijte našu premium kolekciju whey proteina za maksimalne rezultate u teretani.",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1920&q=80",
    buttonText: "Pogledaj ponudu",
    buttonLink: "/kategorija/proteini",
  },
  {
    id: "2",
    title: "SPECIJALNA AKCIJA",
    subtitle: "Uštedite do 30%",
    description:
      "Iskoristite posebne popuste na odabrane suplemente. Ponuda traje do isteka zaliha!",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80",
    buttonText: "Vidi akcije",
    buttonLink: "/akcije",
  },
  {
    id: "3",
    title: "PLAĆANJE NA RATE",
    subtitle: "Bez kamate",
    description:
      "Podelite plaćanje na do 6 mesečnih rata bez kamate. Visa, Mastercard, Dina.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
    buttonText: "Saznaj više",
    buttonLink: "/uslovi-kupovine",
  },
];

const featuredProducts = [
  {
    id: "1",
    name: "100% Pure Whey 2270g",
    slug: "100-pure-whey-2270g",
    price: 7250,
    salePrice: 6100,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Proteini", slug: "proteini" },
    stock: 15,
  },
  {
    id: "2",
    name: "BCAA EAA Strong 400g",
    slug: "bcaa-eaa-strong-400g",
    price: 2650,
    salePrice: 2300,
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&q=80",
    ],
    category: { name: "Aminokiseline", slug: "aminokiseline" },
    stock: 8,
  },
  {
    id: "3",
    name: "Kreatin Monohidrat 500g",
    slug: "kreatin-monohidrat-500g",
    price: 1850,
    images: [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80",
    ],
    category: { name: "Kreatin", slug: "kreatin" },
    stock: 25,
  },
  {
    id: "4",
    name: "Omega 3 Fish Oil 120 caps",
    slug: "omega-3-fish-oil-120-caps",
    price: 1490,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    ],
    category: { name: "Vitamini", slug: "vitamini" },
    stock: 0,
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
  {
    id: "6",
    name: "Whey Izolat Premium 1000g",
    slug: "whey-izolat-premium-1000g",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    ],
    category: { name: "Proteini", slug: "proteini" },
    stock: 12,
  },
  {
    id: "7",
    name: "Multivitamin Complex 90 tabs",
    slug: "multivitamin-complex-90-tabs",
    price: 1290,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    ],
    category: { name: "Vitamini", slug: "vitamini" },
    stock: 30,
  },
  {
    id: "8",
    name: "L-Karnitin 1000ml",
    slug: "l-karnitin-1000ml",
    price: 1990,
    salePrice: 1590,
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&q=80",
    ],
    category: { name: "Aminokiseline", slug: "aminokiseline" },
    stock: 18,
  },
];

const specialOffer = {
  product: {
    id: "special1",
    name: "Bulgarian Tribulus 90 caps",
    slug: "bulgarian-tribulus-90-caps",
    price: 3400,
    salePrice: 2450,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    ],
    stock: 10,
  },
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  discountPercent: 28,
};

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

export default function HomePage() {
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-lime/20 to-transparent opacity-50" />
                  <Image
                    src={specialOffer.product.images[0]}
                    alt={specialOffer.product.name}
                    fill
                    className="object-contain p-8"
                  />
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

      {/* Sale Products */}
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
            {featuredProducts
              .filter((p) => p.salePrice)
              .slice(0, 4)
              .map((product) => (
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
                  Za sve porudžbine preko 4.000 RSD
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center sm:text-right">
                <p className="text-black/70 text-sm">Ispod 4.000 RSD</p>
                <p className="font-display text-2xl text-black">350 RSD</p>
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
