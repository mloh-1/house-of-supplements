"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Folders,
  X,
  Save,
  ChevronRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parent: {
    id: string;
    name: string;
    slug: string;
  } | null;
  children: {
    id: string;
    name: string;
    slug: string;
  }[];
  _count: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", parentId: "" });
    setError("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "",
    });
    setError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          parentId: formData.parentId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške");
        return;
      }

      // Refresh the full list to get updated relationships
      await fetchCategories();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Došlo je do greške");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu kategoriju?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Došlo je do greške");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Došlo je do greške");
    }
  };

  // Get parent categories (categories without a parent) for the dropdown
  const parentCategories = categories.filter((c) => !c.parentId);

  // Filter out self and children when editing
  const availableParents = editingCategory
    ? parentCategories.filter(
        (c) =>
          c.id !== editingCategory.id &&
          !editingCategory.children.some((child) => child.id === c.id)
      )
    : parentCategories;

  // Organize categories: parent first, then children indented
  const organizedCategories = () => {
    const result: Category[] = [];
    const parents = categories.filter((c) => !c.parentId);

    parents.forEach((parent) => {
      result.push(parent);
      const children = categories.filter((c) => c.parentId === parent.id);
      children.forEach((child) => result.push(child));
    });

    // Add orphans (shouldn't happen, but just in case)
    const addedIds = new Set(result.map((c) => c.id));
    categories.forEach((c) => {
      if (!addedIds.has(c.id)) result.push(c);
    });

    return result;
  };

  const filteredCategories = organizedCategories().filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Folders className="h-6 w-6 text-lime" />
          <div>
            <h1 className="font-display text-2xl text-white">KATEGORIJE</h1>
            <p className="text-zinc-500">Upravljajte kategorijama proizvoda</p>
          </div>
        </div>
        <button
          onClick={openCreateDialog}
          className="bg-lime text-black font-bold px-6 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Dodaj kategoriju
        </button>
      </div>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Pretraži kategorije..."
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
                Podkategorije
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Proizvodi
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                  Nema kategorija za prikaz
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category.parentId && (
                        <ChevronRight className="h-4 w-4 text-zinc-600" />
                      )}
                      <span className={`font-bold ${category.parentId ? "text-zinc-300" : "text-white"}`}>
                        {category.name}
                      </span>
                    </div>
                    {category.parent && (
                      <p className="text-xs text-zinc-500 mt-1 ml-6">
                        u kategoriji: {category.parent.name}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400 font-mono text-sm">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-zinc-400 max-w-xs truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {!category.parentId && (
                      <span className="inline-block px-2 py-1 text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {category.children.length}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {category._count.products}
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
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Izmeni
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="text-red-400 focus:bg-zinc-800 focus:text-red-400 cursor-pointer"
                          onClick={() => deleteCategory(category.id)}
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
            Prikazano <span className="text-lime font-bold">{filteredCategories.length}</span> od{" "}
            <span className="text-white">{categories.length}</span> kategorija
          </p>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCategory ? "IZMENI KATEGORIJU" : "NOVA KATEGORIJA"}
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
                Naziv kategorije *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="npr. Proteini"
                className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Roditeljska kategorija
              </label>
              <Select
                value={formData.parentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, parentId: value === "none" ? "" : value })
                }
              >
                <SelectTrigger className="bg-black border-zinc-700 text-white">
                  <SelectValue placeholder="Izaberi roditeljsku kategoriju" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="none" className="text-zinc-300 focus:bg-lime focus:text-black">
                    Bez roditeljske kategorije
                  </SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem
                      key={parent.id}
                      value={parent.id}
                      className="text-zinc-300 focus:bg-lime focus:text-black"
                    >
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editingCategory?.children && editingCategory.children.length > 0 && (
                <p className="text-xs text-yellow-400">
                  Ova kategorija ima podkategorije i ne može imati roditeljsku kategoriju.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Opis
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kratak opis kategorije..."
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
                disabled={saving || (editingCategory?.children && editingCategory.children.length > 0 && formData.parentId !== "")}
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
