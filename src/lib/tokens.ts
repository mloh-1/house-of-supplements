import crypto from "crypto";
import { db } from "@/lib/db";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this email
  await db.verificationToken.deleteMany({
    where: { email },
  });

  // Create new token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch {
    return null;
  }
}

export async function deleteVerificationToken(id: string) {
  try {
    await db.verificationToken.delete({
      where: { id },
    });
  } catch {
    // Token might already be deleted
  }
}
