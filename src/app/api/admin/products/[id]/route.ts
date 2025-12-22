import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
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

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Proizvod nije pronađen" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}

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
    const {
      name,
      slug,
      description,
      shortDesc,
      price,
      salePrice,
      sku,
      stock,
      images,
      featured,
      active,
      categoryId,
      brandId,
      variants,
    } = body;

    // Check if slug already exists for another product
    if (slug) {
      const existingProduct = await db.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: "Proizvod sa ovim URL-om već postoji" },
          { status: 400 }
        );
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
        description: description !== undefined ? description : undefined,
        shortDesc: shortDesc !== undefined ? shortDesc : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : undefined,
        sku: sku !== undefined ? sku : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        images: images !== undefined ? images : undefined,
        featured: featured !== undefined ? featured : undefined,
        active: active !== undefined ? active : undefined,
        categoryId: categoryId || undefined,
        brandId: brandId !== undefined ? brandId : undefined,
      },
    });

    // Handle variants if provided
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (variant.isDeleted && variant.id) {
          // Delete existing variant
          await db.productVariant.delete({
            where: { id: variant.id },
          });
        } else if (variant.isNew && variant.name && variant.value) {
          // Create new variant
          await db.productVariant.create({
            data: {
              productId: id,
              name: variant.name,
              value: variant.value,
              stock: variant.stock || 0,
            },
          });
        } else if (variant.id && !variant.isDeleted) {
          // Update existing variant
          await db.productVariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name,
              value: variant.value,
              stock: variant.stock || 0,
            },
          });
        }
      }
    }

    return NextResponse.json({
      message: "Proizvod je uspešno ažuriran",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
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

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Proizvod je uspešno obrisan",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
