import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get or create settings
    let settings = await db.siteSettings.findUnique({
      where: { id: "settings" },
    });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: { id: "settings" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
