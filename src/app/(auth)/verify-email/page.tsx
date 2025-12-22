"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setStatus("error");
      setMessage("Nevažeći link za verifikaciju.");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Došlo je do greške prilikom verifikacije.");
      }
    } catch {
      setStatus("error");
      setMessage("Došlo je do greške. Pokušajte ponovo.");
    }
  }, [token, router]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

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

          {/* Status */}
          <div className="text-center">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 text-lime mx-auto mb-4 animate-spin" />
                <h1 className="font-display text-2xl text-white mb-2">VERIFIKACIJA U TOKU</h1>
                <p className="text-zinc-500">Molimo sačekajte...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 text-lime mx-auto mb-4" />
                <h1 className="font-display text-2xl text-white mb-2">EMAIL POTVRĐEN</h1>
                <p className="text-zinc-500 mb-6">{message}</p>
                <p className="text-zinc-600 text-sm mb-6">Preusmeravamo vas na stranicu za prijavu...</p>
                <Link
                  href="/login"
                  className="inline-block bg-lime text-black font-bold py-3 px-8 uppercase tracking-wider hover:bg-lime-400 transition-colors"
                >
                  Prijavi se
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="font-display text-2xl text-white mb-2">GREŠKA</h1>
                <p className="text-zinc-500 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    href="/registracija"
                    className="block bg-lime text-black font-bold py-3 px-8 uppercase tracking-wider hover:bg-lime-400 transition-colors"
                  >
                    Registruj se ponovo
                  </Link>
                  <Link
                    href="/login"
                    className="block text-lime font-bold hover:underline"
                  >
                    Već imate nalog? Prijavite se
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-lime to-transparent opacity-50" />
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lime animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
