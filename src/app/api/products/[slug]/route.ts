import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if user is admin to show stock count
    const session = await auth();
    let isAdmin = false;
    if (session?.user?.id) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      isAdmin = user?.role === "ADMIN";
    }

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            value: true,
            price: true,
            stock: true,
          },
          orderBy: [
            { name: "asc" },
            { value: "asc" },
          ],
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen" },
        { status: 404 }
      );
    }

    if (!product.active) {
      return NextResponse.json(
        { error: "Proizvod nije dostupan" },
        { status: 404 }
      );
    }

    // Group variants by name for easier frontend handling
    const groupedVariants: Record<string, { id: string; value: string; price: number | null; stock: number }[]> = {};
    for (const variant of product.variants) {
      if (!groupedVariants[variant.name]) {
        groupedVariants[variant.name] = [];
      }
      groupedVariants[variant.name].push({
        id: variant.id,
        value: variant.value,
        price: variant.price,
        stock: isAdmin ? variant.stock : (variant.stock > 0 ? 1 : 0),
      });
    }

    return NextResponse.json({
      ...product,
      images: parseImages(product.images),
      // Only show exact stock to admin, others just get inStock boolean
      stock: isAdmin ? product.stock : undefined,
      inStock: product.stock > 0,
      variants: groupedVariants,
      isAdmin,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
