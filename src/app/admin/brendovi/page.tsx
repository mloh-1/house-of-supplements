"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  X,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    products: number;
  };
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/admin/brands");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingBrand(null);
    setFormData({ name: "", description: "" });
    setError("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
    });
    setError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingBrand
        ? `/api/admin/brands/${editingBrand.id}`
        : "/api/admin/brands";
      const method = editingBrand ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške");
        return;
      }

      if (editingBrand) {
        setBrands((prev) =>
          prev.map((b) =>
            b.id === editingBrand.id ? { ...b, ...data } : b
          )
        );
      } else {
        setBrands((prev) => [...prev, { ...data, _count: { products: 0 } }]);
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving brand:", error);
      setError("Došlo je do greške");
    } finally {
      setSaving(false);
    }
  };

  const deleteBrand = async (brandId: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj brend?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Došlo je do greške");
        return;
      }

      setBrands((prev) => prev.filter((b) => b.id !== brandId));
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Došlo je do greške");
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tag className="h-6 w-6 text-lime" />
          <div>
            <h1 className="font-display text-2xl text-white">BRENDOVI</h1>
            <p className="text-zinc-500">Upravljajte brendovima proizvoda</p>
          </div>
        </div>
        <button
          onClick={openCreateDialog}
          className="bg-lime text-black font-bold px-6 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Dodaj brend
        </button>
      </div>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Pretraži brendove..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Naziv
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Slug
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Opis
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Proizvodi
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                  Nema brendova za prikaz
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-bold text-white">
                    {brand.name}
                  </TableCell>
                  <TableCell className="text-zinc-400 font-mono text-sm">
                    {brand.slug}
                  </TableCell>
                  <TableCell className="text-zinc-400 max-w-xs truncate">
                    {brand.description || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {brand._count.products}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-zinc-500 hover:text-lime transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem
                          className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
                          onClick={() => openEditDialog(brand)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Izmeni
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="text-red-400 focus:bg-zinc-800 focus:text-red-400 cursor-pointer"
                          onClick={() => deleteBrand(brand.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Prikazano <span className="text-lime font-bold">{filteredBrands.length}</span> od{" "}
            <span className="text-white">{brands.length}</span> brendova
          </p>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingBrand ? "IZMENI BREND" : "NOVI BREND"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Naziv brenda *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="npr. Optimum Nutrition"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Opis
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kratak opis brenda..."
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime min-h-[100px]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 bg-zinc-800 text-white font-bold px-4 py-3 uppercase tracking-wider hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Odustani
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-lime text-black font-bold px-4 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Čuvanje..." : "Sačuvaj"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
