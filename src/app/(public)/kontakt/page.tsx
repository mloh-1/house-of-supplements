"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function KontaktPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch("/api/pages/kontakt");
        if (response.ok) {
          const data = await response.json();
          setPageContent(data.content);
        }
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    }
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Poruka poslata!",
      description: "Hvala vam na poruci. Odgovorićemo vam u najkraćem roku.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsLoading(false);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-lime" />
            <span className="text-lime font-bold uppercase tracking-[0.2em] text-sm">
              Pišite nam
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            KONTAKTIRAJTE <span className="text-lime">NAS</span>
          </h1>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
            Imate pitanje ili vam je potrebna pomoć? Tu smo za vas!
          </p>
        </div>

        {/* Custom content from admin */}
        {pageContent && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6">
              <div
                className="prose prose-invert prose-lime max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-lime prose-a:text-lime"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Locations */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lime" />
                <div className="flex items-start gap-4">
                  <div className="bg-lime/10 p-3 border border-lime/30">
                    <MapPin className="h-5 w-5 text-lime" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Lokacije</h3>
                    <div className="text-zinc-400 text-sm space-y-2">
                      <p>Bulevar Oslobođenja 63</p>
                      <p>Vojvode Stepe 353</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lime" />
                <div className="flex items-start gap-4">
                  <div className="bg-lime/10 p-3 border border-lime/30">
                    <Phone className="h-5 w-5 text-lime" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Telefon</h3>
                    <div className="text-zinc-400 text-sm space-y-1">
                      <a href="tel:0644142678" className="block hover:text-lime transition-colors">
                        064/4142-678
                      </a>
                      <a href="tel:0654024444" className="block hover:text-lime transition-colors">
                        065/40-24-444
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lime" />
                <div className="flex items-start gap-4">
                  <div className="bg-lime/10 p-3 border border-lime/30">
                    <Mail className="h-5 w-5 text-lime" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Email</h3>
                    <a
                      href="mailto:info@houseofsupplements.rs"
                      className="text-zinc-400 text-sm hover:text-lime transition-colors"
                    >
                      info@houseofsupplements.rs
                    </a>
                  </div>
                </div>
              </div>

              {/* Working hours */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lime" />
                <div className="flex items-start gap-4">
                  <div className="bg-lime/10 p-3 border border-lime/30">
                    <Clock className="h-5 w-5 text-lime" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Radno vreme</h3>
                    <div className="text-zinc-400 text-sm space-y-1">
                      <p>Ponedeljak - Petak: 09:00 - 20:00</p>
                      <p>Subota: 09:00 - 15:00</p>
                      <p>Nedelja: Zatvoreno</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900 border border-zinc-800 p-8 relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-lime" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-lime" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-lime" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-lime" />

                <h2 className="font-display text-2xl text-white mb-6 flex items-center gap-2">
                  <span className="text-lime">//</span> POŠALJITE NAM PORUKU
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                        Ime i prezime *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Vaše ime"
                        className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                        Email adresa *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vas@email.com"
                        className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                        Telefon
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06X XXX XXXX"
                        className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                        Tema *
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="O čemu se radi?"
                        className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                      Poruka *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Napišite vašu poruku ovde..."
                      rows={6}
                      className="w-full bg-black border border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime focus:outline-none focus:ring-0 p-4 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto bg-lime hover:bg-lime-500 text-black font-bold py-4 px-8 uppercase tracking-wider rounded-none"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2" />
                        Slanje...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Pošalji poruku
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
