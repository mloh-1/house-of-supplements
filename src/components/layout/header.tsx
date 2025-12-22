"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Phone,
  Zap,
  Heart,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn, formatPrice } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useSettings } from "@/context/settings-context";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  brand: { name: string } | null;
}

const categories = [
  {
    name: "Proteini",
    slug: "proteini",
    subcategories: [
      { name: "Whey Protein", slug: "whey-protein" },
      { name: "Whey Izolat", slug: "whey-izolat" },
      { name: "Kazein", slug: "kazein" },
      { name: "Veganski Proteini", slug: "veganski-proteini" },
      { name: "Beef Protein", slug: "beef-protein" },
    ],
  },
  {
    name: "Aminokiseline",
    slug: "aminokiseline",
    subcategories: [
      { name: "BCAA", slug: "bcaa" },
      { name: "EAA", slug: "eaa" },
      { name: "Glutamin", slug: "glutamin" },
      { name: "L-Karnitin", slug: "l-karnitin" },
    ],
  },
  {
    name: "Kreatin",
    slug: "kreatin",
    subcategories: [
      { name: "Kreatin Monohidrat", slug: "kreatin-monohidrat" },
      { name: "Kreatin Kompleksi", slug: "kreatin-kompleksi" },
    ],
  },
  {
    name: "Vitamini",
    slug: "vitamini",
    subcategories: [
      { name: "Multivitamini", slug: "multivitamini" },
      { name: "Vitamin D", slug: "vitamin-d" },
      { name: "Omega 3", slug: "omega-3" },
      { name: "Magnezijum", slug: "magnezijum" },
    ],
  },
  {
    name: "Pre-Workout",
    slug: "pre-workout",
    subcategories: [],
  },
];

