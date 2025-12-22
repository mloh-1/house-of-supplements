"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, MapPin, Save, Loader2, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  role: string;
}

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        toast({
          title: "Profil sačuvan",
          description: "Vaši podaci su uspešno ažurirani.",
        });
      } else {
        toast({
          title: "Greška",
          description: "Došlo je do greške prilikom čuvanja profila.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom čuvanja profila.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-lime animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-lime/20 border border-lime/30 p-4">
          <User className="h-8 w-8 text-lime" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-white">MOJ PROFIL</h1>
          <p className="text-zinc-500">Upravljajte svojim admin nalogom</p>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 mb-6 flex items-center gap-3">
        <div className="bg-lime/20 border border-lime/30 p-2">
          <Shield className="h-5 w-5 text-lime" />
        </div>
        <div>
          <p className="text-lime font-bold uppercase tracking-wider text-sm">Administrator</p>
          <p className="text-zinc-500 text-sm">{profile?.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="space-y-6">
          {/* Email (read-only) */}
          <div>
            <Label className="text-zinc-400 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              value={profile?.email || ""}
              disabled
              className="mt-2 bg-black/50 border-zinc-700 text-zinc-500"
            />
            <p className="text-xs text-zinc-600 mt-1">Email adresa se ne može promeniti</p>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-zinc-400 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
              <User className="h-4 w-4" />
              Ime i prezime
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Unesite ime i prezime"
              className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-zinc-400 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefon
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Unesite broj telefona"
              className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="text-zinc-400 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresa
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Unesite adresu"
              className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
            />
          </div>

          {/* City and Postal Code */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                Grad
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Unesite grad"
                className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
            <div>
              <Label htmlFor="postalCode" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                Poštanski broj
              </Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Unesite poštanski broj"
                className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="bg-lime hover:bg-lime-400 text-black font-bold px-6 py-3 uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Čuvanje...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sačuvaj izmene
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
