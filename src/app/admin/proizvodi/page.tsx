"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Minus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  active: boolean;
  images: string;
  category: {
    name: string;
  } | null;
  brand: {
    name: string;
  } | null;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("pretraga") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update search when URL changes
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, adjustment: number) => {
    setUpdatingStock(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustment }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? { ...product, stock: data.product.stock }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    } finally {
      setUpdatingStock(null);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getProductImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      return parsed[0] || "https://via.placeholder.com/100";
    } catch {
      return "https://via.placeholder.com/100";
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = product.active;
    if (statusFilter === "inactive") matchesStatus = !product.active;
    if (statusFilter === "out-of-stock") matchesStatus = product.stock === 0;

    return matchesSearch && matchesStatus;
  });

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
          <Package className="h-6 w-6 text-lime" />
          <div>
            <h1 className="font-display text-2xl text-white">PROIZVODI</h1>
            <p className="text-zinc-500">Upravljajte proizvodima u prodavnici</p>
          </div>
        </div>
        <Link href="/admin/proizvodi/novi">
          <button className="bg-lime text-black font-bold px-6 py-3 uppercase tracking-wider hover:bg-lime-400 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Dodaj proizvod
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Pretraži proizvode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-black border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Svi
                </SelectItem>
                <SelectItem value="active" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Aktivni
                </SelectItem>
                <SelectItem value="inactive" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Neaktivni
                </SelectItem>
                <SelectItem value="out-of-stock" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Nema na stanju
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[50px] text-zinc-500"></TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Proizvod
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                SKU
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Kategorija
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-right">
                Cena
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Stanje
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Status
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-zinc-500">
                  Nema proizvoda za prikaz
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell>
                    <div className="relative w-12 h-12 bg-black border border-zinc-800 overflow-hidden">
                      <Image
                        src={getProductImage(product.images)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-white">{product.name}</p>
                      <p className="text-sm text-zinc-500">{product.brand?.name || "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 font-mono text-sm">
                    {product.sku || "-"}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {product.category?.name || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.salePrice ? (
                      <div>
                        <p className="font-bold text-lime">
                          {formatPrice(product.salePrice)}
                        </p>
                        <p className="text-sm text-zinc-600 line-through">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    ) : (
                      <p className="font-bold text-white">{formatPrice(product.price)}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateStock(product.id, -1)}
                        disabled={updatingStock === product.id || product.stock === 0}
                        className="p-1 text-zinc-500 hover:text-lime disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      {product.stock === 0 ? (
                        <span className="inline-block min-w-[60px] px-2 py-1 text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 text-center">
                          Nema
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="inline-block min-w-[60px] px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-center">
                          {product.stock}
                        </span>
                      ) : (
                        <span className="inline-block min-w-[60px] px-2 py-1 text-xs font-bold bg-lime/20 text-lime border border-lime/30 text-center">
                          {product.stock}
                        </span>
                      )}
                      <button
                        onClick={() => updateStock(product.id, 1)}
                        disabled={updatingStock === product.id}
                        className="p-1 text-zinc-500 hover:text-lime disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.active ? (
                      <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-lime/20 text-lime border border-lime/30">
                        Aktivan
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700">
                        Neaktivan
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-zinc-500 hover:text-lime transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                          <Link href={`/proizvod/${product.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            Pregled
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                          <Link href={`/admin/proizvodi/${product.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Izmeni
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="text-red-400 focus:bg-zinc-800 focus:text-red-400 cursor-pointer"
                          onClick={() => deleteProduct(product.id)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Prikazano <span className="text-lime font-bold">{filteredProducts.length}</span> od{" "}
            <span className="text-white">{products.length}</span> proizvoda
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 bg-zinc-800 w-48 animate-pulse" />
          <div className="bg-zinc-900 border border-zinc-800 h-96 animate-pulse" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
