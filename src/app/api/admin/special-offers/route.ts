import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

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

    const offers = await db.specialOffer.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse images for each product
    const formattedOffers = offers.map((offer) => ({
      ...offer,
      product: {
        ...offer.product,
        images: JSON.parse(offer.product.images || "[]"),
      },
    }));

    return NextResponse.json(formattedOffers);
  } catch (error) {
    console.error("Get special offers error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

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
    const { productId, discountPercent, startDate, endDate, active, featured } = body;

    if (!productId || !discountPercent || !endDate) {
      return NextResponse.json(
        { error: "Proizvod, popust i datum završetka su obavezni" },
        { status: 400 }
      );
    }

    // Check if product already has an offer
    const existingOffer = await db.specialOffer.findUnique({
      where: { productId },
    });

    if (existingOffer) {
      return NextResponse.json(
        { error: "Ovaj proizvod već ima specijalnu ponudu" },
        { status: 400 }
      );
    }

    // Get the product to calculate sale price
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      );
    }

    // Calculate sale price based on discount
    const salePrice = product.price - (product.price * discountPercent) / 100;

    // Create the special offer
    const offer = await db.specialOffer.create({
      data: {
        productId,
        discountPercent: parseInt(discountPercent),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        active: active ?? true,
        featured: featured ?? false,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
    });

    // Update product's sale price
    await db.product.update({
      where: { id: productId },
      data: { salePrice: Math.round(salePrice) },
    });

    return NextResponse.json({
      ...offer,
      product: {
        ...offer.product,
        images: JSON.parse(offer.product.images || "[]"),
      },
    });
  } catch (error) {
    console.error("Create special offer error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
