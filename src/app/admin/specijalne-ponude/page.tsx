"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Calendar, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface SpecialOffer {
  id: string;
  productId: string;
  product: Product;
  discountPercent: number;
  startDate: string;
  endDate: string;
  active: boolean;
  featured: boolean;
}

export default function SpecialOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
    active: true,
    featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersRes, productsRes] = await Promise.all([
        fetch("/api/admin/special-offers"),
        fetch("/api/products"),
      ]);

      if (offersRes.ok) {
        const offersData = await offersRes.json();
        setOffers(offersData);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (offer: SpecialOffer) => {
    const newActive = !offer.active;
    console.log("[Toggle Active] Sending:", { active: newActive });

    try {
      const response = await fetch(`/api/admin/special-offers/${offer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newActive }),
      });

      console.log("[Toggle Active] Response status:", response.status);

      if (response.ok) {
        const updatedOffer = await response.json();
        console.log("[Toggle Active] Updated offer:", updatedOffer);
        setOffers((prev) => prev.map((o) =>
          o.id === offer.id ? { ...o, active: updatedOffer.active } : o
        ));
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle active:", errorData.error);
        alert("Greška: " + errorData.error);
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      alert("Greška pri promeni statusa");
    }
  };

  const toggleFeatured = async (offer: SpecialOffer) => {
    const newFeatured = !offer.featured;
    console.log("[Toggle Featured] Sending:", { featured: newFeatured });

    try {
      const response = await fetch(`/api/admin/special-offers/${offer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });

      console.log("[Toggle Featured] Response status:", response.status);

      if (response.ok) {
        const updatedOffer = await response.json();
        console.log("[Toggle Featured] Updated offer:", updatedOffer);
        setOffers((prev) => prev.map((o) =>
          o.id === offer.id ? { ...o, featured: updatedOffer.featured } : o
        ));
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle featured:", errorData.error);
        alert("Greška: " + errorData.error);
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Greška pri promeni statusa");
    }
  };

  const openEditDialog = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setFormData({
      productId: offer.productId,
      discountPercent: offer.discountPercent.toString(),
      startDate: new Date(offer.startDate).toISOString().split("T")[0],
      endDate: new Date(offer.endDate).toISOString().split("T")[0],
      active: offer.active,
      featured: offer.featured,
    });
    setError("");
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingOffer(null);
    setFormData({
      productId: "",
      discountPercent: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      active: true,
      featured: false,
    });
    setError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.productId || !formData.discountPercent || !formData.endDate) {
      setError("Proizvod, popust i datum završetka su obavezni");
      setSaving(false);
      return;
    }

    try {
      const url = editingOffer
        ? `/api/admin/special-offers/${editingOffer.id}`
        : "/api/admin/special-offers";
      const method = editingOffer ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške");
        setSaving(false);
        return;
      }

      if (editingOffer) {
        setOffers(offers.map((o) => (o.id === editingOffer.id ? data : o)));
      } else {
        setOffers([data, ...offers]);
      }

      setIsDialogOpen(false);
    } catch {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/special-offers/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOffers(offers.filter((o) => o.id !== deleteId));
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
    } finally {
      setDeleteId(null);
    }
  };

  const calculateSalePrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Get products that don't already have an offer (for new offers)
  const availableProducts = products.filter(
    (p) => !offers.some((o) => o.productId === p.id) || editingOffer?.productId === p.id
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-lime animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white">SPECIJALNE PONUDE</h1>
          <p className="text-zinc-500">
            Upravljajte vremenski ograničenim ponudama
          </p>
        </div>
        <Button
          onClick={openNewDialog}
          className="bg-lime hover:bg-lime-400 text-black font-bold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj ponudu
        </Button>
      </div>

      {/* Active featured offer */}
      {offers.filter((o) => o.active && o.featured && !isExpired(o.endDate)).length > 0 && (
        <Card className="bg-gradient-to-r from-lime/20 to-lime/5 border-lime/30">
          <CardHeader>
            <CardTitle className="text-lime">
              Istaknuta ponuda na početnoj
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offers
              .filter((o) => o.active && o.featured && !isExpired(o.endDate))
              .map((offer) => (
                <div key={offer.id} className="flex items-center gap-4">
                  <div className="w-20 h-20 relative overflow-hidden bg-black border border-zinc-800">
                    {offer.product.images[0] ? (
                      <Image
                        src={offer.product.images[0]}
                        alt={offer.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-8 w-8 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{offer.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold text-lime">
                        {formatPrice(
                          calculateSalePrice(
                            offer.product.price,
                            offer.discountPercent
                          )
                        )}
                      </span>
                      <span className="text-zinc-500 line-through">
                        {formatPrice(offer.product.price)}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        -{offer.discountPercent}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Ističe:</p>
                    <p className="font-medium text-white">
                      {new Date(offer.endDate).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* All offers */}
      {offers.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 mb-4">Nema specijalnih ponuda</p>
            <Button
              onClick={openNewDialog}
              className="bg-lime hover:bg-lime-400 text-black font-bold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj prvu ponudu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className={`bg-zinc-900 border-zinc-800 ${isExpired(offer.endDate) ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative overflow-hidden bg-black border border-zinc-800 flex-shrink-0">
                    {offer.product.images[0] ? (
                      <Image
                        src={offer.product.images[0]}
                        alt={offer.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-6 w-6 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-white truncate">
                        {offer.product.name}
                      </h3>
                      {isExpired(offer.endDate) ? (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Isteklo</Badge>
                      ) : offer.active ? (
                        <Badge className="bg-lime/20 text-lime border-lime/30">Aktivno</Badge>
                      ) : (
                        <Badge className="bg-zinc-700 text-zinc-400">Neaktivno</Badge>
                      )}
                      {offer.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Istaknuto</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-red-500 font-bold">
                        -{offer.discountPercent}%
                      </span>
                      <span className="text-zinc-500">
                        {formatPrice(offer.product.price)} →{" "}
                        <span className="font-medium text-lime">
                          {formatPrice(
                            calculateSalePrice(
                              offer.product.price,
                              offer.discountPercent
                            )
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(offer.startDate).toLocaleDateString("sr-RS")} -{" "}
                        {new Date(offer.endDate).toLocaleDateString("sr-RS")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <Label className="text-xs text-zinc-500">Istaknuto</Label>
                      <Switch
                        checked={offer.featured}
                        onCheckedChange={() => toggleFeatured(offer)}
                        className="data-[state=checked]:bg-lime"
                      />
                    </div>
                    <div className="text-right mr-2">
                      <Label className="text-xs text-zinc-500">Aktivno</Label>
                      <Switch
                        checked={offer.active}
                        onCheckedChange={() => toggleActive(offer)}
                        className="data-[state=checked]:bg-lime"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(offer)}
                      className="text-zinc-400 hover:text-lime"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-red-500"
                      onClick={() => setDeleteId(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? "Izmeni ponudu" : "Nova specijalna ponuda"}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-zinc-400">Proizvod *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
                disabled={!!editingOffer}
              >
                <SelectTrigger className="mt-1 bg-black border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Izaberite proizvod" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {availableProducts.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      className="text-zinc-300 focus:bg-lime focus:text-black"
                    >
                      {product.name} - {formatPrice(product.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discount" className="text-zinc-400">Popust (%) *</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="99"
                placeholder="npr. 20"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="mt-1 bg-black border-zinc-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-zinc-400">Datum početka *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-zinc-400">Datum završetka *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  className="data-[state=checked]:bg-lime"
                />
                <Label htmlFor="active" className="text-zinc-300">Aktivna ponuda</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  className="data-[state=checked]:bg-lime"
                />
                <Label htmlFor="featured" className="text-zinc-300">Istaknuta na početnoj</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-zinc-700 text-zinc-300"
              >
                Otkaži
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-lime hover:bg-lime-400 text-black font-bold"
              >
                {saving ? "Čuvanje..." : editingOffer ? "Sačuvaj izmene" : "Dodaj ponudu"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Obriši ponudu?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Da li ste sigurni da želite da obrišete ovu specijalnu ponudu?
              Akcijska cena će biti uklonjena sa proizvoda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Otkaži
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
