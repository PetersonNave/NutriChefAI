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

    const recipes = await prisma.recipe.findMany({
      where: { userId: decoded.userId },
      orderBy: { id: 'desc' },
      include: {
        ingredients: true,
        preparation: true,
        harmonizations: true,
        images: true,
      },
    });

    return NextResponse.json(recipes);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Erro interno no servidor',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    const { title, ingredients, preparation, harmonizations, images } = await req.json();

      const data = {
        title,
        userId: decoded.userId,
        ingredients: {
          create: ingredients.map((i: any) => ({
            name: i.name,
            unit: i.unit,
            amount: i.amount,
          })),
        },
        preparation: {
          create: preparation.map((p: any) => ({
            step: p,
          })),
        },
        harmonizations: {
          create: harmonizations?.map((h: any) => ({
            tip: h.tip,
            //justification: h.justification,
          })) ?? [],
        },
        images: {
          create: [
            {url: ""}
          ]
        },
      } 

      //return NextResponse.json(data, { status: 201 });


    const recipe = await prisma.recipe.create({
      data: data,
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Erro interno no servidor',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        prisma: error.code || undefined, // códigos de erro Prisma, como P2002 (chave duplicada)
      },
      { status: 500 }
    );
  }
}

export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        ingredients: true,
        preparation: true,
        harmonizations: true,
        images: true,
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
      },
      { status: 500 }
    );
  }
}