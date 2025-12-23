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

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status je obavezan" }, { status: 400 });
    }

    const validStatuses = ["PRIMLJENO", "POSLATO", "ISPORUCENO", "OTKAZANO"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Nevažeći status" }, { status: 400 });
    }

    // Get current order with items
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Porudžbina nije pronađena" }, { status: 404 });
    }

    const oldStatus = order.status;
    const newStatus = status;

    // Helper to parse variant info and get variantId
    const getVariantId = (variantInfo: string | null): string | null => {
      if (!variantInfo) return null;
      try {
        const parsed = JSON.parse(variantInfo);
        return parsed.variantId || null;
      } catch {
        return null;
      }
    };

    // Stock management logic
    // Decrement stock when changing TO "POSLATO" (from PRIMLJENO)
    if (oldStatus === "PRIMLJENO" && newStatus === "POSLATO") {
      // Check stock availability before proceeding
      for (const item of order.items) {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });

        if (!product) {
          return NextResponse.json(
            { error: `Proizvod nije pronađen` },
            { status: 400 }
          );
        }

        if (product.stock < item.quantity) {
          return NextResponse.json(
            { error: `Nema dovoljno proizvoda "${product.name}" na stanju (dostupno: ${product.stock}, potrebno: ${item.quantity})` },
            { status: 400 }
          );
        }

        // Also check variant stock if applicable
        const variantId = getVariantId(item.variantInfo);
        if (variantId) {
          const variant = await db.productVariant.findUnique({
            where: { id: variantId },
            select: { stock: true, value: true },
          });

          if (variant && variant.stock < item.quantity) {
            return NextResponse.json(
              { error: `Nema dovoljno varijante "${variant.value}" na stanju (dostupno: ${variant.stock}, potrebno: ${item.quantity})` },
              { status: 400 }
            );
          }
        }
      }

      // Decrement stock for all items
      for (const item of order.items) {
        // Decrement product stock
        await db.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Decrement variant stock if applicable
        const variantId = getVariantId(item.variantInfo);
        if (variantId) {
          await db.productVariant.update({
            where: { id: variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
    }

    // Restore stock when changing TO "OTKAZANO" from POSLATO or ISPORUCENO
    if ((oldStatus === "POSLATO" || oldStatus === "ISPORUCENO") && newStatus === "OTKAZANO") {
      // Restore stock for all items
      for (const item of order.items) {
        // Restore product stock
        await db.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        // Restore variant stock if applicable
        const variantId = getVariantId(item.variantInfo);
        if (variantId) {
          await db.productVariant.update({
            where: { id: variantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      message: "Status je uspešno ažuriran",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