export function Header() {
  const router = useRouter();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getItemCount());
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated" && session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
          const data = await res.json();
          setSearchResults(data.products || []);
          setShowResults(true);
        } catch (err) {
          console.error("Search error:", err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/pretraga?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar - aggressive style */}
      <div className="bg-black border-b border-zinc-800 py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {settings.storePhone1 && (
                <a
                  href={`tel:${settings.storePhone1.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-lime transition-colors group"
                >
                  <MapPin className="h-3.5 w-3.5 text-lime" />
                  <span className="hidden sm:inline">{settings.storeAddress1 || "Lokacija 1"}</span>
                  <span className="text-zinc-600 mx-1">|</span>
                  <Phone className="h-3.5 w-3.5" />
                  <span className="group-hover:text-lime">{settings.storePhone1}</span>
                </a>
              )}
              {settings.storePhone2 && (
                <a
                  href={`tel:${settings.storePhone2.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-lime transition-colors group"
                >
                  <MapPin className="h-3.5 w-3.5 text-lime" />
                  <span className="hidden sm:inline">{settings.storeAddress2 || "Lokacija 2"}</span>
                  <span className="text-zinc-600 mx-1">|</span>
                  <Phone className="h-3.5 w-3.5" />
                  <span className="group-hover:text-lime">{settings.storePhone2}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 text-lime font-bold uppercase text-xs tracking-wider">
              <Zap className="h-4 w-4 animate-pulse" />
              <span className="hidden md:inline">
                Besplatna dostava za porudžbine preko {formatPrice(settings.freeShippingMin)}
              </span>
              <span className="md:hidden">Free shipping &gt;{formatPrice(settings.freeShippingMin)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header - dark and bold */}
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - aggressive style */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-lime text-black p-2 font-display text-2xl leading-none transition-all group-hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]">
                    HS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime/30" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-display text-xl text-white leading-none block tracking-wider">
                    HOUSE OF
                  </span>
                  <span className="font-display text-xl text-lime leading-none block tracking-wider">
                    SUPPLEMENTS
                  </span>
                </div>
              </div>
            </Link>

            {/* Search bar - industrial style */}
            <div className="flex-1 max-w-xl hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <Input
                  type="search"
                  placeholder="Pretraži proizvode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="w-full pl-4 pr-12 h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-lime focus:ring-lime/20 rounded-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 bg-lime hover:bg-lime-500 text-black rounded-none"
                >
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>

                {/* Search results dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 bg-zinc-900 border border-zinc-700 border-t-0 z-50 max-h-96 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/proizvod/${product.slug}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0"
                          >
                            <div className="w-12 h-12 bg-black flex-shrink-0 relative overflow-hidden">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="h-6 w-6 text-zinc-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {product.brand && (
                                <p className="text-xs text-lime font-bold uppercase">
                                  {product.brand.name}
                                </p>
                              )}
                              <p className="text-white font-medium truncate">
                                {product.name}
                              </p>
                              <p className="text-sm">
                                {product.salePrice && product.salePrice < product.price ? (
                                  <>
                                    <span className="text-lime font-bold">
                                      {formatPrice(product.salePrice)}
                                    </span>
                                    <span className="text-zinc-500 line-through ml-2">
                                      {formatPrice(product.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-zinc-300">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/pretraga?q=${encodeURIComponent(searchQuery)}`}
                          onClick={handleResultClick}
                          className="block p-3 text-center text-lime hover:bg-zinc-800 font-bold text-sm uppercase tracking-wider"
                        >
                          Prikaži sve rezultate →
                        </Link>
                      </>
                    ) : (
                      <div className="p-4 text-center text-zinc-400">
                        Nema rezultata za &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Actions - minimal and bold */}
            <div className="flex items-center gap-1">
              {isLoggedIn && (
                <Link href="/lista-zelja" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-zinc-400 hover:text-lime hover:bg-zinc-800"
                  >
                    <Heart className="h-5 w-5" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime text-black text-[10px] font-bold flex items-center justify-center">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hover:text-lime hover:bg-zinc-800",
                      isLoggedIn ? "text-lime" : "text-zinc-400"
                    )}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-zinc-900 border-zinc-700 text-white"
                >
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-b border-zinc-700">
                        <p className="font-bold text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
                      </div>
                      <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                        <Link href="/moj-nalog" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Moj nalog
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                        <Link href="/moje-porudzbine" className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Moje porudžbine
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator className="bg-zinc-700" />
                          <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                            <Link href="/admin" className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-zinc-700" />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-red-400 focus:text-red-400 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Odjavi se
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                        <Link href="/login">Prijavi se</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                        <Link href="/registracija">Registruj se</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/korpa">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-zinc-400 hover:text-lime hover:bg-zinc-800"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-none p-0 flex items-center justify-center text-xs bg-lime text-black font-bold border-0">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-400 hover:text-lime hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Pretraži proizvode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 h-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 rounded-none"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 bg-lime text-black rounded-none"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Navigation - aggressive industrial */}
        <nav className="bg-black hidden md:block border-t border-zinc-800">
          <div className="container mx-auto px-4">
            <ul className="flex items-center">
              <li>
                <Link
                  href="/"
                  className="block px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-white hover:text-lime hover:bg-zinc-900 transition-colors"
                >
                  Naslovna
                </Link>
              </li>
              <li>
                <Link
                  href="/proizvodi"
                  className="block px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-white hover:text-lime hover:bg-zinc-900 transition-colors"
                >
                  Proizvodi
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug} className="relative group">
                  <Link
                    href={`/proizvodi?kategorija=${category.slug}`}
                    className="flex items-center gap-1.5 px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-white hover:text-lime hover:bg-zinc-900 transition-colors"
                  >
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <div className="absolute left-0 top-full bg-zinc-900 border border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px] z-50">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/proizvodi?kategorija=${category.slug}&potkategorija=${sub.slug}`}
                          className="block px-5 py-3 text-zinc-300 hover:bg-black hover:text-lime transition-colors border-l-2 border-transparent hover:border-lime"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/akcije"
                  className="block px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-lime hover:bg-zinc-900 transition-colors relative"
                >
                  <span className="relative">
                    Akcije
                    <span className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden bg-zinc-950 border-t border-zinc-800 overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
          )}
        >
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="block py-3 font-bold uppercase tracking-wider text-white hover:text-lime border-l-2 border-transparent hover:border-lime pl-4 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Naslovna
                </Link>
              </li>
              <li>
                <Link
                  href="/proizvodi"
                  className="block py-3 font-bold uppercase tracking-wider text-white hover:text-lime border-l-2 border-transparent hover:border-lime pl-4 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Proizvodi
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/proizvodi?kategorija=${category.slug}`}
                    className="block py-3 font-bold uppercase tracking-wider text-white hover:text-lime border-l-2 border-transparent hover:border-lime pl-4 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ul className="ml-4 space-y-1 border-l border-zinc-800">
                      {category.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/proizvodi?kategorija=${category.slug}&potkategorija=${sub.slug}`}
                            className="block py-2 pl-4 text-zinc-400 hover:text-lime transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/akcije"
                  className="block py-3 font-bold uppercase tracking-wider text-lime border-l-2 border-lime pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Akcije
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
