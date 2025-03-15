import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const SECRET = process.env.JWT_SECRET as string;

export function authenticateToken(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // Remover "Bearer "

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
}
