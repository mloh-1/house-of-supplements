"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  { id: "1", name: "Proteini", slug: "proteini" },
  { id: "2", name: "Aminokiseline", slug: "aminokiseline" },
  { id: "3", name: "Kreatin", slug: "kreatin" },
  { id: "4", name: "Vitamini", slug: "vitamini" },
  { id: "5", name: "Pre-Workout", slug: "pre-workout" },
];

const brands = [
  { id: "1", name: "BioTech USA" },
  { id: "2", name: "Optimum Nutrition" },
  { id: "3", name: "MyProtein" },
  { id: "4", name: "Ultimate Nutrition" },
  { id: "5", name: "VemoHerb" },
];

export default function NewProductPage() {
  const [variants, setVariants] = useState<{ name: string; value: string }[]>(
    []
  );
  const [images, setImages] = useState<string[]>([]);

  const addVariant = () => {
    setVariants([...variants, { name: "", value: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/proizvodi">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Novi proizvod</h1>
          <p className="text-navy-600">Dodajte novi proizvod u prodavnicu</p>
        </div>
      </div>

      <form className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle>Osnovne informacije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Naziv proizvoda *</Label>
                <Input
                  id="name"
                  placeholder="npr. 100% Pure Whey 2270g"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  placeholder="automatski se generiše iz naziva"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="shortDesc">Kratak opis</Label>
                <Input
                  id="shortDesc"
                  placeholder="Kratak opis proizvoda (do 160 karaktera)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Opis proizvoda</Label>
                <Textarea
                  id="description"
                  placeholder="Detaljan opis proizvoda... Možete koristiti HTML za formatiranje."
                  className="mt-1 min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Slike proizvoda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-navy-600 mb-2">
                  Prevucite slike ovde ili kliknite za upload
                </p>
                <p className="text-sm text-navy-500">
                  PNG, JPG ili WEBP. Maksimalno 5MB po slici.
                </p>
                <Button variant="outline" className="mt-4">
                  Izaberite slike
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={image}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== index))
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Varijante proizvoda</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj varijantu
              </Button>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <p className="text-center text-navy-500 py-8">
                  Nema dodatih varijanti. Kliknite &quot;Dodaj varijantu&quot;
                  za proizvode koji imaju različite ukuse, veličine, itd.
                </p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <Label>Naziv varijante (npr. Ukus, Veličina)</Label>
                        <Input
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, "name", e.target.value)
                          }
                          placeholder="npr. Ukus"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Vrednosti (razdvojene zarezom)</Label>
                        <Input
                          value={variant.value}
                          onChange={(e) =>
                            updateVariant(index, "value", e.target.value)
                          }
                          placeholder="npr. Čokolada, Vanila, Jagoda"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 mt-6"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox id="active" defaultChecked />
                <Label htmlFor="active">Aktivan proizvod</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured">Istaknut proizvod</Label>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organizacija</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kategorija *</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Izaberite kategoriju" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Brend</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Izaberite brend" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sku">SKU (šifra proizvoda)</Label>
                <Input id="sku" placeholder="npr. BT-PW-2270" className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Cena</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Regularna cena (RSD) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="salePrice">Akcijska cena (RSD)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Zalihe</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="stock">Količina na stanju</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/admin/proizvodi">Otkaži</Link>
            </Button>
            <Button variant="accent" className="flex-1">
              Sačuvaj proizvod
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
