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
    const { title, subtitle, description, image, buttonText, buttonLink, active, order } = body;

    const promo = await db.heroPromo.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        description: description !== undefined ? description : undefined,
        image: image !== undefined ? image : undefined,
        buttonText: buttonText !== undefined ? buttonText : undefined,
        buttonLink: buttonLink !== undefined ? buttonLink : undefined,
        active: active !== undefined ? active : undefined,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.error("Update hero promo error:", error);
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

    await db.heroPromo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Promo je uspešno obrisan" });
  } catch (error) {
    console.error("Delete hero promo error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
