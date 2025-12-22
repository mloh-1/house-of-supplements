"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RegistracijaPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne poklapaju");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("Lozinka mora imati najmanje 4 karaktera");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške prilikom registracije");
        setIsLoading(false);
        return;
      }

      // Redirect to check email page
      router.push("/check-email");
    } catch {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime/10 blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime/5 blur-[150px]" />

      <div className="w-full max-w-lg relative z-10">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-lime" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-lime" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-lime" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-lime" />

          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center gap-3 group">
              <div className="bg-lime text-black p-3 relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-black" />
                <span className="font-display text-2xl leading-none font-bold">HS</span>
              </div>
              <div className="text-left">
                <span className="font-display text-xl text-white leading-none block tracking-wider">
                  HOUSE OF
                </span>
                <span className="font-display text-xl text-lime leading-none block tracking-wider">
                  SUPPLEMENTS
                </span>
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-2xl text-white mb-2">KREIRAJTE NALOG</h1>
            <p className="text-zinc-500">Registrujte se za lakšu kupovinu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Email adresa *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vas@email.com"
                className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Lozinka *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Potvrdite lozinku *
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Ime i prezime *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vaše ime i prezime"
                className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Telefon
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06X XXX XXXX"
                className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Adresa
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ulica i broj"
                className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
              />
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Grad
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Beograd"
                  className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Poštanski broj
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="11000"
                  className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime text-black font-bold py-4 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
                  Registracija u toku...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Registruj se
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500">
              Već imate nalog?{" "}
              <Link href="/login" className="text-lime font-bold hover:underline">
                Prijavite se
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-lime to-transparent opacity-50" />
      </div>
    </div>
  );
}
