"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HeroPromo {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string;
  buttonText: string | null;
  buttonLink: string | null;
  active: boolean;
  order: number;
}

export default function HeroPromoPage() {
  const [promos, setPromos] = useState<HeroPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<HeroPromo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    buttonText: "",
    buttonLink: "",
    active: true,
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await fetch("/api/admin/hero-promos");
      if (response.ok) {
        const data = await response.json();
        setPromos(data);
      }
    } catch (error) {
      console.error("Error fetching promos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/hero-promos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (response.ok) {
        setPromos(
          promos.map((promo) =>
            promo.id === id ? { ...promo, active: !currentActive } : promo
          )
        );
      }
    } catch (error) {
      console.error("Error toggling promo:", error);
    }
  };

  const deletePromo = async (id: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj promo?")) return;

    try {
      const response = await fetch(`/api/admin/hero-promos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPromos(promos.filter((promo) => promo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting promo:", error);
    }
  };

  const openEditDialog = (promo: HeroPromo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      subtitle: promo.subtitle || "",
      description: promo.description || "",
      image: promo.image,
      buttonText: promo.buttonText || "",
      buttonLink: promo.buttonLink || "",
      active: promo.active,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingPromo(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPromo) {
        // Update existing
        const response = await fetch(`/api/admin/hero-promos/${editingPromo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedPromo = await response.json();
          setPromos(promos.map((p) => (p.id === updatedPromo.id ? updatedPromo : p)));
          setIsDialogOpen(false);
        }
      } else {
        // Create new
        const response = await fetch("/api/admin/hero-promos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newPromo = await response.json();
          setPromos([...promos, newPromo]);
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving promo:", error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ImageIcon className="h-6 w-6 text-lime" />
          <div>
            <h1 className="font-display text-2xl text-white">HERO PROMO</h1>
            <p className="text-zinc-500">
              Upravljajte promotivnim banerima na početnoj stranici
            </p>
          </div>
        </div>
        <button
          onClick={openNewDialog}
          className="bg-lime text-black font-bold px-6 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Dodaj promo
        </button>
      </div>

      {/* Promo list */}
      {promos.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 mb-4">Nema promo banera</p>
          <button
            onClick={openNewDialog}
            className="text-lime hover:underline font-bold"
          >
            Dodajte prvi promo baner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
            >
              <div className="flex">
                <div className="w-48 h-32 relative flex-shrink-0 bg-black">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{promo.title}</h3>
                        {promo.active ? (
                          <span className="px-2 py-0.5 text-xs font-bold uppercase bg-lime/20 text-lime border border-lime/30">
                            Aktivan
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-bold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700">
                            Neaktivan
                          </span>
                        )}
                      </div>
                      {promo.subtitle && (
                        <p className="text-sm text-lime font-medium">
                          {promo.subtitle}
                        </p>
                      )}
                      {promo.description && (
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                          {promo.description}
                        </p>
                      )}
                      {promo.buttonText && (
                        <p className="text-xs text-zinc-600 mt-2">
                          Dugme: <span className="text-zinc-400">{promo.buttonText}</span> →{" "}
                          <span className="text-lime">{promo.buttonLink}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={promo.active}
                        onCheckedChange={() => toggleActive(promo.id, promo.active)}
                        className="data-[state=checked]:bg-lime"
                      />
                      <button
                        onClick={() => openEditDialog(promo)}
                        className="p-2 text-zinc-500 hover:text-lime transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePromo(promo.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors cursor-move">
                        <GripVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              {editingPromo ? "IZMENI PROMO" : "NOVI PROMO BANER"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                  Naslov *
                </Label>
                <Input
                  id="title"
                  placeholder="npr. VRHUNSKI PROTEINI"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                  Podnaslov
                </Label>
                <Input
                  id="subtitle"
                  placeholder="npr. Novo u ponudi"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                Opis
              </Label>
              <Textarea
                id="description"
                placeholder="Kratak opis za promo baner..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                URL slike *
              </Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                required
              />
              {formData.image && (
                <div className="relative aspect-video max-w-sm mt-4 overflow-hidden border border-zinc-700">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonText" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                  Tekst dugmeta
                </Label>
                <Input
                  id="buttonText"
                  placeholder="npr. Pogledaj ponudu"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
              <div>
                <Label htmlFor="buttonLink" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
                  Link dugmeta
                </Label>
                <Input
                  id="buttonLink"
                  placeholder="npr. /kategorija/proteini"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                className="data-[state=checked]:bg-lime"
              />
              <Label htmlFor="active" className="text-zinc-300">
                Aktivan promo
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-3 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-wider"
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-lime text-black font-bold uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50"
              >
                {saving ? "Čuvanje..." : editingPromo ? "Sačuvaj izmene" : "Dodaj promo"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
