import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const sale = searchParams.get("sale") === "true";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Support both old and new filter params
    const categorySlug = searchParams.get("kategorija") || searchParams.get("category");
    const subcategorySlug = searchParams.get("potkategorija");
    const brandSlug = searchParams.get("brend");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      active: true,
    };

    if (featured) {
      where.featured = true;
    }

    if (sale) {
      where.salePrice = { not: null };
    }

    // Handle category/subcategory filtering
    if (subcategorySlug && categorySlug) {
      // Find the subcategory by slug and parent category slug
      const subcategory = await db.category.findFirst({
        where: {
          slug: subcategorySlug,
          parent: { slug: categorySlug },
        },
      });
      if (subcategory) {
        where.categoryId = subcategory.id;
      }
    } else if (categorySlug) {
      // Find main category and all its subcategories
      const category = await db.category.findUnique({
        where: { slug: categorySlug },
        include: { children: true },
      });
      if (category) {
        const categoryIds = [category.id, ...category.children.map((c) => c.id)];
        where.categoryId = { in: categoryIds };
      }
    }

    // Handle brand filtering
    if (brandSlug) {
      const brand = await db.brand.findUnique({
        where: { slug: brandSlug },
      });
      if (brand) {
        where.brandId = brand.id;
      }
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
      ...(limit && { take: limit }),
    });

    return NextResponse.json({
      products: products.map(product => ({
        ...product,
        images: parseImages(product.images),
      })),
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
