import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prista'
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });


  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=7200`);

  return res.json({ token: token });
}