import { POST } from '../app/api/login/route';
import { NextRequest } from 'next/server';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

function createPostRequest(body: any): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('POST /api/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 400 se email ou senha estiverem ausentes', async () => {
    const req = createPostRequest({ email: '', password: '' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe('Email e senha são obrigatórios');
  });

  it('retorna 401 se o usuário não for encontrado', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const req = createPostRequest({ email: 'teste@email.com', password: 'senha123' });
    const res = await POST(req);
    const json = await res.json();

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'teste@email.com' } });
    expect(res.status).toBe(401);
    expect(json.message).toBe('Credenciais inválidas');
  });

  it('retorna 401 se a senha for incorreta', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, password: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = createPostRequest({ email: 'teste@email.com', password: 'senhaerrada' });
    const res = await POST(req);
    const json = await res.json();

    expect(bcrypt.compare).toHaveBeenCalledWith('senhaerrada', 'hash');
    expect(res.status).toBe(401);
    expect(json.message).toBe('Credenciais inválidas');
  });

  it('retorna 200 e o token se login for bem-sucedido', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, password: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

    const req = createPostRequest({ email: 'teste@email.com', password: 'senha123' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBe('fake-jwt-token');

    const setCookieHeader = res.headers.get('Set-Cookie');
    expect(setCookieHeader).toContain('token=fake-jwt-token');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('Max-Age=3600');
  });

  it('retorna 500 em caso de erro inesperado', async () => {
    (prisma.user.findUnique as jest.Mock).mockImplementation(() => {
      throw new Error('DB error');
    });

    const req = createPostRequest({ email: 'erro@email.com', password: '123' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe('Erro interno no servidor');
  });
});