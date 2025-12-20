"use client";

import { useState } from "react";
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
  Zap,
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

// Demo data
const products = [
  {
    id: "1",
    name: "100% Pure Whey 2270g",
    slug: "100-pure-whey-2270g",
    sku: "BT-PW-2270",
    price: 7250,
    salePrice: 6100,
    stock: 15,
    category: "Whey Protein",
    brand: "BioTech USA",
    active: true,
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=100&q=80",
  },
  {
    id: "2",
    name: "BCAA EAA Strong 400g",
    slug: "bcaa-eaa-strong-400g",
    sku: "UN-BCAA-400",
    price: 2650,
    salePrice: 2300,
    stock: 8,
    category: "BCAA",
    brand: "Ultimate Nutrition",
    active: true,
    image:
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=100&q=80",
  },
  {
    id: "3",
    name: "Kreatin Monohidrat 500g",
    slug: "kreatin-monohidrat-500g",
    sku: "ON-CR-500",
    price: 1850,
    salePrice: null,
    stock: 25,
    category: "Kreatin",
    brand: "Optimum Nutrition",
    active: true,
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100&q=80",
  },
  {
    id: "4",
    name: "Omega 3 Fish Oil 120 caps",
    slug: "omega-3-fish-oil-120-caps",
    sku: "MP-OM3-120",
    price: 1490,
    salePrice: null,
    stock: 0,
    category: "Vitamini",
    brand: "MyProtein",
    active: true,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80",
  },
  {
    id: "5",
    name: "Pre-Workout Extreme 300g",
    slug: "pre-workout-extreme-300g",
    sku: "BT-PWE-300",
    price: 2990,
    salePrice: 2490,
    stock: 3,
    category: "Pre-Workout",
    brand: "BioTech USA",
    active: false,
    image:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=100&q=80",
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-black border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Kategorija" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-zinc-300 focus:bg-lime focus:text-black">Sve kategorije</SelectItem>
                <SelectItem value="proteini" className="text-zinc-300 focus:bg-lime focus:text-black">Proteini</SelectItem>
                <SelectItem value="aminokiseline" className="text-zinc-300 focus:bg-lime focus:text-black">Aminokiseline</SelectItem>
                <SelectItem value="kreatin" className="text-zinc-300 focus:bg-lime focus:text-black">Kreatin</SelectItem>
                <SelectItem value="vitamini" className="text-zinc-300 focus:bg-lime focus:text-black">Vitamini</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] bg-black border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-zinc-300 focus:bg-lime focus:text-black">Svi</SelectItem>
                <SelectItem value="active" className="text-zinc-300 focus:bg-lime focus:text-black">Aktivni</SelectItem>
                <SelectItem value="inactive" className="text-zinc-300 focus:bg-lime focus:text-black">Neaktivni</SelectItem>
                <SelectItem value="out-of-stock" className="text-zinc-300 focus:bg-lime focus:text-black">Nema na stanju</SelectItem>
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
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">Proizvod</TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">SKU</TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">Kategorija</TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-right">Cena</TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">Stanje</TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell>
                  <div className="relative w-12 h-12 bg-black border border-zinc-800 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-bold text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-zinc-500">{product.brand}</p>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 font-mono text-sm">
                  {product.sku}
                </TableCell>
                <TableCell className="text-zinc-400">
                  {product.category}
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
                    <p className="font-bold text-white">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {product.stock === 0 ? (
                    <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                      Nema
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      {product.stock}
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-lime/20 text-lime border border-lime/30">
                      {product.stock}
                    </span>
                  )}
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
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        Pregled
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                        <Link href={`/admin/proizvodi/${product.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Izmeni
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400 cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Obriši
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Prikazano <span className="text-lime font-bold">{filteredProducts.length}</span> od <span className="text-white">{products.length}</span> proizvoda
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-zinc-700 text-zinc-500 hover:border-lime hover:text-lime transition-colors text-sm font-bold uppercase" disabled>
              Prethodna
            </button>
            <button className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:border-lime hover:text-lime transition-colors text-sm font-bold uppercase">
              Sledeća
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
