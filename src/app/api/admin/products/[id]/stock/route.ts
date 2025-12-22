import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    const body = await request.json();
    const { adjustment, stock } = body;

    // Get current product
    const product = await db.product.findUnique({
      where: { id },
      select: { stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Proizvod nije pronađen" }, { status: 404 });
    }

    let newStock: number;

    if (stock !== undefined) {
      // Set absolute stock value
      newStock = parseInt(stock);
    } else if (adjustment !== undefined) {
      // Increment/decrement stock
      newStock = product.stock + parseInt(adjustment);
    } else {
      return NextResponse.json(
        { error: "Morate navesti 'adjustment' ili 'stock'" },
        { status: 400 }
      );
    }

    // Ensure stock doesn't go negative
    if (newStock < 0) {
      newStock = 0;
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: { stock: newStock },
      select: { id: true, name: true, stock: true },
    });

    return NextResponse.json({
      message: "Stanje je uspešno ažurirano",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
