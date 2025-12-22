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

    const promos = await db.heroPromo.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(promos);
  } catch (error) {
    console.error("Get hero promos error:", error);
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
    const { title, subtitle, description, image, buttonText, buttonLink, active, order } = body;

    if (!title || !image) {
      return NextResponse.json(
        { error: "Naslov i slika su obavezni" },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let promoOrder = order;
    if (promoOrder === undefined) {
      const maxOrder = await db.heroPromo.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      promoOrder = (maxOrder?.order || 0) + 1;
    }

    const promo = await db.heroPromo.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        image,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        active: active ?? true,
        order: promoOrder,
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.error("Create hero promo error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
