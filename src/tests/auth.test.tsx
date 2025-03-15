import loginHandler from '@/pages/api/auth/login';
import { createMocks } from 'node-mocks-http';
import registerHandler from '@/pages/api/auth/register';
import prisma from '../lib/prista';
import type { NextApiRequest, NextApiResponse } from 'next';


describe('Authentication API', () => {
    let userToken: string;
  
    beforeAll(async () => {

        await prisma.recipe.deleteMany();

        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });
  
    it('should register a new user successfully', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'testuser@email.com',
          password: 'securepassword123',
        },
      });
  
      await registerHandler(req, res);
  
      expect(res._getStatusCode()).toBe(201);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.email).toBe('testuser@email.com');
    });
  
    it('should not register a user with an already existing email', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          name: 'Duplicate User',
          email: 'testuser@email.com',
          password: 'newpassword123',
        },
      });
  
      await registerHandler(req, res);
  
      expect(res._getStatusCode()).toBe(400);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody).toHaveProperty('message', 'Erro ao criar usuário');
    });
  
    it('should log in an existing user and return a token', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          email: 'testuser@email.com',
          password: 'securepassword123',
        },
      });
  
      await loginHandler(req, res);
  
      expect(res._getStatusCode()).toBe(200);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody).toHaveProperty('token');
      userToken = responseBody.token;
    });
  
    it('should not log in with incorrect password', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          email: 'testuser@email.com',
          password: 'wrongpassword',
        },
      });
  
      await loginHandler(req, res);
  
      expect(res._getStatusCode()).toBe(401);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody).toHaveProperty('message', 'Credenciais inválidas');
    });
  
    it('should not log in with an unregistered email', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          email: 'nonexistent@email.com',
          password: 'somepassword',
        },
      });
  
      await loginHandler(req, res);
  
      expect(res._getStatusCode()).toBe(401);
      const responseBody = JSON.parse(res._getData());
      expect(responseBody).toHaveProperty('message', 'Credenciais inválidas');
    });
  });