"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
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
    newCategoryName: "",
    brandId: "",
    newBrandName: "",
    active: true,
    featured: false,
  });

  const [categoryMode, setCategoryMode] = useState<"existing" | "new">("existing");
  const [brandMode, setBrandMode] = useState<"existing" | "new">("existing");

  const [variantCategories, setVariantCategories] = useState<{
    name: string;
    options: { value: string; stock: string }[];
  }[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  const fetchCategoriesAndBrands = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        setBrands(brandData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !formData.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const addVariantCategory = () => {
    setVariantCategories([...variantCategories, { name: "", options: [{ value: "", stock: "0" }] }]);
  };

  const removeVariantCategory = (index: number) => {
    setVariantCategories(variantCategories.filter((_, i) => i !== index));
  };

  const updateVariantCategoryName = (index: number, name: string) => {
    const newCategories = [...variantCategories];
    newCategories[index].name = name;
    setVariantCategories(newCategories);
  };

  const addVariantOption = (categoryIndex: number) => {
    const newCategories = [...variantCategories];
    newCategories[categoryIndex].options.push({ value: "", stock: "0" });
    setVariantCategories(newCategories);
  };

  const removeVariantOption = (categoryIndex: number, optionIndex: number) => {
    const newCategories = [...variantCategories];
    newCategories[categoryIndex].options = newCategories[categoryIndex].options.filter((_, i) => i !== optionIndex);
    setVariantCategories(newCategories);
  };

  const updateVariantOption = (categoryIndex: number, optionIndex: number, field: "value" | "stock", value: string) => {
    const newCategories = [...variantCategories];
    newCategories[categoryIndex].options[optionIndex][field] = value;
    setVariantCategories(newCategories);
  };

  // Calculate total stock from all variant options (per category)
  const getVariantStockTotal = () => {
    if (variantCategories.length === 0) return 0;
    // For validation, use the first category's total (all categories should have same total)
    const firstCategoryTotal = variantCategories[0]?.options.reduce(
      (sum, opt) => sum + (parseInt(opt.stock) || 0), 0
    );
    return firstCategoryTotal;
  };

  // Validate that all variant categories have the same stock total
  const validateVariantStocks = (): string | null => {
    if (variantCategories.length === 0) return null;

    const productStock = parseInt(formData.stock) || 0;
    const categoryTotals = variantCategories.map(cat => ({
      name: cat.name,
      total: cat.options.reduce((sum, opt) => sum + (parseInt(opt.stock) || 0), 0)
    }));

    // Check if all categories have the same total
    const firstTotal = categoryTotals[0]?.total || 0;
    for (const cat of categoryTotals) {
      if (cat.total !== firstTotal) {
        return `Sve kategorije varijanti moraju imati isti ukupan broj na stanju. "${cat.name}" ima ${cat.total}, a "${categoryTotals[0].name}" ima ${firstTotal}.`;
      }
    }

    // Check if total matches product stock
    if (firstTotal !== productStock) {
      return `Zbir zaliha varijanti (${firstTotal}) mora biti jednak ukupnoj količini proizvoda (${productStock}).`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const hasCategory = categoryMode === "existing" ? formData.categoryId : formData.newCategoryName;
    if (!formData.name || !formData.price || !hasCategory) {
      setError("Naziv, cena i kategorija su obavezni");
      setSaving(false);
      return;
    }

    // Validate variant stocks
    const variantError = validateVariantStocks();
    if (variantError) {
      setError(variantError);
      setSaving(false);
      return;
    }

    try {
      // Convert variant categories to the format expected by the API
      const variantsForApi = variantCategories
        .filter(cat => cat.name && cat.options.some(opt => opt.value))
        .map(cat => ({
          name: cat.name,
          options: cat.options
            .filter(opt => opt.value)
            .map(opt => ({
              value: opt.value,
              stock: parseInt(opt.stock) || 0,
            })),
        }));

      const submitData = {
        ...formData,
        images: JSON.stringify(images),
        categoryId: categoryMode === "existing" ? formData.categoryId : "",
        newCategoryName: categoryMode === "new" ? formData.newCategoryName : "",
        brandId: brandMode === "existing" ? formData.brandId : "",
        newBrandName: brandMode === "new" ? formData.newBrandName : "",
        variants: variantsForApi,
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
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
      <div className="space-y-6">
        <div className="h-8 bg-zinc-800 w-48 animate-pulse" />
        <div className="bg-zinc-900 border border-zinc-800 h-96 animate-pulse" />
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
          <h1 className="font-display text-2xl text-white">NOVI PROIZVOD</h1>
          <p className="text-zinc-500">Dodajte novi proizvod u prodavnicu</p>
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
                  placeholder="automatski se generiše iz naziva"
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
              <Button type="button" variant="outline" size="sm" onClick={addVariantCategory} className="border-zinc-700 text-zinc-300">
                <Plus className="h-4 w-4 mr-2" />
                Dodaj kategoriju varijanti
              </Button>
            </CardHeader>
            <CardContent>
              {variantCategories.length === 0 ? (
                <p className="text-center text-zinc-500 py-8">
                  Nema dodatih varijanti. Kliknite &quot;Dodaj kategoriju varijanti&quot;
                  za proizvode koji imaju različite ukuse, veličine, itd.
                </p>
              ) : (
                <div className="space-y-6">
                  {variantCategories.map((category, catIndex) => (
                    <div
                      key={catIndex}
                      className="p-4 bg-black border border-zinc-800"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <Label className="text-zinc-400">Naziv kategorije varijanti</Label>
                          <Input
                            value={category.name}
                            onChange={(e) => updateVariantCategoryName(catIndex, e.target.value)}
                            placeholder="npr. Ukus, Veličina, Boja"
                            className="mt-1 bg-zinc-900 border-zinc-700 text-white"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 mt-6"
                          onClick={() => removeVariantCategory(catIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-zinc-500 text-sm">Opcije varijante</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addVariantOption(catIndex)}
                            className="text-lime hover:text-lime-400 h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Dodaj opciju
                          </Button>
                        </div>

                        {category.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Input
                              value={option.value}
                              onChange={(e) => updateVariantOption(catIndex, optIndex, "value", e.target.value)}
                              placeholder="npr. Čokolada"
                              className="flex-1 bg-zinc-900 border-zinc-700 text-white"
                            />
                            <div className="w-24">
                              <Input
                                type="number"
                                min="0"
                                value={option.stock}
                                onChange={(e) => updateVariantOption(catIndex, optIndex, "stock", e.target.value)}
                                placeholder="Stanje"
                                className="bg-zinc-900 border-zinc-700 text-white"
                              />
                            </div>
                            {category.options.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 h-8 w-8"
                                onClick={() => removeVariantOption(catIndex, optIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        <div className="text-right text-sm mt-2">
                          <span className="text-zinc-500">Ukupno za {category.name || "kategoriju"}: </span>
                          <span className="text-lime font-bold">
                            {category.options.reduce((sum, opt) => sum + (parseInt(opt.stock) || 0), 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {variantCategories.length > 0 && (
                    <div className="bg-zinc-800/50 border border-zinc-700 p-3 text-sm">
                      <p className="text-zinc-400">
                        Zbir zaliha svake kategorije varijanti mora biti jednak ukupnoj količini proizvoda ({formData.stock || 0}).
                      </p>
                    </div>
                  )}
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
                <div className="flex gap-2 mt-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setCategoryMode("existing")}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                      categoryMode === "existing"
                        ? "bg-lime text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Postojeća
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryMode("new")}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                      categoryMode === "new"
                        ? "bg-lime text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    + Nova
                  </button>
                </div>
                {categoryMode === "existing" ? (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger className="bg-black border-zinc-700 text-zinc-300">
                      <SelectValue placeholder="Izaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 max-h-[300px]">
                      {categories.map((category) => (
                        <div key={category.id}>
                          {/* Parent category */}
                          <SelectItem
                            value={category.id}
                            className="text-zinc-300 focus:bg-lime focus:text-black font-bold"
                          >
                            {category.name}
                          </SelectItem>
                          {/* Subcategories */}
                          {category.children && category.children.length > 0 && (
                            category.children.map((sub) => (
                              <SelectItem
                                key={sub.id}
                                value={sub.id}
                                className="text-zinc-400 focus:bg-lime focus:text-black pl-6"
                              >
                                ↳ {sub.name}
                              </SelectItem>
                            ))
                          )}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formData.newCategoryName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newCategoryName: e.target.value }))}
                    placeholder="Unesite naziv nove kategorije"
                    className="bg-black border-zinc-700 text-white"
                  />
                )}
              </div>

              <div>
                <Label className="text-zinc-400">Brend</Label>
                <div className="flex gap-2 mt-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setBrandMode("existing")}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                      brandMode === "existing"
                        ? "bg-lime text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Postojeći
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandMode("new")}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                      brandMode === "new"
                        ? "bg-lime text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    + Novi
                  </button>
                </div>
                {brandMode === "existing" ? (
                  <Select
                    value={formData.brandId || "none"}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, brandId: value === "none" ? "" : value }))}
                  >
                    <SelectTrigger className="bg-black border-zinc-700 text-zinc-300">
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
                ) : (
                  <Input
                    value={formData.newBrandName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newBrandName: e.target.value }))}
                    placeholder="Unesite naziv novog brenda"
                    className="bg-black border-zinc-700 text-white"
                  />
                )}
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
