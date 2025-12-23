import {
  Shield,
  Database,
  Eye,
  Lock,
  Cookie,
  UserCheck,
  ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Politika privatnosti | House of Supplements",
  description: "Politika privatnosti House of Supplements online prodavnice",
};

const sections = [
  {
    icon: Database,
    title: "PRIKUPLJANJE PODATAKA",
    content: "Prikupljamo sledeće vrste podataka kako bismo vam pružili najbolju uslugu:",
    items: [
      { label: "Lični podaci", desc: "ime, prezime, email adresa, broj telefona, adresa za dostavu" },
      { label: "Podaci o porudžbinama", desc: "istorija kupovine, omiljeni proizvodi" },
      { label: "Tehnički podaci", desc: "IP adresa, tip pretraživača, podaci o uređaju" },
    ],
  },
  {
    icon: Eye,
    title: "KORIŠĆENJE PODATAKA",
    content: "Vaše podatke koristimo isključivo za:",
    items: [
      { label: "Obrada porudžbina", desc: "procesiranje i isporuka vaših narudžbina" },
      { label: "Komunikacija", desc: "obaveštenja u vezi sa vašim porudžbinama" },
      { label: "Marketing", desc: "slanje newsletter-a i promocija (uz vašu saglasnost)" },
      { label: "Unapređenje", desc: "poboljšanje web stranice i korisničkog iskustva" },
    ],
  },
  {
    icon: Lock,
    title: "ZAŠTITA PODATAKA",
    content: "Preduzimamo odgovarajuće tehničke i organizacione mere za zaštitu vaših podataka od neovlašćenog pristupa, izmene, otkrivanja ili uništenja. Vaši podaci su zaštićeni SSL enkripcijom i čuvaju se na sigurnim serverima.",
    items: [],
  },
  {
    icon: UserCheck,
    title: "VAŠA PRAVA",
    content: "U skladu sa zakonom, imate sledeća prava:",
    items: [
      { label: "Pristup", desc: "možete zatražiti uvid u vaše lične podatke" },
      { label: "Ispravka", desc: "možete zatražiti ispravku netačnih podataka" },
      { label: "Brisanje", desc: "možete zatražiti brisanje vaših podataka" },
      { label: "Prigovor", desc: "možete uložiti prigovor na obradu podataka" },
    ],
  },
  {
    icon: Cookie,
    title: "KOLAČIĆI",
    content: "Naša web stranica koristi kolačiće za poboljšanje korisničkog iskustva. Kolačići su mali tekstualni fajlovi koji se čuvaju na vašem uređaju. Možete kontrolisati kolačiće kroz podešavanja vašeg pretraživača.",
    items: [],
  },
];

export default function PolitikaPrivatnostiPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Hexagonal pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 20V40L30 55L5 40V20L30 5Z' stroke='%23a3e635' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-lime/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-lime/3 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Shield Icon */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-lime/20 blur-xl" />
                <div className="relative bg-zinc-900 border-2 border-lime p-6">
                  <Shield className="h-12 w-12 text-lime" />
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-zinc-700" />
              <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Vaša privatnost</span>
              <div className="h-px w-8 bg-zinc-700" />
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-6">
              POLITIKA
              <br />
              <span className="text-lime">PRIVATNOSTI</span>
            </h1>

            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              House of Supplements poštuje vašu privatnost i posvećen je zaštiti vaših ličnih podataka u skladu sa zakonskim propisima.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Two column layout for larger screens */}
            <div className="grid lg:grid-cols-2 gap-6">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className={`group relative ${
                    section.items.length === 0 ? 'lg:col-span-1' : ''
                  } ${index === sections.length - 1 && sections.length % 2 !== 0 ? 'lg:col-span-2 lg:max-w-[calc(50%-12px)]' : ''}`}
                >
                  <div className="relative h-full bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 hover:border-lime/30 transition-all duration-500 overflow-hidden">
                    {/* Animated corner */}
                    <div className="absolute top-0 left-0 w-16 h-16">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-lime to-transparent" />
                      <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-lime to-transparent" />
                    </div>

                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="bg-lime/10 p-3 border border-lime/20">
                          <section.icon className="h-6 w-6 text-lime" />
                        </div>
                        <div>
                          <h2 className="font-display text-xl text-white">{section.title}</h2>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-zinc-400 mb-6 leading-relaxed">{section.content}</p>

                      {/* Items */}
                      {section.items.length > 0 && (
                        <div className="space-y-3">
                          {section.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                              <ChevronRight className="h-5 w-5 text-lime shrink-0 mt-0.5" />
                              <div>
                                <span className="text-white font-medium">{item.label}</span>
                                <span className="text-zinc-500"> — {item.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-zinc-900/50 border border-zinc-800">
                <Lock className="h-5 w-5 text-lime" />
                <span className="text-zinc-400 text-sm">
                  Poslednja izmena: Decembar 2024.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
    </div>
  );
}
