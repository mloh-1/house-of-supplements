import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "Ako nalog sa ovim emailom postoji, poslaćemo vam link za reset lozinke.",
      });
    }

    // Check for rate limiting - only allow one request per 2 minutes
    const recentToken = await db.passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase(),
        createdAt: {
          gte: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        },
      },
    });

    if (recentToken) {
      return NextResponse.json(
        { error: "Molimo sačekajte 2 minuta pre ponovnog zahteva" },
        { status: 429 }
      );
    }

    // Delete any existing tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Create new token
    await db.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires,
      },
    });

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-lozinke/${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "House of Supplements <noreply@resend.dev>",
      to: email.toLowerCase(),
      subject: "Resetovanje lozinke - House of Supplements",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border: 1px solid #27272a;">
                  <tr>
                    <td style="padding: 40px; border-bottom: 1px solid #27272a;">
                      <table width="100%">
                        <tr>
                          <td>
                            <div style="display: inline-block; background-color: #a3e635; color: #000; padding: 12px 16px; font-weight: bold; font-size: 24px;">
                              HS
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; font-weight: bold;">
                        Resetovanje lozinke
                      </h1>
                      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Primili smo zahtev za resetovanje vaše lozinke. Kliknite na dugme ispod da biste postavili novu lozinku.
                      </p>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #a3e635; padding: 16px 32px;">
                            <a href="${resetUrl}" style="color: #000000; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                              Resetuj lozinku
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                        Ovaj link ističe za 1 sat. Ako niste zatražili reset lozinke, možete ignorisati ovaj email.
                      </p>
                      <p style="color: #52525b; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0;">
                        Ako dugme ne radi, kopirajte i nalepite sledeći link u pretraživač:<br>
                        <a href="${resetUrl}" style="color: #a3e635; word-break: break-all;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #27272a; background-color: #09090b;">
                      <p style="color: #52525b; font-size: 12px; margin: 0; text-align: center;">
                        © ${new Date().getFullYear()} House of Supplements. Sva prava zadržana.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      message: "Ako nalog sa ovim emailom postoji, poslaćemo vam link za reset lozinke.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške. Pokušajte ponovo." },
      { status: 500 }
    );
  }
}
