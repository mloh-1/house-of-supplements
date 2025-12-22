import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    // Check if user exists
    const userToDelete = await db.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "Korisnik nije pronađen" }, { status: 404 });
    }

    // Delete the user (cascade will handle related records)
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Korisnik uspešno obrisan" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom brisanja korisnika" },
      { status: 500 }
    );
  }
}
