import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest, { params }: any) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    const {id} = await params;

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        ingredients: true,
        preparation: true,
        harmonizations: true,
        images: true,
        user: true,
      },
    });
    
    if (!recipe || recipe.userId !== decoded.userId) {
      return NextResponse.json({ message: 'Receita não encontrada ou acesso negado' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Erro interno no servidor',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}