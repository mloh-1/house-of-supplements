import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      items,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingPostal,
      notes,
      subtotal,
      shipping,
      total,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Korpa je prazna" }, { status: 400 });
    }

    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress || !shippingCity || !shippingPostal) {
      return NextResponse.json({ error: "Sva polja za dostavu su obavezna" }, { status: 400 });
    }

    // Validate stock for all items
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true, active: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Proizvod "${item.name}" nije pronađen` },
          { status: 400 }
        );
      }

      if (!product.active) {
        return NextResponse.json(
          { error: `Proizvod "${item.name}" nije dostupan` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Nema dovoljno proizvoda "${item.name}" na stanju (dostupno: ${product.stock})` },
          { status: 400 }
        );
      }
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        guestEmail: !session?.user ? shippingEmail : null,
        guestName: !session?.user ? shippingName : null,
        guestPhone: !session?.user ? shippingPhone : null,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPostal,
        shippingPhone,
        subtotal,
        shipping,
        total,
        status: "PRIMLJENO",
        notes: notes || null,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number; variantInfo?: string; variantId?: string }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantInfo: item.variantInfo || item.variantId
              ? JSON.stringify({ info: item.variantInfo, variantId: item.variantId })
              : null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send order confirmation email
    try {
      const itemsHtml = items.map((item: { name: string; quantity: number; price: number; variantInfo?: string }) => `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #27272a;">
            <div style="color: #ffffff; font-weight: 500;">${item.name}</div>
            ${item.variantInfo ? `<div style="color: #71717a; font-size: 12px; margin-top: 4px;">${item.variantInfo}</div>` : ''}
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #27272a; text-align: center; color: #a1a1aa;">
            ${item.quantity}
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #27272a; text-align: right; color: #ffffff; font-weight: 500;">
            ${item.price.toLocaleString('sr-RS')} RSD
          </td>
        </tr>
      `).join('');

      await resend.emails.send({
        from: process.env.EMAIL_FROM || "House of Supplements <noreply@resend.dev>",
        to: shippingEmail,
        subject: `Potvrda porudžbine #${orderNumber} - House of Supplements`,
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
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px; border-bottom: 1px solid #27272a;">
                        <table width="100%">
                          <tr>
                            <td>
                              <div style="display: inline-block; background-color: #a3e635; color: #000; padding: 12px 16px; font-weight: bold; font-size: 24px;">
                                HS
                              </div>
                            </td>
                            <td style="text-align: right;">
                              <div style="color: #a3e635; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Porudžbina</div>
                              <div style="color: #ffffff; font-size: 20px; font-weight: bold;">#${orderNumber}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                      <td style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                          <div style="display: inline-block; background-color: rgba(163, 230, 53, 0.1); border: 1px solid rgba(163, 230, 53, 0.3); padding: 16px; margin-bottom: 20px;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a3e635" stroke-width="2">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
                            Hvala na porudžbini!
                          </h1>
                          <p style="color: #a1a1aa; font-size: 16px; margin: 0;">
                            Vaša porudžbina je uspešno primljena i biće obrađena u najkraćem roku.
                          </p>
                        </div>

                        <!-- Order Items -->
                        <div style="margin-bottom: 30px;">
                          <h2 style="color: #a3e635; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px 0;">
                            // Stavke porudžbine
                          </h2>
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; border: 1px solid #27272a;">
                            <thead>
                              <tr style="background-color: #27272a;">
                                <th style="padding: 12px 16px; text-align: left; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Proizvod</th>
                                <th style="padding: 12px 16px; text-align: center; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Kol.</th>
                                <th style="padding: 12px 16px; text-align: right; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Cena</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${itemsHtml}
                            </tbody>
                          </table>
                        </div>

                        <!-- Order Summary -->
                        <div style="background-color: #09090b; border: 1px solid #27272a; padding: 20px; margin-bottom: 30px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #a1a1aa; padding: 8px 0;">Međuzbir:</td>
                              <td style="color: #ffffff; text-align: right; padding: 8px 0;">${subtotal.toLocaleString('sr-RS')} RSD</td>
                            </tr>
                            <tr>
                              <td style="color: #a1a1aa; padding: 8px 0;">Dostava:</td>
                              <td style="color: #ffffff; text-align: right; padding: 8px 0;">${shipping === 0 ? '<span style="color: #a3e635;">BESPLATNO</span>' : shipping.toLocaleString('sr-RS') + ' RSD'}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding: 12px 0;"><div style="border-top: 1px solid #27272a;"></div></td>
                            </tr>
                            <tr>
                              <td style="color: #ffffff; font-weight: bold; font-size: 18px; padding: 8px 0;">Ukupno:</td>
                              <td style="color: #a3e635; font-weight: bold; font-size: 18px; text-align: right; padding: 8px 0;">${total.toLocaleString('sr-RS')} RSD</td>
                            </tr>
                          </table>
                        </div>

                        <!-- Shipping Info -->
                        <div style="background-color: #09090b; border: 1px solid #27272a; padding: 20px;">
                          <h2 style="color: #a3e635; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px 0;">
                            // Adresa za dostavu
                          </h2>
                          <p style="color: #ffffff; margin: 0 0 4px 0; font-weight: 500;">${shippingName}</p>
                          <p style="color: #a1a1aa; margin: 0 0 4px 0;">${shippingAddress}</p>
                          <p style="color: #a1a1aa; margin: 0 0 4px 0;">${shippingPostal} ${shippingCity}</p>
                          <p style="color: #a1a1aa; margin: 0;">${shippingPhone}</p>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #27272a; background-color: #09090b;">
                        <p style="color: #71717a; font-size: 14px; margin: 0 0 10px 0; text-align: center;">
                          Očekujte isporuku u roku od 1-3 radna dana.
                        </p>
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
    } catch (emailError) {
      // Log email error but don't fail the order
      console.error("Failed to send order confirmation email:", emailError);
    }

    return NextResponse.json({
      message: "Porudžbina je uspešno kreirana",
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom kreiranja porudžbine" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške" },
      { status: 500 }
    );
  }
}
