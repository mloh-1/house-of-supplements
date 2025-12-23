import { Shield } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Politika privatnosti | House of Supplements",
  description: "Politika privatnosti House of Supplements online prodavnice",
};

const defaultContent = `<p>House of Supplements poštuje vašu privatnost i posvećen je zaštiti vaših ličnih podataka.</p>

<h2>PRIKUPLJANJE PODATAKA</h2>
<p>Prikupljamo sledeće vrste podataka:</p>
<ul>
<li>Lični podaci: ime, prezime, email adresa, broj telefona, adresa za dostavu</li>
<li>Podaci o porudžbinama: istorija kupovine, omiljeni proizvodi</li>
<li>Tehnički podaci: IP adresa, tip pretraživača, podaci o uređaju</li>
</ul>

<h2>KORIŠĆENJE PODATAKA</h2>
<p>Vaše podatke koristimo za:</p>
<ul>
<li>Obradu i isporuku vaših porudžbina</li>
<li>Komunikaciju u vezi sa vašim porudžbinama</li>
<li>Slanje newsletter-a i promotivnih materijala (uz vašu saglasnost)</li>
<li>Poboljšanje naše web stranice i korisničkog iskustva</li>
</ul>

<h2>ZAŠTITA PODATAKA</h2>
<p>Preduzimamo odgovarajuće tehničke i organizacione mere za zaštitu vaših podataka od neovlašćenog pristupa, izmene, otkrivanja ili uništenja.</p>

<h2>VAŠA PRAVA</h2>
<p>U skladu sa zakonom, imate pravo da zatražite pristup, ispravku ili brisanje vaših ličnih podataka.</p>

<h2>KOLAČIĆI</h2>
<p>Naša web stranica koristi kolačiće za poboljšanje korisničkog iskustva.</p>`;

async function getPageContent() {
  try {
    const page = await db.pageContent.findUnique({
      where: { id: "politika-privatnosti" },
    });
    return page?.content || defaultContent;
  } catch {
    return defaultContent;
  }
}

export default async function PolitikaPrivatnostiPage() {
  const content = await getPageContent();

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-lime" />
            <span className="text-lime font-bold uppercase tracking-[0.2em] text-sm">
              Vaša privatnost
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            POLITIKA <span className="text-lime">PRIVATNOSTI</span>
          </h1>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-lime" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-lime" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-lime" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-lime" />

            <div
              className="prose prose-invert prose-lime max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-lime prose-a:text-lime prose-ul:text-zinc-400"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Date */}
            <div className="pt-8 mt-8 border-t border-zinc-800 text-zinc-500 text-sm">
              Poslednja izmena: Decembar 2024.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
