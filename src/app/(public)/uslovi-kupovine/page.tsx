import { FileText } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Uslovi kupovine | House of Supplements",
  description: "Uslovi kupovine u House of Supplements online prodavnici",
};

const defaultContent = `<h2>NARUČIVANJE</h2>
<p>Porudžbine možete izvršiti putem naše web stranice 24 sata dnevno, 7 dana u nedelji. Nakon što dodate proizvode u korpu i popunite podatke za dostavu, dobićete email potvrdu o vašoj porudžbini.</p>
<p>Minimalna vrednost porudžbine ne postoji. Sve cene na sajtu su izražene u dinarima (RSD) i uključuju PDV.</p>

<h2>DOSTAVA</h2>
<p>Dostava se vrši na teritoriji cele Srbije putem kurirske službe. Rok isporuke je 1-3 radna dana od momenta potvrde porudžbine.</p>
<ul>
<li>Porudžbine preko 4.000 RSD - <strong>BESPLATNA DOSTAVA</strong></li>
<li>Porudžbine ispod 4.000 RSD - dostava se naplaćuje 350 RSD</li>
</ul>

<h2>NAČINI PLAĆANJA</h2>
<p>Nudimo sledeće načine plaćanja:</p>
<ul>
<li>Plaćanje pouzećem (gotovina prilikom preuzimanja)</li>
<li>Plaćanje platnim karticama (Visa, Mastercard)</li>
<li>Plaćanje uplatnicom na račun</li>
</ul>

<h2>POVRAT ROBE</h2>
<p>U skladu sa Zakonom o zaštiti potrošača, imate pravo da odustanete od ugovora u roku od 14 dana od dana prijema robe, bez navođenja razloga.</p>
<p>Da biste ostvarili pravo na povrat, proizvod mora biti nekorišćen i u originalnom pakovanju.</p>

<h2>REKLAMACIJE</h2>
<p>U slučaju da primite oštećen proizvod ili proizvod koji ne odgovara vašoj porudžbini, molimo vas da nas kontaktirate u roku od 24 sata od prijema pošiljke.</p>`;

async function getPageContent() {
  try {
    const page = await db.pageContent.findUnique({
      where: { id: "uslovi-kupovine" },
    });
    return page?.content || defaultContent;
  } catch {
    return defaultContent;
  }
}

export default async function UsloviKupovinePage() {
  const content = await getPageContent();

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-lime" />
            <span className="text-lime font-bold uppercase tracking-[0.2em] text-sm">
              Informacije
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            USLOVI <span className="text-lime">KUPOVINE</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
