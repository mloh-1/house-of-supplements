import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    console.log("[PATCH Special Offer] ID:", id, "Body:", body);
    const { discountPercent, startDate, endDate, active, featured } = body;

    const existingOffer = await db.specialOffer.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!existingOffer) {
      return NextResponse.json(
        { error: "Ponuda nije pronađena" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: {
      discountPercent?: number;
      startDate?: Date;
      endDate?: Date;
      active?: boolean;
      featured?: boolean;
    } = {};

    if (discountPercent !== undefined) {
      updateData.discountPercent = parseInt(discountPercent);
    }
    if (startDate !== undefined) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate !== undefined) {
      updateData.endDate = new Date(endDate);
    }
    if (active !== undefined) {
      updateData.active = active;
    }
    if (featured !== undefined) {
      updateData.featured = featured;
    }

    console.log("[PATCH Special Offer] Update data:", updateData);
    const offer = await db.specialOffer.update({
      where: { id },
      data: updateData,
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
    console.log("[PATCH Special Offer] Updated offer featured:", offer.featured);

    // Update product's sale price if discount changed
    if (discountPercent !== undefined) {
      const salePrice = existingOffer.product.price - (existingOffer.product.price * discountPercent) / 100;
      await db.product.update({
        where: { id: existingOffer.productId },
        data: { salePrice: Math.round(salePrice) },
      });
    }

    // If offer is deactivated, remove sale price from product
    if (active === false) {
      await db.product.update({
        where: { id: existingOffer.productId },
        data: { salePrice: null },
      });
    } else if (active === true && existingOffer.active === false) {
      // If offer is reactivated, restore sale price
      const discount = discountPercent ?? existingOffer.discountPercent;
      const salePrice = existingOffer.product.price - (existingOffer.product.price * discount) / 100;
      await db.product.update({
        where: { id: existingOffer.productId },
        data: { salePrice: Math.round(salePrice) },
      });
    }

    return NextResponse.json({
      ...offer,
      product: {
        ...offer.product,
        images: JSON.parse(offer.product.images || "[]"),
      },
    });
  } catch (error) {
    console.error("Update special offer error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const existingOffer = await db.specialOffer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return NextResponse.json(
        { error: "Ponuda nije pronađena" },
        { status: 404 }
      );
    }

    // Remove sale price from product
    await db.product.update({
      where: { id: existingOffer.productId },
      data: { salePrice: null },
    });

    // Delete the offer
    await db.specialOffer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ponuda je uspešno obrisana" });
  } catch (error) {
    console.error("Delete special offer error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
