import Link from "next/link";
import { CheckCircle2, Package, Truck, CreditCard, Home } from "lucide-react";

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = await params;

  return (
    <div className="bg-zinc-950 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success card */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 relative text-center">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-lime" />

            {/* Success icon */}
            <div className="w-24 h-24 bg-lime text-black mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-white mb-4">
              HVALA NA <span className="text-lime">PORUDŽBINI!</span>
            </h1>

            <p className="text-zinc-400 mb-6 text-lg">
              Vaša porudžbina je uspešno primljena i biće obrađena u najkraćem roku.
            </p>

            {/* Order number */}
            <div className="bg-black border border-zinc-800 p-4 mb-8 inline-block">
              <p className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Broj porudžbine</p>
              <p className="font-display text-2xl text-lime">{orderNumber}</p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-black/50 border border-zinc-800 p-4">
                <Package className="h-8 w-8 text-lime mx-auto mb-3" />
                <h3 className="font-bold text-white mb-1">Priprema</h3>
                <p className="text-zinc-500 text-sm">Pakujemo vašu porudžbinu</p>
              </div>
              <div className="bg-black/50 border border-zinc-800 p-4">
                <Truck className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-500 mb-1">Dostava</h3>
                <p className="text-zinc-600 text-sm">Šaljemo na vašu adresu</p>
              </div>
              <div className="bg-black/50 border border-zinc-800 p-4">
                <CreditCard className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-500 mb-1">Plaćanje</h3>
                <p className="text-zinc-600 text-sm">Platite kuriru pouzećem</p>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-lime/10 border border-lime/30 p-4 mb-8 text-left">
              <h3 className="font-bold text-lime mb-2">Šta sledi?</h3>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li>• Primićete email potvrdu sa detaljima porudžbine</li>
                <li>• Kurirska služba će vas kontaktirati pre isporuke</li>
                <li>• Plaćanje se vrši gotovinom ili karticom pri preuzimanju</li>
                <li>• Rok isporuke je 1-3 radna dana</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="bg-lime text-black font-bold px-8 py-4 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Home className="h-5 w-5" />
                  Nazad na početnu
                </button>
              </Link>
            </div>
          </div>

          {/* Contact info */}
          <div className="text-center mt-8">
            <p className="text-zinc-500">
              Imate pitanja?{" "}
              <a href="tel:0644142678" className="text-lime hover:underline font-bold">
                Pozovite nas
              </a>{" "}
              ili nam pišite na{" "}
              <a href="mailto:info@houseofsupplements.rs" className="text-lime hover:underline font-bold">
                info@houseofsupplements.rs
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
