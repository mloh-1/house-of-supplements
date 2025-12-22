import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "House of Supplements <noreply@resend.dev>",
    to: email,
    subject: "Potvrdite vašu email adresu - House of Supplements",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #09090b; font-family: Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <table role="presentation" style="border-collapse: collapse;">
                        <tr>
                          <td style="background-color: #bef264; padding: 12px 16px;">
                            <span style="font-size: 24px; font-weight: bold; color: #000;">HS</span>
                          </td>
                          <td style="padding-left: 12px;">
                            <span style="font-size: 18px; color: #fff; display: block;">HOUSE OF</span>
                            <span style="font-size: 18px; color: #bef264; display: block;">SUPPLEMENTS</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="background-color: #18181b; border: 1px solid #27272a; padding: 40px;">
                      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                        Potvrdite vašu email adresu
                      </h1>
                      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                        Hvala vam što ste se registrovali na House of Supplements.
                        Kliknite na dugme ispod da potvrdite vašu email adresu i aktivirate nalog.
                      </p>

                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${confirmLink}"
                               style="display: inline-block; background-color: #bef264; color: #000; font-weight: bold; text-decoration: none; padding: 16px 40px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                              Potvrdi email
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        Ako niste vi kreirali ovaj nalog, možete ignorisati ovaj email.
                      </p>

                      <p style="color: #71717a; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                        Link ističe za 24 sata.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 30px; text-align: center;">
                      <p style="color: #52525b; font-size: 12px; margin: 0;">
                        &copy; ${new Date().getFullYear()} House of Supplements. Sva prava zadržana.
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
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "House of Supplements <noreply@resend.dev>",
    to: email,
    subject: "Resetovanje lozinke - House of Supplements",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #09090b; font-family: Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <table role="presentation" style="border-collapse: collapse;">
                        <tr>
                          <td style="background-color: #bef264; padding: 12px 16px;">
                            <span style="font-size: 24px; font-weight: bold; color: #000;">HS</span>
                          </td>
                          <td style="padding-left: 12px;">
                            <span style="font-size: 18px; color: #fff; display: block;">HOUSE OF</span>
                            <span style="font-size: 18px; color: #bef264; display: block;">SUPPLEMENTS</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="background-color: #18181b; border: 1px solid #27272a; padding: 40px;">
                      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                        Resetovanje lozinke
                      </h1>
                      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                        Primili smo zahtev za resetovanje vaše lozinke.
                        Kliknite na dugme ispod da postavite novu lozinku.
                      </p>

                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${resetLink}"
                               style="display: inline-block; background-color: #bef264; color: #000; font-weight: bold; text-decoration: none; padding: 16px 40px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                              Resetuj lozinku
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        Ako niste vi zatražili resetovanje lozinke, možete ignorisati ovaj email.
                      </p>

                      <p style="color: #71717a; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                        Link ističe za 1 sat.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 30px; text-align: center;">
                      <p style="color: #52525b; font-size: 12px; margin: 0;">
                        &copy; ${new Date().getFullYear()} House of Supplements. Sva prava zadržana.
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
}
