"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";

export async function claimUsername(formData: FormData) {
  const user = await currentUser();

  if (!user) throw new Error("Usuario no autenticado");

  const username = formData.get("username") as string;

  const raw = formData.get("username");

  if (!username || username.length < 3)
    throw new Error("El username debe tener al menos 3 caracteres.");

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error(
      "El username debe contener solo letras, números o guiones bajos.",
    );
  }

  try {
    // Cast to any to avoid strict create-input typing mismatches in this MVP
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress as "",
        username: username.toLowerCase(),
        name: user.firstName
          ? `${user.firstName} ${user.lastName ?? ""}`.trim()
          : null,
      },
    });

    redirect("/");
  } catch (err: any) {
    // Let Prisma throw uniqueness errors for the MVP
    throw err;
  }
}
