import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public GET - returns only active promos, ordered
export async function GET() {
  try {
    const promos = await db.heroPromo.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(promos);
  } catch (error) {
    console.error("Get hero promos error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
