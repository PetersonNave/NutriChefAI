import { GET } from '../app/api/recipes/[id]/route';
import { NextRequest } from 'next/server';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

jest.mock('../lib/prisma', () => ({
  recipe: {
    findUnique: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

function createMockRequest(token: string | null, params: { id: string }): NextRequest {
  return {
    cookies: {
      get: (key: string) => (key === 'token' && token ? { value: token } : undefined),
    },
  } as unknown as NextRequest;
}

describe('GET /api/recipes/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 401 se não houver token', async () => {
    const req = createMockRequest(null, { id: '1' });
    const res = await GET(req, { params: { id: '1' } });
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.message).toBe('Não autenticado');
  });

  it('retorna 404 se a receita não existir ou não pertencer ao usuário', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 99 });
    (prisma.recipe.findUnique as jest.Mock).mockResolvedValue(null);

    const req = createMockRequest('fake-token', { id: '123' });
    const res = await GET(req, { params: { id: '123' } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.message).toBe('Receita não encontrada ou acesso negado');
  });

  it('retorna 404 se a receita não for do usuário logado', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
    (prisma.recipe.findUnique as jest.Mock).mockResolvedValue({ id: 123, userId: 2 });

    const req = createMockRequest('fake-token', { id: '123' });
    const res = await GET(req, { params: { id: '123' } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.message).toBe('Receita não encontrada ou acesso negado');
  });

  it('retorna a receita corretamente se o usuário for autorizado', async () => {
    const fakeRecipe = {
      id: 123,
      userId: 1,
      ingredients: [],
      preparation: [],
      harmonizations: [],
      images: [],
      user: { id: 1, name: 'Pedro' },
    };

    (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
    (prisma.recipe.findUnique as jest.Mock).mockResolvedValue(fakeRecipe);

    const req = createMockRequest('valid-token', { id: '123' });
    const res = await GET(req, { params: { id: '123' } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(123);
    expect(json.user.name).toBe('Pedro');
  });

  it('retorna 500 em erro inesperado', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token inválido');
    });

    const req = createMockRequest('invalid-token', { id: '123' });
    const res = await GET(req, { params: { id: '123' } });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe('Erro interno no servidor');
  });
});