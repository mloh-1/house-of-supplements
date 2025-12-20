"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Demo: simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/admin");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime/10 blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime/5 blur-[150px]" />

      <div className="w-full max-w-md relative z-10">
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
            <h1 className="font-display text-2xl text-white mb-2">DOBRODOŠLI NAZAD</h1>
            <p className="text-zinc-500">Prijavite se na vaš nalog</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Email adresa
              </label>
              <Input
                id="email"
                type="email"
                placeholder="vas@email.com"
                className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                Lozinka
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox className="border-zinc-600 data-[state=checked]:bg-lime data-[state=checked]:border-lime" />
                <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  Zapamti me
                </span>
              </label>
              <Link
                href="/zaboravljena-lozinka"
                className="text-sm text-lime hover:underline font-bold"
              >
                Zaboravljena lozinka?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime text-black font-bold py-4 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
                  Prijava u toku...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Prijavi se
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500">
              Nemate nalog?{" "}
              <Link
                href="/registracija"
                className="text-lime font-bold hover:underline"
              >
                Registrujte se
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
