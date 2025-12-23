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

    // Get current product with variants
    const product = await db.product.findUnique({
      where: { id },
      select: { stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Proizvod nije pronađen" }, { status: 404 });
    }

    let newStock: number;
    let stockDelta: number;

    if (stock !== undefined) {
      // Set absolute stock value
      newStock = parseInt(stock);
      stockDelta = newStock - product.stock;
    } else if (adjustment !== undefined) {
      // Increment/decrement stock
      stockDelta = parseInt(adjustment);
      newStock = product.stock + stockDelta;
    } else {
      return NextResponse.json(
        { error: "Morate navesti 'adjustment' ili 'stock'" },
        { status: 400 }
      );
    }

    // Ensure stock doesn't go negative
    if (newStock < 0) {
      newStock = 0;
      stockDelta = -product.stock;
    }

    // Update product stock
    const updatedProduct = await db.product.update({
      where: { id },
      data: { stock: newStock },
      select: { id: true, name: true, stock: true },
    });

    // Also update variant stocks if product has variants
    if (stockDelta !== 0) {
      const variants = await db.productVariant.findMany({
        where: { productId: id },
        orderBy: { createdAt: "asc" },
      });

      if (variants.length > 0) {
        // Group variants by category name
        const categoryMap = new Map<string, typeof variants>();
        for (const variant of variants) {
          const existing = categoryMap.get(variant.name) || [];
          existing.push(variant);
          categoryMap.set(variant.name, existing);
        }

        // For each category, adjust the first variant with stock > 0 (for decrement)
        // or the first variant (for increment)
        for (const [, categoryVariants] of categoryMap) {
          let remainingDelta = stockDelta;

          if (stockDelta < 0) {
            // Decrementing: find variants with stock > 0 and decrement them
            for (const variant of categoryVariants) {
              if (remainingDelta >= 0) break;
              if (variant.stock > 0) {
                const decrementAmount = Math.min(variant.stock, Math.abs(remainingDelta));
                await db.productVariant.update({
                  where: { id: variant.id },
                  data: { stock: { decrement: decrementAmount } },
                });
                remainingDelta += decrementAmount;
              }
            }
          } else {
            // Incrementing: add to the first variant in the category
            const firstVariant = categoryVariants[0];
            if (firstVariant) {
              await db.productVariant.update({
                where: { id: firstVariant.id },
                data: { stock: { increment: stockDelta } },
              });
            }
          }
        }
      }
    }

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
