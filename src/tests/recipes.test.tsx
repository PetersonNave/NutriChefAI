import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/recipes/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../lib/prista';

describe('Recipes API', () => {
    let userToken: string;
    let recipeId: number;
  
    beforeAll(async () => {
      await prisma.recipe.deleteMany();
      await prisma.user.deleteMany();
  
      const user = await prisma.user.create({
        data: {
          name: 'Recipe Tester',
          email: 'recipetester@email.com',
          password: '$2a$10$encryptedpasswordhash', // Simulating bcrypt hash
        },
      });
  
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: { email: 'recipetester@email.com', password: 'securepassword123' },
      });
  
      await handler(req, res);
      userToken = JSON.parse(res._getData()).token;
    });
  
    it('should allow an authenticated user to create a recipe', async () => {
      const recipeData = {
        title: 'Bolo de Cenoura',
        ingredients: 'Cenoura, Farinha, Açúcar...',
        instructions: 'Misture tudo e asse por 40 minutos.',
      };
  
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: recipeData,
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(201);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody).toMatchObject({
        id: expect.any(Number),
        title: recipeData.title,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        userId: expect.any(Number), // Ensuring the response contains the userId
      });
  
      recipeId = responseBody.id; // Store the created recipe ID for future tests
    });
  
    it('should return an error if a required field is missing', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: {
          title: '',
          ingredients: 'Cenoura, Farinha, Açúcar...',
          instructions: 'Misture tudo e asse por 40 minutos.',
        },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'All fields are required');
    });
  
    it('should not allow creating a recipe without authentication', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          title: 'Unauthorized Recipe',
          ingredients: 'Unknown',
          instructions: 'No instructions available',
        },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Token not provided');
    });
  
    it('should return only recipes belonging to the authenticated user', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        headers: { Authorization: `Bearer ${userToken}` },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(200);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody.length).toBeGreaterThan(0);
      expect(responseBody[0]).toMatchObject({
        id: expect.any(Number),
        title: 'Bolo de Cenoura',
        ingredients: 'Cenoura, Farinha, Açúcar...',
        instructions: 'Misture tudo e asse por 40 minutos.',
        userId: expect.any(Number),
      });
    });
  
    it('should not allow retrieving recipes without authentication', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Token not provided');
    });
  
    it('should allow an authenticated user to delete their recipe', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userToken}` },
        query: { id: recipeId.toString() },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Recipe successfully deleted');
    });
  
    afterAll(async () => {
      await prisma.$disconnect();
    });
  });