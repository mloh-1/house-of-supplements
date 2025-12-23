import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

// Rate limiting: track last resend time per email
const resendCooldowns = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 1 minute cooldown

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email je obavezan" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check cooldown
    const lastResend = resendCooldowns.get(normalizedEmail);
    if (lastResend && Date.now() - lastResend < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - (Date.now() - lastResend)) / 1000);
      return NextResponse.json(
        { error: `Molimo sačekajte ${remainingSeconds} sekundi pre ponovnog slanja` },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: "Ako nalog postoji, email za potvrdu je poslat.",
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email je već potvrđen. Možete se prijaviti." },
        { status: 400 }
      );
    }

    // Generate new verification token and send email
    const verificationToken = await generateVerificationToken(normalizedEmail);
    await sendVerificationEmail(normalizedEmail, verificationToken.token);

    // Set cooldown
    resendCooldowns.set(normalizedEmail, Date.now());

    // Clean up old cooldowns periodically
    if (resendCooldowns.size > 1000) {
      const now = Date.now();
      for (const [key, time] of resendCooldowns.entries()) {
        if (now - time > COOLDOWN_MS * 10) {
          resendCooldowns.delete(key);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email za potvrdu je ponovo poslat.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške. Pokušajte ponovo." },
      { status: 500 }
    );
  }
}
