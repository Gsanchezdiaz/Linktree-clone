import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { clerkId, email, username, name } = body;

    if (!clerkId || !email || !username) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    // Cast data as any to be permissive in this MVP
    const user = await prisma.user.create({
      data: { clerkId, email, username, name: name ?? null },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Invalid request to create user:", error);
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 },
    );
  }
}
