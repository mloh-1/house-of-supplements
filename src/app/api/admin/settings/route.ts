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

    // Get or create settings
    let settings = await db.siteSettings.findUnique({
      where: { id: "settings" },
    });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: { id: "settings" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
    const {
      storeName,
      storeEmail,
      storePhone1,
      storePhone2,
      storeAddress1,
      storeAddress2,
      freeShippingMin,
      shippingCost,
      facebookUrl,
      instagramUrl,
    } = body;

    const settings = await db.siteSettings.upsert({
      where: { id: "settings" },
      update: {
        storeName: storeName || "House of Supplements",
        storeEmail: storeEmail || null,
        storePhone1: storePhone1 || null,
        storePhone2: storePhone2 || null,
        storeAddress1: storeAddress1 || null,
        storeAddress2: storeAddress2 || null,
        freeShippingMin: freeShippingMin !== undefined ? parseFloat(freeShippingMin) : 4000,
        shippingCost: shippingCost !== undefined ? parseFloat(shippingCost) : 350,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
      },
      create: {
        id: "settings",
        storeName: storeName || "House of Supplements",
        storeEmail: storeEmail || null,
        storePhone1: storePhone1 || null,
        storePhone2: storePhone2 || null,
        storeAddress1: storeAddress1 || null,
        storeAddress2: storeAddress2 || null,
        freeShippingMin: freeShippingMin !== undefined ? parseFloat(freeShippingMin) : 4000,
        shippingCost: shippingCost !== undefined ? parseFloat(shippingCost) : 350,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
