import {
  ShoppingCart,
  Truck,
  CreditCard,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export const metadata = {
  title: "Uslovi kupovine | House of Supplements",
  description: "Uslovi kupovine u House of Supplements online prodavnici",
};

const sections = [
  {
    id: "01",
    icon: ShoppingCart,
    title: "NARUČIVANJE",
    items: [
      "Porudžbine možete izvršiti putem naše web stranice 24/7",
      "Nakon dodavanja proizvoda u korpu i popunjavanja podataka, dobićete email potvrdu",
      "Minimalna vrednost porudžbine ne postoji",
      "Sve cene su izražene u dinarima (RSD) i uključuju PDV",
    ],
  },
  {
    id: "02",
    icon: Truck,
    title: "DOSTAVA",
    items: [
      "Dostava na teritoriji cele Srbije putem kurirske službe",
      "Rok isporuke: 1-3 radna dana od potvrde porudžbine",
    ],
    highlight: {
      free: "Porudžbine preko 4.000 RSD",
      paid: "Porudžbine ispod 4.000 RSD — dostava 350 RSD",
    },
  },
  {
    id: "03",
    icon: CreditCard,
    title: "NAČINI PLAĆANJA",
    items: [
      "Plaćanje pouzećem (gotovina prilikom preuzimanja)",
      "Plaćanje platnim karticama (Visa, Mastercard)",
      "Plaćanje uplatnicom na račun",
    ],
  },
  {
    id: "04",
    icon: RotateCcw,
    title: "POVRAT ROBE",
    items: [
      "Pravo na odustanak od ugovora u roku od 14 dana od prijema robe",
      "Bez navođenja razloga u skladu sa Zakonom o zaštiti potrošača",
      "Proizvod mora biti nekorišćen i u originalnom pakovanju",
    ],
  },
  {
    id: "05",
    icon: AlertCircle,
    title: "REKLAMACIJE",
    items: [
      "U slučaju oštećenog proizvoda ili pogrešne isporuke",
      "Kontaktirajte nas u roku od 24 sata od prijema pošiljke",
      "Rešavamo svaku reklamaciju u najkraćem mogućem roku",
    ],
  },
];

export default function UsloviKupovinePage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(163, 230, 53, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(163, 230, 53, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Decorative diagonal lines */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] border border-lime/10 rotate-45" />
        <div className="absolute top-40 -right-40 w-[400px] h-[400px] border border-lime/5 rotate-45" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Breadcrumb-style label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-lime" />
              <span className="text-lime font-mono text-sm tracking-widest">INFO / USLOVI</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-6">
              USLOVI
              <br />
              <span className="text-lime">KUPOVINE</span>
            </h1>

            <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
              Sve što treba da znate o naručivanju, dostavi i plaćanju u House of Supplements online prodavnici.
            </p>
          </div>

          {/* Decorative large number */}
          <div className="absolute top-10 right-10 font-display text-[20rem] leading-none text-zinc-900/50 pointer-events-none hidden lg:block">
            HS
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card */}
                <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 transition-all duration-500">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-lime to-lime/0 transition-all duration-700" />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime/50 group-hover:border-lime transition-colors" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime/50 group-hover:border-lime transition-colors" />

                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Left: Number & Icon */}
                      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-6 md:w-32 shrink-0">
                        <span className="font-mono text-5xl md:text-6xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
                          {section.id}
                        </span>
                        <div className="bg-lime/10 p-4 border border-lime/30 group-hover:bg-lime/20 transition-colors">
                          <section.icon className="h-6 w-6 text-lime" />
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1">
                        <h2 className="font-display text-2xl md:text-3xl text-white mb-6 flex items-center gap-3">
                          <span className="text-lime">//</span>
                          {section.title}
                        </h2>

                        <ul className="space-y-4">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-zinc-400">
                              <ArrowRight className="h-5 w-5 text-lime shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Special highlight for shipping */}
                        {section.highlight && (
                          <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <div className="bg-lime/10 border border-lime/30 p-4 flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-lime shrink-0" />
                              <div>
                                <div className="text-lime font-bold text-sm uppercase tracking-wider">Besplatna dostava</div>
                                <div className="text-zinc-400 text-sm">{section.highlight.free}</div>
                              </div>
                            </div>
                            <div className="bg-zinc-800/50 border border-zinc-700 p-4 flex items-center gap-3">
                              <Truck className="h-5 w-5 text-zinc-500 shrink-0" />
                              <div>
                                <div className="text-zinc-300 font-bold text-sm uppercase tracking-wider">Standardna dostava</div>
                                <div className="text-zinc-500 text-sm">{section.highlight.paid}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
    </div>
  );
}
