import { authService } from '../services/authService/authService';

describe('authService', () => {
  const token = 'fake-token';

  // Mock simples do localStorage
  beforeAll(() => {
    const store: Record<string, string> = {};

    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key in store) {
          delete store[key];
        }
      },
      key: (index: number) => Object.keys(store)[index] || null,
      length: 0,
    };
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('salva o token no localStorage', () => {
    authService.saveToken(token);
    expect(localStorage.getItem('nutrichef_token')).toBe(token);
  });

  it('retorna o token do localStorage', () => {
    localStorage.setItem('nutrichef_token', token);
    const retrieved = authService.getToken();
    expect(retrieved).toBe(token);
  });

  it('remove o token do localStorage', () => {
    localStorage.setItem('nutrichef_token', token);
    authService.removeToken();
    expect(localStorage.getItem('nutrichef_token')).toBeNull();
  });

  it('retorna verdadeiro se o usuário estiver autenticado', () => {
    localStorage.setItem('nutrichef_token', token);
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('retorna falso se não houver token', () => {
    expect(authService.isAuthenticated()).toBe(false);
  });
});
