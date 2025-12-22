import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

// Email validation regex - stricter pattern
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

async function validateEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1];
    if (!domain) return false;

    // Check if domain has MX records (mail servers)
    const mxRecords = await resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch {
    // If DNS lookup fails, domain doesn't have valid MX records
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, address, city, postalCode } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, lozinka i ime su obavezni" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Unesite validnu email adresu" },
        { status: 400 }
      );
    }

    // Validate email domain has MX records (real email provider)
    const isValidDomain = await validateEmailDomain(email);
    if (!isValidDomain) {
      return NextResponse.json(
        { error: "Email adresa nije validna. Molimo koristite postojeću email adresu." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik sa ovim emailom već postoji" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user (with emailVerified as null)
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        role: "CUSTOMER",
        emailVerified: null,
      },
    });

    // Generate verification token and send email
    const verificationToken = await generateVerificationToken(user.email);
    await sendVerificationEmail(user.email, verificationToken.token);

    return NextResponse.json({
      success: true,
      message: "Registracija uspešna! Proverite email za potvrdu naloga.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom registracije" },
      { status: 500 }
    );
  }
}
