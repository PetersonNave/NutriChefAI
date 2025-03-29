import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const decoded = authenticateToken(req, res);
    if (!decoded || typeof decoded === 'object' && 'message' in decoded) return;
  
    if (req.method === 'GET') {

      const recipes = await prisma.recipe.findMany({
        where: { userId: (decoded as any).userId },
      });
      return res.json(recipes);
    }
  
    if (req.method === 'POST') {
      const { title, ingredients, instructions } = req.body;
  
      const recipe = await prisma.recipe.create({
        data: { title, ingredients, instructions, userId: (decoded as any).userId },
      });
  
      return res.status(201).json(recipe);
    }
  
    return res.status(405).json({ message: 'Método não permitido' });
  }