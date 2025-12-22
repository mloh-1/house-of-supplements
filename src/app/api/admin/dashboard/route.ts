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

    // Get counts
    const [productsCount, usersCount, ordersCount] = await Promise.all([
      db.product.count(),
      db.user.count(),
      db.order.count(),
    ]);

    // Get total sales from delivered orders (ISPORUCENO)
    const deliveredOrders = await db.order.findMany({
      where: { status: "ISPORUCENO" },
      select: { total: true },
    });
    const totalSales = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

    // Get recent orders (last 5)
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        shippingName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    // Get top selling products (by quantity from delivered orders)
    const orderItems = await db.orderItem.findMany({
      where: {
        order: { status: "ISPORUCENO" },
      },
      select: {
        productId: true,
        quantity: true,
        price: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    // Aggregate sales by product
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();

    for (const item of orderItems) {
      const existing = productSales.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productSales.set(item.productId, {
          name: item.product.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
    }

    // Sort by quantity and take top 5
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((product) => ({
        name: product.name,
        sales: product.quantity,
        revenue: product.revenue,
      }));

    return NextResponse.json({
      stats: {
        totalSales,
        ordersCount,
        productsCount,
        usersCount,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.orderNumber,
        customer: order.shippingName,
        date: order.createdAt,
        total: order.total,
        status: order.status,
      })),
      topProducts,
    });
  } catch (error) {
    console.error("Get dashboard data error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
