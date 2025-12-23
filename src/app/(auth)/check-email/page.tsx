"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, RefreshCw, Check } from "lucide-react";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResendError(data.error || "Došlo je do greške");
        return;
      }

      setResendSuccess(true);
    } catch {
      setResendError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setIsResending(false);
    }
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

          {/* Content */}
          <div className="text-center">
            <div className="bg-lime/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-lime" />
            </div>

            <h1 className="font-display text-2xl text-white mb-2">PROVERITE EMAIL</h1>
            <p className="text-zinc-400 mb-6">
              Poslali smo vam email sa linkom za potvrdu naloga.
              Molimo proverite vašu inbox i spam folder.
            </p>

            {email && (
              <div className="bg-zinc-800/50 border border-zinc-700 p-4 mb-4">
                <p className="text-zinc-400 text-sm mb-1">Email poslat na:</p>
                <p className="text-lime font-medium">{email}</p>
              </div>
            )}

            <div className="bg-zinc-800/50 border border-zinc-700 p-4 mb-6">
              <p className="text-zinc-500 text-sm">
                Link za potvrdu ističe za <span className="text-lime font-bold">24 sata</span>.
              </p>
            </div>

            {/* Resend section */}
            {email && (
              <div className="mb-6">
                {resendSuccess ? (
                  <div className="flex items-center justify-center gap-2 text-lime bg-lime/10 border border-lime/30 py-3 px-4">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Email je ponovo poslat!</span>
                  </div>
                ) : (
                  <>
                    {resendError && (
                      <div className="text-red-400 bg-red-500/10 border border-red-500/30 py-2 px-4 mb-3 text-sm">
                        {resendError}
                      </div>
                    )}
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="flex items-center justify-center gap-2 w-full border border-zinc-700 text-zinc-300 py-3 px-4 hover:border-lime hover:text-lime transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
                      <span className="text-sm">
                        {isResending ? "Slanje..." : "Pošalji email ponovo"}
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/login"
                className="block bg-lime text-black font-bold py-3 px-8 uppercase tracking-wider hover:bg-lime-400 transition-colors"
              >
                Idi na prijavu
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-zinc-500 hover:text-lime transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Nazad na početnu
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-lime to-transparent opacity-50" />
      </div>
    </div>
  );
}
