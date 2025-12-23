"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useSettings } from "@/context/settings-context";

function CheckoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { items, getTotal, clearCart } = useCartStore();

  const FREE_SHIPPING_MIN = settings.freeShippingMin;
  const SHIPPING_COST = settings.shippingCost;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (session?.user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const userData = await response.json();
            setFormData((prev) => ({
              ...prev,
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              address: userData.address || "",
              city: userData.city || "",
              postalCode: userData.postalCode || "",
            }));
          }
        } catch {
          // Silently fail, user can fill manually
        }
      };
      fetchUserData();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      setError("Molimo popunite sva obavezna polja");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.salePrice || item.price,
            variantInfo: item.variantInfo || null,
            variantId: item.variantId || null,
          })),
          shippingName: formData.name,
          shippingEmail: formData.email,
          shippingPhone: formData.phone,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingPostal: formData.postalCode,
          notes: formData.notes,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške prilikom kreiranja porudžbine");
        setIsLoading(false);
        return;
      }

      // Clear cart and redirect to confirmation
      clearCart();
      router.push(`/potvrdjena-porudzbina/${data.orderNumber}`);
    } catch {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-zinc-950 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 h-96" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-zinc-900 border border-zinc-800 p-12 max-w-lg mx-auto relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

            <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-zinc-600" />
            </div>
            <h1 className="font-display text-2xl text-white mb-3">KORPA JE PRAZNA</h1>
            <p className="text-zinc-500 mb-8">Dodajte proizvode u korpu pre naručivanja.</p>
            <Link href="/">
              <button className="bg-lime text-black font-bold px-8 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors">
                Nastavi kupovinu
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/korpa" className="text-zinc-500 hover:text-lime transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-white">
            ZAVRŠI <span className="text-lime">PORUDŽBINU</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3">
                  {error}
                </div>
              )}

              {/* Guest/Login info */}
              {status !== "loading" && !session && (
                <div className="bg-zinc-900 border border-zinc-800 p-4">
                  <p className="text-zinc-400">
                    Imate nalog?{" "}
                    <Link href="/login?callbackUrl=/checkout" className="text-lime font-bold hover:underline">
                      Prijavite se
                    </Link>{" "}
                    za brže naručivanje.
                  </p>
                </div>
              )}

              {/* Shipping info */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />

                <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-lime" />
                  PODACI ZA DOSTAVU
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Ime i prezime *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Vaše ime i prezime"
                      className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vas@email.com"
                      className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Telefon *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06X XXX XXXX"
                      className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Adresa *
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ulica i broj"
                      className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Grad *
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Beograd"
                      className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Poštanski broj *
                    </label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="11000"
                      className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Napomena (opciono)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Dodatne informacije za dostavu..."
                      rows={3}
                      className="w-full bg-black border border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime p-3 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative">
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

                <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-lime" />
                  NAČIN PLAĆANJA
                </h2>

                <div className="bg-lime/10 border-2 border-lime p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-lime text-black flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Plaćanje pouzećem</p>
                    <p className="text-zinc-400 text-sm">
                      Platite kuriru prilikom preuzimanja paketa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

                <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                  <span className="text-lime">//</span> VAŠA PORUDŽBINA
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-2 bg-black/50">
                      <div className="relative w-16 h-16 bg-black border border-zinc-800 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-lime text-black text-xs font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-2">{item.name}</p>
                        {item.variantInfo && (
                          <p className="text-zinc-500 text-xs">{item.variantInfo}</p>
                        )}
                        <p className="text-lime text-sm font-bold mt-1">
                          {formatPrice((item.salePrice || item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 my-4" />

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-zinc-400">
                    <span>Međuzbir</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Dostava</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-lime font-bold">Besplatno</span>
                      ) : (
                        <span className="text-white">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-white font-bold uppercase tracking-wider">Ukupno</span>
                  <span className="font-display text-2xl text-lime">{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-lime text-black font-bold py-4 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
                      Obrada porudžbine...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Poruči
                    </>
                  )}
                </button>

                <p className="text-zinc-500 text-xs text-center mt-4">
                  Klikom na &quot;Poruči&quot; prihvatate naše uslove korišćenja
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dynamically import to prevent SSR issues with useSession
const DynamicCheckoutContent = dynamic(() => Promise.resolve(CheckoutContent), {
  ssr: false,
  loading: () => (
    <div className="bg-zinc-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 p-6 h-96" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 h-64" />
          </div>
        </div>
      </div>
    </div>
  ),
});

export default function CheckoutPage() {
  return <DynamicCheckoutContent />;
}
