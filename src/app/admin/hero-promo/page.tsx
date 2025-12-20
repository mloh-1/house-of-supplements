"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Upload,
  ImageIcon,
  Zap,
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

// Demo data
const heroPromos = [
  {
    id: "1",
    title: "VRHUNSKI PROTEINI",
    subtitle: "Novo u ponudi",
    description:
      "Otkrijte našu premium kolekciju whey proteina za maksimalne rezultate.",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    buttonText: "Pogledaj ponudu",
    buttonLink: "/kategorija/proteini",
    active: true,
    order: 1,
  },
  {
    id: "2",
    title: "SPECIJALNA AKCIJA",
    subtitle: "Uštedite do 30%",
    description:
      "Iskoristite posebne popuste na odabrane suplemente. Ponuda traje do isteka zaliha!",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    buttonText: "Vidi akcije",
    buttonLink: "/akcije",
    active: true,
    order: 2,
  },
  {
    id: "3",
    title: "PLAĆANJE NA RATE",
    subtitle: "Bez kamate",
    description:
      "Podelite plaćanje na do 6 mesečnih rata bez kamate. Visa, Mastercard, Dina.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    buttonText: "Saznaj više",
    buttonLink: "/uslovi-kupovine",
    active: false,
    order: 3,
  },
];

export default function HeroPromoPage() {
  const [promos, setPromos] = useState(heroPromos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<(typeof heroPromos)[0] | null>(
    null
  );

  const toggleActive = (id: string) => {
    setPromos(
      promos.map((promo) =>
        promo.id === id ? { ...promo, active: !promo.active } : promo
      )
    );
  };

  const openEditDialog = (promo: (typeof heroPromos)[0]) => {
    setEditingPromo(promo);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingPromo(null);
    setIsDialogOpen(true);
  };

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
                        Dugme: <span className="text-zinc-400">{promo.buttonText}</span> → <span className="text-lime">{promo.buttonLink}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={promo.active}
                      onCheckedChange={() => toggleActive(promo.id)}
                      className="data-[state=checked]:bg-lime"
                    />
                    <button
                      onClick={() => openEditDialog(promo)}
                      className="p-2 text-zinc-500 hover:text-lime transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              {editingPromo ? "IZMENI PROMO" : "NOVI PROMO BANER"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">Naslov *</Label>
                <Input
                  id="title"
                  placeholder="npr. VRHUNSKI PROTEINI"
                  defaultValue={editingPromo?.title}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
              <div>
                <Label htmlFor="subtitle" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">Podnaslov</Label>
                <Input
                  id="subtitle"
                  placeholder="npr. Novo u ponudi"
                  defaultValue={editingPromo?.subtitle}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">Opis</Label>
              <Textarea
                id="description"
                placeholder="Kratak opis za promo baner..."
                defaultValue={editingPromo?.description}
                className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-zinc-400 uppercase tracking-wider text-xs font-bold">Slika banera</Label>
              <div className="border-2 border-dashed border-zinc-700 bg-black p-6 text-center mt-2 hover:border-lime/50 transition-colors">
                {editingPromo?.image ? (
                  <div className="relative aspect-video max-w-sm mx-auto overflow-hidden">
                    <Image
                      src={editingPromo.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">
                      Prevucite sliku ovde ili kliknite za upload
                    </p>
                  </>
                )}
                <button
                  type="button"
                  className="mt-4 px-4 py-2 border border-zinc-700 text-zinc-400 hover:border-lime hover:text-lime transition-colors text-sm font-bold uppercase"
                >
                  {editingPromo?.image ? "Promeni sliku" : "Izaberite sliku"}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonText" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">Tekst dugmeta</Label>
                <Input
                  id="buttonText"
                  placeholder="npr. Pogledaj ponudu"
                  defaultValue={editingPromo?.buttonText}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
              <div>
                <Label htmlFor="buttonLink" className="text-zinc-400 uppercase tracking-wider text-xs font-bold">Link dugmeta</Label>
                <Input
                  id="buttonLink"
                  placeholder="npr. /kategorija/proteini"
                  defaultValue={editingPromo?.buttonLink}
                  className="mt-2 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="active"
                defaultChecked={editingPromo?.active ?? true}
                className="data-[state=checked]:bg-lime"
              />
              <Label htmlFor="active" className="text-zinc-300">Aktivan promo</Label>
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
                className="px-6 py-3 bg-lime text-black font-bold uppercase tracking-wider hover:bg-lime-400 transition-colors"
              >
                {editingPromo ? "Sačuvaj izmene" : "Dodaj promo"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
