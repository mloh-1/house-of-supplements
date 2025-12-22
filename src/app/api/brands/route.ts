import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Get brands error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
