import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({ token }, { status: 200 });
    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}