import {
  Dumbbell,
  Target,
  Award,
  Truck,
  Shield,
  HeartHandshake,
  Zap,
  CheckCircle
} from "lucide-react";

export const metadata = {
  title: "O nama | House of Supplements",
  description: "Saznajte više o House of Supplements - vašoj destinaciji za premium suplemente",
};

const values = [
  {
    icon: Award,
    title: "100% ORIGINALNO",
    description: "Garantujemo autentičnost svih proizvoda. Radimo direktno sa proizvođačima.",
  },
  {
    icon: Truck,
    title: "BRZA DOSTAVA",
    description: "Isporuka u roku od 1-3 radna dana na teritoriji cele Srbije.",
  },
  {
    icon: Shield,
    title: "PREMIUM KVALITET",
    description: "Samo provereni brendovi i vrhunski kvalitet proizvoda.",
  },
  {
    icon: HeartHandshake,
    title: "STRUČNA PODRŠKA",
    description: "Tu smo da vam pomognemo sa savetima i odgovorimo na sva pitanja.",
  },
];

const stats = [
  { value: "5000+", label: "Zadovoljnih kupaca" },
  { value: "500+", label: "Proizvoda u ponudi" },
  { value: "15+", label: "Premium brendova" },
  { value: "24h", label: "Podrška kupcima" },
];

export default function ONamaPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient mesh */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-lime/3 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-lime/5 blur-[120px]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(163, 230, 53, 1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(163, 230, 53, 1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text content */}
              <div>
                {/* Label */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-lime p-2">
                    <Dumbbell className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-lime font-mono text-sm tracking-widest">NAŠA PRIČA</span>
                </div>

                {/* Title */}
                <h1 className="font-display text-5xl md:text-7xl text-white leading-[0.9] mb-8">
                  HOUSE OF
                  <br />
                  <span className="text-lime">SUPPLEMENTS</span>
                </h1>

                <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                  <p>
                    House of Supplements je nastao iz ljubavi prema fitnesu i želje da sportistima
                    u Srbiji obezbedimo pristup <span className="text-white">najboljim svetskim suplementima</span> po
                    pristupačnim cenama.
                  </p>
                  <p>
                    Verujemo da svako zaslužuje pristup kvalitetnim proizvodima bez preterano
                    visokih cena — bilo da ste profesionalni sportista ili tek počinjete sa treningom.
                  </p>
                </div>
              </div>

              {/* Right: Visual element */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Large decorative letters */}
                  <div className="font-display text-[16rem] leading-none text-zinc-900 select-none">
                    HS
                  </div>
                  {/* Accent overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-lime/30 blur-3xl" />
                      <div className="relative border-4 border-lime p-8">
                        <Zap className="h-16 w-16 text-lime" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <Target className="h-6 w-6 text-lime" />
              <span className="font-display text-xl text-white">NAŠA MISIJA</span>
            </div>

            <p className="text-2xl md:text-3xl text-zinc-300 leading-relaxed">
              Da vam omogućimo pristup <span className="text-lime font-bold">vrhunskim suplementima</span> koji
              će vam pomoći da postignete svoje fitnes ciljeve, bez kompromisa na kvalitetu i ceni.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative text-center p-8 bg-zinc-900 border border-zinc-800 group hover:border-lime/30 transition-all"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[2px] bg-lime transition-all duration-500" />

                  <div className="font-display text-4xl md:text-5xl text-lime mb-2">
                    {stat.value}
                  </div>
                  <div className="text-zinc-500 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-lime" />
                <span className="text-lime font-mono text-sm tracking-widest">ZAŠTO MI</span>
                <div className="h-px w-12 bg-lime" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">
                ŠTA NAS <span className="text-lime">IZDVAJA</span>
              </h2>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-zinc-900 border border-zinc-800 hover:border-lime/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Background number */}
                  <div className="absolute -right-4 -bottom-8 font-display text-[10rem] leading-none text-zinc-800/30 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative p-8">
                    <div className="flex items-start gap-6">
                      <div className="bg-lime/10 p-4 border border-lime/30 group-hover:bg-lime group-hover:border-lime transition-all duration-300">
                        <value.icon className="h-8 w-8 text-lime group-hover:text-black transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl text-white mb-3 flex items-center gap-2">
                          {value.title}
                          <CheckCircle className="h-5 w-5 text-lime" />
                        </h3>
                        <p className="text-zinc-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-lime p-12 md:p-16 text-center">
              {/* Corner cuts */}
              <div className="absolute top-0 left-0 w-8 h-8 bg-zinc-950" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
              <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-950" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-zinc-950" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-zinc-950" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />

              <Dumbbell className="h-12 w-12 text-black mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl text-black mb-4">
                HVALA VAM ŠTO STE DEO NAŠE PRIČE
              </h2>
              <p className="text-black/70 text-lg">
                Vidimo se u teretani!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
    </div>
  );
}
