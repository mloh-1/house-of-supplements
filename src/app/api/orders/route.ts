import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      items,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingPostal,
      notes,
      subtotal,
      shipping,
      total,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Korpa je prazna" }, { status: 400 });
    }

    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress || !shippingCity || !shippingPostal) {
      return NextResponse.json({ error: "Sva polja za dostavu su obavezna" }, { status: 400 });
    }

    // Validate stock for all items
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true, active: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Proizvod "${item.name}" nije pronađen` },
          { status: 400 }
        );
      }

      if (!product.active) {
        return NextResponse.json(
          { error: `Proizvod "${item.name}" nije dostupan` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Nema dovoljno proizvoda "${item.name}" na stanju (dostupno: ${product.stock})` },
          { status: 400 }
        );
      }
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        guestEmail: !session?.user ? shippingEmail : null,
        guestName: !session?.user ? shippingName : null,
        guestPhone: !session?.user ? shippingPhone : null,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPostal,
        shippingPhone,
        subtotal,
        shipping,
        total,
        status: "PRIMLJENO",
        notes: notes || null,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number; variant?: { name: string; value: string } }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantInfo: item.variant ? JSON.stringify(item.variant) : null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      message: "Porudžbina je uspešno kreirana",
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom kreiranja porudžbine" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
