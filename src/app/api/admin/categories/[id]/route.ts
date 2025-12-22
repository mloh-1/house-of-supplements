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
    const { name, description, parentId } = body;

    const existingCategory = await db.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 }
      );
    }

    const updateData: { name?: string; slug?: string; description?: string | null; parentId?: string | null } = {};

    if (name && name !== existingCategory.name) {
      const slug = generateSlug(name);

      // Check if another category has this slug
      const categoryWithSlug = await db.category.findFirst({
        where: { slug, id: { not: id } },
      });

      if (categoryWithSlug) {
        return NextResponse.json(
          { error: "Kategorija sa ovim nazivom već postoji" },
          { status: 400 }
        );
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (description !== undefined) {
      updateData.description = description || null;
    }

    if (parentId !== undefined) {
      // Can't set parent if this category has children
      if (existingCategory.children.length > 0 && parentId) {
        return NextResponse.json(
          { error: "Kategorija sa podkategorijama ne može imati roditelja" },
          { status: 400 }
        );
      }

      // Verify parent exists
      if (parentId) {
        const parent = await db.category.findUnique({
          where: { id: parentId },
        });

        if (!parent) {
          return NextResponse.json(
            { error: "Roditeljska kategorija nije pronađena" },
            { status: 400 }
          );
        }

        // Can't set self as parent
        if (parentId === id) {
          return NextResponse.json(
            { error: "Kategorija ne može biti sama sebi roditelj" },
            { status: 400 }
          );
        }

        // Don't allow more than 2 levels deep
        if (parent.parentId) {
          return NextResponse.json(
            { error: "Nije moguće kreirati podkategoriju podkategorije" },
            { status: 400 }
          );
        }
      }

      updateData.parentId = parentId || null;
    }

    const category = await db.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
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

    const category = await db.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategorija nije pronađena" },
        { status: 404 }
      );
    }

    // Check if category has children
    if (category.children.length > 0) {
      return NextResponse.json(
        { error: "Nije moguće obrisati kategoriju koja ima podkategorije" },
        { status: 400 }
      );
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Nije moguće obrisati kategoriju jer ima ${category._count.products} proizvoda` },
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kategorija je uspešno obrisana" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
