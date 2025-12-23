import { Dumbbell } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "O nama | House of Supplements",
  description: "Saznajte više o House of Supplements - vašoj destinaciji za premium suplemente",
};

const defaultContent = `<h2>NAŠA PRIČA</h2>
<p>House of Supplements je nastao iz ljubavi prema fitnesu i želje da sportistima u Srbiji obezbedimo pristup najboljim svetskim suplementima po pristupačnim cenama.</p>

<h2>NAŠA MISIJA</h2>
<p>Naša misija je jednostavna - da vam omogućimo pristup vrhunskim suplementima koji će vam pomoći da postignete svoje fitnes ciljeve, bilo da ste profesionalni sportista ili tek počinjete sa treningom.</p>
<p>Verujemo da svako zaslužuje pristup kvalitetnim proizvodima bez preterano visokih cena.</p>

<h2>ZAŠTO MI?</h2>
<ul>
<li><strong>100% Originalno</strong> - Garantujemo autentičnost svih proizvoda</li>
<li><strong>Brza dostava</strong> - Isporuka u roku od 1-3 radna dana</li>
<li><strong>Premium kvalitet</strong> - Samo provereni brendovi</li>
<li><strong>Stručna podrška</strong> - Tu smo da vam pomognemo sa savetima</li>
</ul>

<p>Hvala vam što ste deo naše priče. Vidimo se u teretani! 💪</p>`;

async function getPageContent() {
  try {
    const page = await db.pageContent.findUnique({
      where: { id: "o-nama" },
    });
    return page?.content || defaultContent;
  } catch {
    return defaultContent;
  }
}

export default async function ONamaPage() {
  const content = await getPageContent();

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6 text-lime" />
            <span className="text-lime font-bold uppercase tracking-[0.2em] text-sm">
              Naša priča
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            O <span className="text-lime">NAMA</span>
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
