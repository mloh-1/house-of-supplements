"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Upload, X, Loader2 } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock: number;
}

interface EditableVariant {
  id?: string;
  name: string;
  value: string;
  stock: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  price: number;
  salePrice: number | null;
  sku: string | null;
  stock: number;
  images: string;
  featured: boolean;
  active: boolean;
  categoryId: string;
  brandId: string | null;
  variants: ProductVariant[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDesc: "",
    description: "",
    price: "",
    salePrice: "",
    sku: "",
    stock: "0",
    categoryId: "",
    brandId: "",
    active: true,
    featured: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<EditableVariant[]>([]);

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const [catRes, brandRes, productRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
        fetch(`/api/admin/products/${productId}`),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        setBrands(brandData);
      }

      if (productRes.ok) {
        const product: Product = await productRes.json();

        // Parse images
        let parsedImages: string[] = [];
        try {
          parsedImages = JSON.parse(product.images);
        } catch {
          parsedImages = [];
        }

        setFormData({
          name: product.name,
          slug: product.slug,
          shortDesc: product.shortDesc || "",
          description: product.description || "",
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || "",
          sku: product.sku || "",
          stock: product.stock.toString(),
          categoryId: product.categoryId,
          brandId: product.brandId || "",
          active: product.active,
          featured: product.featured,
        });
        setImages(parsedImages);
        // Convert existing variants to editable format
        setVariants((product.variants || []).map((v: ProductVariant) => ({
          id: v.id,
          name: v.name,
          value: v.value,
          stock: v.stock,
          isNew: false,
          isDeleted: false,
        })));
      } else {
        setError("Proizvod nije pronađen");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Došlo je do greške pri učitavanju");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", value: "", stock: 0, isNew: true }]);
  };

  const removeVariant = (index: number) => {
    const variant = variants[index];
    if (variant.id) {
      // Mark existing variant as deleted
      setVariants(variants.map((v, i) => i === index ? { ...v, isDeleted: true } : v));
    } else {
      // Remove new variant entirely
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof EditableVariant, value: string | number) => {
    setVariants(variants.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.name || !formData.price || !formData.categoryId) {
      setError("Naziv, cena i kategorija su obavezni");
      setSaving(false);
      return;
    }

    try {
      // Prepare variants data
      const variantsToSend = variants.map(v => ({
        id: v.id,
        name: v.name,
        value: v.value,
        stock: v.stock,
        isNew: v.isNew,
        isDeleted: v.isDeleted,
      }));

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images),
          brandId: formData.brandId || null,
          variants: variantsToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške");
        setSaving(false);
        return;
      }

      router.push("/admin/proizvodi");
    } catch {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-lime animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Učitavanje proizvoda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/proizvodi">
          <button className="p-2 text-zinc-500 hover:text-lime transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="font-display text-2xl text-white">IZMENI PROIZVOD</h1>
          <p className="text-zinc-500">Ažurirajte informacije o proizvodu</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Osnovne informacije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-zinc-400">Naziv proizvoda *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="npr. 100% Pure Whey 2270g"
                  className="mt-1 bg-black border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-zinc-400">URL slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-slug-proizvoda"
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="shortDesc" className="text-zinc-400">Kratak opis</Label>
                <Input
                  id="shortDesc"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  placeholder="Kratak opis proizvoda (do 160 karaktera)"
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-zinc-400">Opis proizvoda</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detaljan opis proizvoda..."
                  className="mt-1 min-h-[200px] bg-black border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Slike proizvoda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-zinc-700 p-8 text-center">
                <Upload className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-2">
                  Unesite URL slike ispod
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    className="bg-black border-zinc-700 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        if (input.value) {
                          setImages([...images, input.value]);
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700 text-zinc-300"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="https://example.com/image.jpg"]') as HTMLInputElement;
                      if (input?.value) {
                        setImages([...images, input.value]);
                        input.value = "";
                      }
                    }}
                  >
                    Dodaj
                  </Button>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-black border border-zinc-800 overflow-hidden"
                    >
                      <img
                        src={image}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-1"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
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
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Varijante proizvoda</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="border-zinc-700 text-zinc-300">
                <Plus className="h-4 w-4 mr-2" />
                Dodaj varijantu
              </Button>
            </CardHeader>
            <CardContent>
              {variants.filter(v => !v.isDeleted).length === 0 ? (
                <p className="text-center text-zinc-500 py-8">
                  Nema varijanti. Kliknite &quot;Dodaj varijantu&quot;
                  za proizvode koji imaju različite ukuse, veličine, itd.
                </p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, index) => {
                    if (variant.isDeleted) return null;
                    return (
                      <div
                        key={variant.id || `new-${index}`}
                        className="flex items-center gap-4 p-4 bg-black border border-zinc-800"
                      >
                        <div className="flex-1">
                          <Label className="text-zinc-400">Naziv</Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => updateVariant(index, "name", e.target.value)}
                            placeholder="npr. Ukus"
                            className="mt-1 bg-zinc-900 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-zinc-400">Vrednost</Label>
                          <Input
                            value={variant.value}
                            onChange={(e) => updateVariant(index, "value", e.target.value)}
                            placeholder="npr. Čokolada"
                            className="mt-1 bg-zinc-900 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-zinc-400">Stanje</Label>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="mt-1 bg-zinc-900 border-zinc-700 text-white"
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
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: !!checked }))}
                  className="border-zinc-600 data-[state=checked]:bg-lime data-[state=checked]:border-lime"
                />
                <Label htmlFor="active" className="text-zinc-300">Aktivan proizvod</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
                  className="border-zinc-600 data-[state=checked]:bg-lime data-[state=checked]:border-lime"
                />
                <Label htmlFor="featured" className="text-zinc-300">Istaknut proizvod</Label>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Organizacija</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-400">Kategorija *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="mt-1 bg-black border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Izaberite kategoriju" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-zinc-300 focus:bg-lime focus:text-black"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-400">Brend</Label>
                <Select
                  value={formData.brandId || "none"}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, brandId: value === "none" ? "" : value }))}
                >
                  <SelectTrigger className="mt-1 bg-black border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Izaberite brend" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="none" className="text-zinc-500 focus:bg-lime focus:text-black">
                      Bez brenda
                    </SelectItem>
                    {brands.map((brand) => (
                      <SelectItem
                        key={brand.id}
                        value={brand.id}
                        className="text-zinc-300 focus:bg-lime focus:text-black"
                      >
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sku" className="text-zinc-400">SKU (šifra proizvoda)</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="npr. BT-PW-2270"
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Cena</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price" className="text-zinc-400">Regularna cena (RSD) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-1 bg-black border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="salePrice" className="text-zinc-400">Akcijska cena (RSD)</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Zalihe</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="stock" className="text-zinc-400">Količina na stanju</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-1 bg-black border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-zinc-700 text-zinc-300" asChild>
              <Link href="/admin/proizvodi">Otkaži</Link>
            </Button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-lime text-black font-bold py-2 uppercase tracking-wider hover:bg-lime-400 transition-colors disabled:opacity-50"
            >
              {saving ? "Čuvanje..." : "Sačuvaj"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
