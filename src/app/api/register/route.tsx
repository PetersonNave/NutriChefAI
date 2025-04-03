import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, restrictions, favorites } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Já existe um usuário com esse email." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        restrictions: {
          create: (restrictions || []).filter((r: string) => r.trim() !== '').map((r: string) => ({ value: r }))
        },
        favorites: {
          create: (favorites || []).filter((f: string) => f.trim() !== '').map((f: string) => ({ value: f }))
        },
        
      },
      include: {
        restrictions: true,
        favorites: true
      }
    });

    return NextResponse.json({ message: "Usuário cadastrado com sucesso", user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}