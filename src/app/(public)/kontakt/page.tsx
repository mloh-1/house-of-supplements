import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Navigation
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kontakt | House of Supplements",
  description: "Kontaktirajte House of Supplements - lokacije, telefoni i radno vreme",
};

const locations = [
  {
    id: 1,
    name: "Bulevar Oslobođenja 63",
    area: "Voždovac, Beograd",
    mapUrl: "https://maps.google.com/?q=Bulevar+Oslobodjenja+63+Beograd",
  },
  {
    id: 2,
    name: "Vojvode Stepe 353",
    area: "Voždovac, Beograd",
    mapUrl: "https://maps.google.com/?q=Vojvode+Stepe+353+Beograd",
  },
];

const phones = [
  { number: "064/4142-678", formatted: "0644142678" },
  { number: "065/40-24-444", formatted: "0654024444" },
];

const workingHours = [
  { days: "Ponedeljak - Petak", hours: "09:00 - 20:00" },
  { days: "Subota", hours: "09:00 - 15:00" },
  { days: "Nedelja", hours: "Zatvoreno" },
];

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-lime/5 rounded-full blur-[150px]" />

        {/* Decorative lines */}
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated icon */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-lime/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative bg-lime p-5">
                  <MessageCircle className="h-10 w-10 text-black" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-6">
              KONTAKTIRAJTE
              <br />
              <span className="text-lime">NAS</span>
            </h1>

            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Tu smo za sva vaša pitanja. Posetite nas na jednoj od naših lokacija ili nas kontaktirajte telefonom.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">

              {/* Locations Card */}
              <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-lime/30 transition-all duration-500">
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-20 h-20">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-lime" />
                  <div className="absolute top-0 left-0 h-full w-[3px] bg-lime" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-lime p-4">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-white">LOKACIJE</h2>
                      <p className="text-zinc-500 text-sm">Posetite nas</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {locations.map((location) => (
                      <Link
                        key={location.id}
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 p-4 bg-zinc-800/50 border border-zinc-700 hover:border-lime/50 hover:bg-zinc-800 transition-all group/item"
                      >
                        <div className="bg-lime/10 p-2 border border-lime/30 group-hover/item:bg-lime/20 transition-colors">
                          <Navigation className="h-4 w-4 text-lime" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium group-hover/item:text-lime transition-colors">
                            {location.name}
                          </div>
                          <div className="text-zinc-500 text-sm">{location.area}</div>
                        </div>
                        <span className="text-lime opacity-0 group-hover/item:opacity-100 transition-opacity text-sm">
                          Mapa →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-lime/30 transition-all duration-500">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20">
                  <div className="absolute top-0 right-0 w-full h-[3px] bg-lime" />
                  <div className="absolute top-0 right-0 h-full w-[3px] bg-lime" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-lime p-4">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-white">TELEFON</h2>
                      <p className="text-zinc-500 text-sm">Pozovite nas</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {phones.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone.formatted}`}
                        className="flex items-center gap-4 p-4 bg-zinc-800/50 border border-zinc-700 hover:border-lime/50 hover:bg-zinc-800 transition-all group/item"
                      >
                        <div className="flex-1">
                          <div className="text-2xl font-mono text-white group-hover/item:text-lime transition-colors">
                            {phone.number}
                          </div>
                        </div>
                        <div className="bg-lime/10 p-2 border border-lime/30 group-hover/item:bg-lime group-hover/item:border-lime transition-all">
                          <Phone className="h-4 w-4 text-lime group-hover/item:text-black transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-lime/30 transition-all duration-500">
                {/* Corner accent */}
                <div className="absolute bottom-0 left-0 w-20 h-20">
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-lime" />
                  <div className="absolute bottom-0 left-0 h-full w-[3px] bg-lime" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-lime p-4">
                      <Mail className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-white">EMAIL</h2>
                      <p className="text-zinc-500 text-sm">Pišite nam</p>
                    </div>
                  </div>

                  <a
                    href="mailto:info@houseofsupplements.rs"
                    className="flex items-center gap-4 p-4 bg-zinc-800/50 border border-zinc-700 hover:border-lime/50 hover:bg-zinc-800 transition-all group/item"
                  >
                    <div className="flex-1">
                      <div className="text-xl text-white group-hover/item:text-lime transition-colors break-all">
                        info@houseofsupplements.rs
                      </div>
                      <div className="text-zinc-500 text-sm mt-1">
                        Odgovaramo u roku od 24h
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-lime/30 transition-all duration-500">
                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-20 h-20">
                  <div className="absolute bottom-0 right-0 w-full h-[3px] bg-lime" />
                  <div className="absolute bottom-0 right-0 h-full w-[3px] bg-lime" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-lime p-4">
                      <Clock className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-white">RADNO VREME</h2>
                      <p className="text-zinc-500 text-sm">Kada smo otvoreni</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {workingHours.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 border ${
                          item.hours === "Zatvoreno"
                            ? "bg-zinc-800/30 border-zinc-800"
                            : "bg-zinc-800/50 border-zinc-700"
                        }`}
                      >
                        <span className="text-zinc-400">{item.days}</span>
                        <span className={`font-mono font-bold ${
                          item.hours === "Zatvoreno" ? "text-zinc-600" : "text-lime"
                        }`}>
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-display text-xl text-white mb-2">PRATITE NAS</h3>
                  <p className="text-zinc-500">Budite u toku sa novostima i akcijama</p>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="https://instagram.com/houseofsupplements.rs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4 bg-zinc-800 border border-zinc-700 hover:border-lime hover:bg-zinc-800/80 transition-all group"
                  >
                    <Instagram className="h-5 w-5 text-zinc-400 group-hover:text-lime transition-colors" />
                    <span className="text-zinc-300 group-hover:text-white transition-colors">Instagram</span>
                  </Link>

                  <Link
                    href="https://facebook.com/houseofsupplements.rs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4 bg-zinc-800 border border-zinc-700 hover:border-lime hover:bg-zinc-800/80 transition-all group"
                  >
                    <Facebook className="h-5 w-5 text-zinc-400 group-hover:text-lime transition-colors" />
                    <span className="text-zinc-300 group-hover:text-white transition-colors">Facebook</span>
                  </Link>
                </div>
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
