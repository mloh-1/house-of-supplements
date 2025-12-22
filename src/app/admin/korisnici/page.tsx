"use client";

import { useState, useEffect } from "react";
import { Search, Users, Shield, ShoppingBag, Trash2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  city: string | null;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userToDelete.id));
      } else {
        const data = await response.json();
        alert(data.error || "Došlo je do greške prilikom brisanja");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Došlo je do greške prilikom brisanja");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesRole = true;
    if (roleFilter === "admin") matchesRole = user.role === "ADMIN";
    if (roleFilter === "customer") matchesRole = user.role === "CUSTOMER";

    return matchesSearch && matchesRole;
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
          <Users className="h-6 w-6 text-lime" />
          <div>
            <h1 className="font-display text-2xl text-white">KORISNICI</h1>
            <p className="text-zinc-500">Pregled registrovanih korisnika</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Pretraži po imenu ili email-u..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus:border-lime"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px] bg-black border-zinc-700 text-zinc-300">
                <SelectValue placeholder="Uloga" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Svi
                </SelectItem>
                <SelectItem value="admin" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Admini
                </SelectItem>
                <SelectItem value="customer" className="text-zinc-300 focus:bg-lime focus:text-black">
                  Kupci
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
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Korisnik
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Email
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Telefon
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Grad
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Porudžbine
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Uloga
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold">
                Registrovan
              </TableHead>
              <TableHead className="text-zinc-500 uppercase tracking-wider text-xs font-bold text-center">
                Akcije
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-zinc-500">
                  Nema korisnika za prikaz
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        {user.role === "ADMIN" ? (
                          <Shield className="h-5 w-5 text-lime" />
                        ) : (
                          <span className="text-zinc-400 font-bold text-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-white">
                        {user.name || "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {user.phone || "-"}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {user.city || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-zinc-600" />
                      <span className="text-zinc-300 font-bold">
                        {user._count.orders}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.role === "ADMIN" ? (
                      <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-lime/20 text-lime border border-lime/30">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Kupac
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Obriši korisnika"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Prikazano <span className="text-lime font-bold">{filteredUsers.length}</span> od{" "}
            <span className="text-white">{users.length}</span> korisnika
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Obrisati korisnika?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Da li ste sigurni da želite da obrišete korisnika{" "}
              <span className="text-white font-bold">{userToDelete?.email}</span>?
              {userToDelete?.role === "ADMIN" && (
                <span className="block mt-2 text-yellow-500">
                  Upozorenje: Ovaj korisnik je administrator!
                </span>
              )}
              <span className="block mt-2">
                Ova akcija je nepovratna i obrisaće sve podatke vezane za ovog korisnika.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">
              Otkaži
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 border-0"
            >
              {isDeleting ? "Brisanje..." : "Obriši"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
