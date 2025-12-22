import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getVerificationTokenByToken, deleteVerificationToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token je obavezan" },
        { status: 400 }
      );
    }

    // Get the verification token
    const verificationToken = await getVerificationTokenByToken(token);

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Nevažeći token za verifikaciju" },
        { status: 400 }
      );
    }

    // Check if token has expired
    const hasExpired = new Date(verificationToken.expires) < new Date();

    if (hasExpired) {
      // Delete expired token
      await deleteVerificationToken(verificationToken.id);
      return NextResponse.json(
        { error: "Token je istekao. Molimo registrujte se ponovo." },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      await deleteVerificationToken(verificationToken.id);
      return NextResponse.json({
        success: true,
        message: "Email je već potvrđen. Možete se prijaviti.",
        alreadyVerified: true,
      });
    }

    // Update user's emailVerified field
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await deleteVerificationToken(verificationToken.id);

    return NextResponse.json({
      success: true,
      message: "Email uspešno potvrđen! Sada možete da se prijavite.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom verifikacije" },
      { status: 500 }
    );
  }
}
