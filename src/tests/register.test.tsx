import { POST } from '../app/api/register/route';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma'

jest.mock('../lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

function createPostRequest(body: any): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('POST /api/register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 400 se faltar nome, email ou senha', async () => {
    const req = createPostRequest({ name: '', email: '', password: '' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Nome, email e senha são obrigatórios.");
  });

  it('retorna 409 se o usuário já existir', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const req = createPostRequest({ name: 'Pedro', email: 'pedro@email.com', password: '123456' });
    const res = await POST(req);
    const json = await res.json();

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'pedro@email.com' } });
    expect(res.status).toBe(409);
    expect(json.message).toBe("Já existe um usuário com esse email.");
  });

  it('cria o usuário e retorna 201', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Pedro',
      email: 'pedro@email.com',
      restrictions: [{ value: 'sem glúten' }],
      favorites: [{ value: 'lasanha' }]
    });

    const req = createPostRequest({
      name: 'Pedro',
      email: 'pedro@email.com',
      password: '123456',
      restrictions: ['sem glúten'],
      favorites: ['lasanha']
    });

    const res = await POST(req);
    const json = await res.json();

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Pedro',
        email: 'pedro@email.com',
        password: 'hashed123',
        restrictions: { create: [{ value: 'sem glúten' }] },
        favorites: { create: [{ value: 'lasanha' }] },
      },
      include: {
        restrictions: true,
        favorites: true
      }
    });

    expect(res.status).toBe(201);
    expect(json.message).toBe("Usuário cadastrado com sucesso");
    expect(json.user.name).toBe("Pedro");
  });

  it('retorna 500 em erro inesperado', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB crash'));

    const req = createPostRequest({ name: 'Pedro', email: 'pedro@email.com', password: '123456' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Erro interno no servidor");
  });
});