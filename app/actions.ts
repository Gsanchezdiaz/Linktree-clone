"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function addLink(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Usuario no autenticado");

  const title = (formData.get("title") as string) || "";
  const url = (formData.get("url") as string) || "";

  if (!title || !url) throw new Error("Title and URL are required");

  // resolve email and user in DB
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("User email not found");

  const dbUser = await prisma.user.findUnique({ where: { email } as any });
  if (!dbUser) throw new Error("Profile not found. Please claim a username first.");

  try {
    await prisma.link.create({
      data: {
        title,
        url,
        userId: dbUser.id,
      } as any,
    });
    // revalidate the root path so the page shows the new link
    revalidatePath("/");
  } catch (err: any) {
    throw err;
  }
}

export async function deleteLink(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Usuario no autenticado");

  const idRaw = formData.get("linkId");
  const id = Number(idRaw);
  if (!id) throw new Error("Invalid link id");

  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("User email not found");

  const dbUser = await prisma.user.findUnique({ where: { email } as any });
  if (!dbUser) throw new Error("Profile not found.");

  // ensure ownership
  const link = await prisma.link.findUnique({ where: { id } as any });
  if (!link) throw new Error("Link not found");
  if (link.userId !== dbUser.id) throw new Error("Not authorized to delete this link");

  try {
    await prisma.link.delete({ where: { id } as any });
    revalidatePath("/");
  } catch (err: any) {
    throw err;
  }
}
