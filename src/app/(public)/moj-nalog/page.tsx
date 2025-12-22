"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Edit2,
  Save,
  X,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/moj-nalog");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditing(false);
        setSuccess("Profil je uspešno ažuriran");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Došlo je do greške");
      }
    } catch {
      setError("Došlo je do greške");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || "",
      postalCode: profile?.postalCode || "",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="bg-zinc-950 min-h-screen py-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-lime animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">Učitavanje...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <User className="h-8 w-8 text-lime" />
          <div>
            <h1 className="font-display text-3xl text-white">MOJ NALOG</h1>
            <p className="text-zinc-500">Upravljajte svojim podacima i postavkama</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-lime" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-lime" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-lime" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-lime" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-white flex items-center gap-2">
                    <span className="text-lime">//</span> LIČNI PODACI
                  </h2>
                  {!editing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="border-zinc-700 text-zinc-300 hover:border-lime hover:text-lime"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Izmeni
                    </Button>
                  )}
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 mb-4">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-lime/20 border border-lime/30 text-lime px-4 py-3 mb-4">
                    {success}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email (read-only) */}
                  <div>
                    <Label className="text-zinc-400 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <div className="mt-1 p-3 bg-black border border-zinc-800 text-zinc-400">
                      {profile?.email}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <Label className="text-zinc-400 flex items-center gap-2">
                      <User className="h-4 w-4" /> Ime i prezime
                    </Label>
                    {editing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Unesite ime i prezime"
                        className="mt-1 bg-black border-zinc-700 text-white"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-black border border-zinc-800 text-white">
                        {profile?.name || <span className="text-zinc-600">Nije uneseno</span>}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="text-zinc-400 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Telefon
                    </Label>
                    {editing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Unesite broj telefona"
                        className="mt-1 bg-black border-zinc-700 text-white"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-black border border-zinc-800 text-white">
                        {profile?.phone || <span className="text-zinc-600">Nije uneseno</span>}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <Label className="text-zinc-400 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Adresa
                    </Label>
                    {editing ? (
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Unesite adresu"
                        className="mt-1 bg-black border-zinc-700 text-white"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-black border border-zinc-800 text-white">
                        {profile?.address || <span className="text-zinc-600">Nije uneseno</span>}
                      </div>
                    )}
                  </div>

                  {/* City and Postal Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-zinc-400">Grad</Label>
                      {editing ? (
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Unesite grad"
                          className="mt-1 bg-black border-zinc-700 text-white"
                        />
                      ) : (
                        <div className="mt-1 p-3 bg-black border border-zinc-800 text-white">
                          {profile?.city || <span className="text-zinc-600">Nije uneseno</span>}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-zinc-400">Poštanski broj</Label>
                      {editing ? (
                        <Input
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="Unesite poštanski broj"
                          className="mt-1 bg-black border-zinc-700 text-white"
                        />
                      ) : (
                        <div className="mt-1 p-3 bg-black border border-zinc-800 text-white">
                          {profile?.postalCode || <span className="text-zinc-600">Nije uneseno</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {editing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1 border-zinc-700 text-zinc-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Otkaži
                      </Button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-lime text-black font-bold py-2 px-4 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Sačuvaj
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
                <span className="text-lime">//</span> BRZI LINKOVI
              </h3>
              <div className="space-y-2">
                <Link
                  href="/moje-porudzbine"
                  className="flex items-center gap-3 p-3 bg-black border border-zinc-800 text-white hover:border-lime hover:text-lime transition-colors"
                >
                  <Package className="h-5 w-5" />
                  <span>Moje porudžbine</span>
                </Link>
                <Link
                  href="/korpa"
                  className="flex items-center gap-3 p-3 bg-black border border-zinc-800 text-white hover:border-lime hover:text-lime transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Korpa</span>
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
                <span className="text-lime">//</span> INFO
              </h3>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>
                  Vaši podaci se koriste za bržu obradu porudžbina i dostavu.
                </p>
                <p>
                  Email adresa se ne može promeniti iz bezbednosnih razloga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
