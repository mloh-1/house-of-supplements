"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Clock, Calendar } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

// Demo data
const specialOffers = [
  {
    id: "1",
    product: {
      id: "1",
      name: "Bulgarian Tribulus 90 caps",
      price: 3400,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
    },
    discountPercent: 28,
    startDate: "2024-12-15",
    endDate: "2024-12-25",
    active: true,
    featured: true,
  },
  {
    id: "2",
    product: {
      id: "2",
      name: "100% Pure Whey 2270g",
      price: 7250,
      image:
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&q=80",
    },
    discountPercent: 15,
    startDate: "2024-12-10",
    endDate: "2024-12-31",
    active: true,
    featured: false,
  },
  {
    id: "3",
    product: {
      id: "3",
      name: "BCAA EAA Strong 400g",
      price: 2650,
      image:
        "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=200&q=80",
    },
    discountPercent: 13,
    startDate: "2024-12-01",
    endDate: "2024-12-20",
    active: false,
    featured: false,
  },
];

const availableProducts = [
  { id: "1", name: "Bulgarian Tribulus 90 caps", price: 3400 },
  { id: "2", name: "100% Pure Whey 2270g", price: 7250 },
  { id: "3", name: "BCAA EAA Strong 400g", price: 2650 },
  { id: "4", name: "Kreatin Monohidrat 500g", price: 1850 },
  { id: "5", name: "Omega 3 Fish Oil 120 caps", price: 1490 },
];

export default function SpecialOffersPage() {
  const [offers, setOffers] = useState(specialOffers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<(typeof specialOffers)[0] | null>(null);

  const toggleActive = (id: string) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer
      )
    );
  };

  const toggleFeatured = (id: string) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, featured: !offer.featured } : offer
      )
    );
  };

  const openEditDialog = (offer: (typeof specialOffers)[0]) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingOffer(null);
    setIsDialogOpen(true);
  };

  const calculateSalePrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Specijalne Ponude</h1>
          <p className="text-navy-600">
            Upravljajte vremenski ograničenim ponudama sa tajmerom
          </p>
        </div>
        <Button variant="accent" onClick={openNewDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj ponudu
        </Button>
      </div>

      {/* Active featured offer */}
      {offers.filter((o) => o.active && o.featured).length > 0 && (
        <Card className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <CardHeader>
            <CardTitle className="text-orange-400">
              Istaknuta ponuda na početnoj
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offers
              .filter((o) => o.active && o.featured)
              .map((offer) => (
                <div key={offer.id} className="flex items-center gap-4">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white">
                    <Image
                      src={offer.product.image}
                      alt={offer.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{offer.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold text-orange-400">
                        {formatPrice(
                          calculateSalePrice(
                            offer.product.price,
                            offer.discountPercent
                          )
                        )}
                      </span>
                      <span className="text-navy-400 line-through">
                        {formatPrice(offer.product.price)}
                      </span>
                      <Badge className="bg-orange-500">
                        -{offer.discountPercent}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-navy-300">Ističe:</p>
                    <p className="font-medium">
                      {new Date(offer.endDate).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* All offers */}
      <div className="grid gap-4">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className={isExpired(offer.endDate) ? "opacity-60" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={offer.product.image}
                    alt={offer.product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-navy-900 truncate">
                      {offer.product.name}
                    </h3>
                    {isExpired(offer.endDate) ? (
                      <Badge variant="destructive">Isteklo</Badge>
                    ) : offer.active ? (
                      <Badge variant="success">Aktivno</Badge>
                    ) : (
                      <Badge variant="secondary">Neaktivno</Badge>
                    )}
                    {offer.featured && (
                      <Badge variant="accent">Istaknuto</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-orange-600 font-bold">
                      -{offer.discountPercent}%
                    </span>
                    <span className="text-navy-600">
                      {formatPrice(offer.product.price)} →{" "}
                      <span className="font-medium text-navy-900">
                        {formatPrice(
                          calculateSalePrice(
                            offer.product.price,
                            offer.discountPercent
                          )
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-navy-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(offer.startDate).toLocaleDateString("sr-RS")} -{" "}
                      {new Date(offer.endDate).toLocaleDateString("sr-RS")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <Label className="text-xs text-navy-500">Istaknuto</Label>
                    <Switch
                      checked={offer.featured}
                      onCheckedChange={() => toggleFeatured(offer.id)}
                    />
                  </div>
                  <div className="text-right mr-2">
                    <Label className="text-xs text-navy-500">Aktivno</Label>
                    <Switch
                      checked={offer.active}
                      onCheckedChange={() => toggleActive(offer.id)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(offer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? "Izmeni ponudu" : "Nova specijalna ponuda"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label>Proizvod *</Label>
              <Select defaultValue={editingOffer?.product.id}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Izaberite proizvod" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discount">Popust (%) *</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="99"
                placeholder="npr. 20"
                defaultValue={editingOffer?.discountPercent}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Datum početka *</Label>
                <Input
                  id="startDate"
                  type="date"
                  defaultValue={editingOffer?.startDate}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Datum završetka *</Label>
                <Input
                  id="endDate"
                  type="date"
                  defaultValue={editingOffer?.endDate}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  defaultChecked={editingOffer?.active ?? true}
                />
                <Label htmlFor="active">Aktivna ponuda</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  defaultChecked={editingOffer?.featured ?? false}
                />
                <Label htmlFor="featured">Istaknuta na početnoj</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Otkaži
              </Button>
              <Button type="submit" variant="accent">
                {editingOffer ? "Sačuvaj izmene" : "Dodaj ponudu"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
