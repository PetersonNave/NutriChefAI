import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        restrictions: true,
        favorites: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const { password, recipes, ...userWithoutSensitive } = user;

    return NextResponse.json(userWithoutSensitive);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
      const token = req.cookies.get('token')?.value;
      if (!token) {
        return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
      const { name, email, restrictions, favorites } = await req.json();
  
      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          name,
          email,
          restrictions: {
            deleteMany: {},
            create: (restrictions || []).filter((r: string) => r.trim() !== '').map((r: string) => ({ value: r })),
          },
          favorites: {
            deleteMany: {},
            create: (favorites || []).filter((f: string) => f.trim() !== '').map((f: string) => ({ value: f })),
          },
        },
        include: {
          restrictions: true,
          favorites: true,
        },
      });
  
      const { password, recipes, ...userWithoutSensitive } = updatedUser;
  
      return NextResponse.json(userWithoutSensitive);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
    }
  }
  