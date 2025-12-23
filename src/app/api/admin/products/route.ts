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

export async function GET() {
  try {
    const session = await auth();

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

    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Get admin products error:", error);
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

    // Check if user is admin
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
      newCategoryName,
      brandId,
      newBrandName,
      variants,
    } = body;

    const hasCategory = categoryId || newCategoryName;
    if (!name || !slug || !price || !hasCategory) {
      return NextResponse.json(
        { error: "Naziv, slug, cena i kategorija su obavezni" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Proizvod sa ovim URL-om već postoji" },
        { status: 400 }
      );
    }

    // Handle new category creation if newCategoryName is provided
    let finalCategoryId = categoryId || null;
    if (newCategoryName && !categoryId) {
      const categorySlug = generateSlug(newCategoryName);

      // Check if category already exists
      const existingCategory = await db.category.findUnique({
        where: { slug: categorySlug },
      });

      if (existingCategory) {
        // Use existing category
        finalCategoryId = existingCategory.id;
      } else {
        // Create new category
        const newCategory = await db.category.create({
          data: {
            name: newCategoryName,
            slug: categorySlug,
          },
        });
        finalCategoryId = newCategory.id;
      }
    }

    // Handle new brand creation if newBrandName is provided
    let finalBrandId = brandId || null;
    if (newBrandName && !brandId) {
      const brandSlug = generateSlug(newBrandName);

      // Check if brand already exists
      const existingBrand = await db.brand.findUnique({
        where: { slug: brandSlug },
      });

      if (existingBrand) {
        // Use existing brand
        finalBrandId = existingBrand.id;
      } else {
        // Create new brand
        const newBrand = await db.brand.create({
          data: {
            name: newBrandName,
            slug: brandSlug,
          },
        });
        finalBrandId = newBrand.id;
      }
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || null,
        shortDesc: shortDesc || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: sku || null,
        stock: stock ? parseInt(stock) : 0,
        images: images || "[]",
        featured: featured || false,
        active: active !== false,
        categoryId: finalCategoryId!,
        brandId: finalBrandId,
      },
    });

    // Create variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantRecords = [];
      for (const variant of variants) {
        // New format: { name: string, options: [{ value: string, stock: number }] }
        if (variant.name && variant.options && Array.isArray(variant.options)) {
          for (const option of variant.options) {
            if (option.value) {
              variantRecords.push({
                productId: product.id,
                name: variant.name,
                value: option.value,
                stock: option.stock || 0,
              });
            }
          }
        }
        // Legacy format: { name: string, value: string (comma-separated) }
        else if (variant.name && variant.value) {
          const values = variant.value.split(",").map((v: string) => v.trim()).filter(Boolean);
          for (const value of values) {
            variantRecords.push({
              productId: product.id,
              name: variant.name,
              value: value,
              stock: 0,
            });
          }
        }
      }

      if (variantRecords.length > 0) {
        await db.productVariant.createMany({
          data: variantRecords,
        });
      }
    }

    return NextResponse.json({
      message: "Proizvod je uspešno kreiran",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
