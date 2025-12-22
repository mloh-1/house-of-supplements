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
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const products = await db.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
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
      take: limit,
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    const total = await db.product.count({
      where: {
        active: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      images: parseImages(product.images),
      category: product.category,
      brand: product.brand,
      inStock: product.stock > 0,
    }));

    return NextResponse.json({
      products: formattedProducts,
      total,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške pri pretrazi" },
      { status: 500 }
    );
  }
}
