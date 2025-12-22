import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/[š]/g, "s")
    .replace(/[ž]/g, "z")
    .replace(/[đ]/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
    const { name, description } = body;

    const existingBrand = await db.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: "Brend nije pronađen" },
        { status: 404 }
      );
    }

    const updateData: { name?: string; slug?: string; description?: string | null } = {};

    if (name && name !== existingBrand.name) {
      const slug = generateSlug(name);

      // Check if another brand has this slug
      const brandWithSlug = await db.brand.findFirst({
        where: { slug, id: { not: id } },
      });

      if (brandWithSlug) {
        return NextResponse.json(
          { error: "Brend sa ovim nazivom već postoji" },
          { status: 400 }
        );
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    const brand = await db.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Update brand error:", error);
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

    // Check if brand has products
    const productsCount = await db.product.count({
      where: { brandId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Nije moguće obrisati brend jer ima ${productsCount} proizvoda` },
        { status: 400 }
      );
    }

    await db.brand.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Brend je uspešno obrisan" });
  } catch (error) {
    console.error("Delete brand error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
