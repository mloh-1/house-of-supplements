"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Zap, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-lime/5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-lime/5 blur-[100px]" />

      {/* Newsletter section - aggressive CTA */}
      <div className="border-b border-zinc-800 relative">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-lime" />
              <span className="text-lime font-bold uppercase tracking-[0.2em] text-sm">
                Budi u toku
              </span>
            </div>
            <h3 className="font-display text-4xl md:text-5xl mb-4">
              PRIJAVI SE NA <span className="text-lime">NEWSLETTER</span>
            </h3>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              Saznaj prvi za ekskluzivne akcije, nove proizvode i savete za trening.
              Bez spama - samo čista vrednost.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Unesi email adresu"
                className="flex-1 h-14 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 rounded-none focus:border-lime focus:ring-0"
              />
              <Button className="h-14 px-8 bg-lime hover:bg-lime-500 text-black font-bold uppercase tracking-wider rounded-none">
                Prijavi se
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-lime text-black p-2 font-display text-2xl leading-none">
                    HS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime/30" />
                </div>
                <div>
                  <span className="font-display text-lg text-white leading-none block tracking-wider">
                    HOUSE OF
                  </span>
                  <span className="font-display text-lg text-lime leading-none block tracking-wider">
                    SUPPLEMENTS
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Tvoja destinacija za premium suplemente. Samo provereni brendovi,
              kvalitetni proizvodi i brza isporuka.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 hover:bg-lime hover:text-black p-3 transition-all border border-zinc-800 hover:border-lime"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 hover:bg-lime hover:text-black p-3 transition-all border border-zinc-800 hover:border-lime"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@houseofsupplements.rs"
                className="bg-zinc-900 hover:bg-lime hover:text-black p-3 transition-all border border-zinc-800 hover:border-lime"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-xl mb-6 flex items-center gap-2">
              <span className="text-lime">//</span> INFORMACIJE
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/uslovi-kupovine", label: "Uslovi kupovine" },
                { href: "/politika-privatnosti", label: "Politika privatnosti" },
                { href: "/kontakt", label: "Kontakt" },
                { href: "/o-nama", label: "O nama" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-lime transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-lime transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-xl mb-6 flex items-center gap-2">
              <span className="text-lime">//</span> KATEGORIJE
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/kategorija/proteini", label: "Proteini" },
                { href: "/kategorija/aminokiseline", label: "Aminokiseline" },
                { href: "/kategorija/kreatin", label: "Kreatin" },
                { href: "/kategorija/vitamini", label: "Vitamini" },
                { href: "/akcije", label: "Akcije", highlight: true },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-2 group transition-colors ${
                      link.highlight
                        ? "text-lime font-bold"
                        : "text-zinc-400 hover:text-lime"
                    }`}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-lime transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-6 flex items-center gap-2">
              <span className="text-lime">//</span> KONTAKT
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-lime" />
                <div>
                  <p className="font-bold text-white mb-1">Lokacija 1</p>
                  <p className="text-zinc-400 text-sm">Bulevar Oslobođenja 63</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-lime" />
                <div>
                  <p className="font-bold text-white mb-1">Lokacija 2</p>
                  <p className="text-zinc-400 text-sm">Vojvode Stepe 353</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-lime" />
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <a href="tel:0644142678" className="hover:text-lime transition-colors">
                    064/4142-678
                  </a>
                  <span className="text-zinc-700">|</span>
                  <a href="tel:0654024444" className="hover:text-lime transition-colors">
                    065/40-24-444
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800 relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} House of Supplements. Sva prava
              zadržana.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Dumbbell className="h-4 w-4 text-lime" />
                <span className="text-zinc-500 text-xs uppercase tracking-wider">
                  Built for athletes
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  className="h-5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className="h-5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
