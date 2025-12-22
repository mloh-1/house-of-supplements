"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Store, Truck, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SiteSettings {
  id: string;
  storeName: string;
  storeEmail: string | null;
  storePhone1: string | null;
  storePhone2: string | null;
  storeAddress1: string | null;
  storeAddress2: string | null;
  freeShippingMin: number;
  shippingCost: number;
  currency: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Podešavanja su uspešno sačuvana" });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Došlo je do greške" });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Došlo je do greške" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-800 w-48 animate-pulse" />
        <div className="bg-zinc-900 border border-zinc-800 h-96 animate-pulse" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Greška pri učitavanju podešavanja
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Settings className="h-6 w-6 text-lime" />
          <div>
            <h1 className="font-display text-2xl text-white">PODEŠAVANJA</h1>
            <p className="text-zinc-500">Konfiguracija prodavnice</p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-lime/20 border border-lime/30 text-lime"
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Info */}
        <div className="bg-zinc-900 border border-zinc-800 relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
          <div className="p-6 border-b border-zinc-800">
            <h2 className="font-display text-lg text-white flex items-center gap-2">
              <Store className="h-5 w-5 text-lime" />
              Informacije o prodavnici
            </h2>
          </div>
          <div className="p-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Naziv prodavnice
              </label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="bg-black border-zinc-700 text-white focus:border-lime"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Email
              </label>
              <Input
                type="email"
                value={settings.storeEmail || ""}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                placeholder="info@prodavnica.rs"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Telefon 1
              </label>
              <Input
                value={settings.storePhone1 || ""}
                onChange={(e) => setSettings({ ...settings, storePhone1: e.target.value })}
                placeholder="+381 11 123 4567"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Telefon 2
              </label>
              <Input
                value={settings.storePhone2 || ""}
                onChange={(e) => setSettings({ ...settings, storePhone2: e.target.value })}
                placeholder="+381 60 123 4567"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Adresa 1
              </label>
              <Input
                value={settings.storeAddress1 || ""}
                onChange={(e) => setSettings({ ...settings, storeAddress1: e.target.value })}
                placeholder="Ulica i broj"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Adresa 2 (grad, poštanski broj)
              </label>
              <Input
                value={settings.storeAddress2 || ""}
                onChange={(e) => setSettings({ ...settings, storeAddress2: e.target.value })}
                placeholder="11000 Beograd"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-zinc-900 border border-zinc-800 relative">
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
          <div className="p-6 border-b border-zinc-800">
            <h2 className="font-display text-lg text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-lime" />
              Dostava
            </h2>
          </div>
          <div className="p-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Cena dostave (RSD)
              </label>
              <Input
                type="number"
                value={settings.shippingCost}
                onChange={(e) => setSettings({ ...settings, shippingCost: parseFloat(e.target.value) || 0 })}
                className="bg-black border-zinc-700 text-white focus:border-lime"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Besplatna dostava iznad (RSD)
              </label>
              <Input
                type="number"
                value={settings.freeShippingMin}
                onChange={(e) => setSettings({ ...settings, freeShippingMin: parseFloat(e.target.value) || 0 })}
                className="bg-black border-zinc-700 text-white focus:border-lime"
              />
              <p className="text-xs text-zinc-500">
                Porudžbine iznad ovog iznosa imaju besplatnu dostavu
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-zinc-900 border border-zinc-800 relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
          <div className="p-6 border-b border-zinc-800">
            <h2 className="font-display text-lg text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-lime" />
              Društvene mreže
            </h2>
          </div>
          <div className="p-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Facebook URL
              </label>
              <Input
                value={settings.facebookUrl || ""}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/vasastranica"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Instagram URL
              </label>
              <Input
                value={settings.instagramUrl || ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/vasnalog"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-lime text-black font-bold px-8 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Čuvanje..." : "Sačuvaj podešavanja"}
          </button>
        </div>
      </form>
    </div>
  );
}
