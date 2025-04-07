import { getUserRecipes } from '../services/getUserRecipes/getUserRecipes';

describe('getUserRecipes', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna lista de receitas do usuário (caso normal)', async () => {
    const fakeRecipes = [
      { id: 1, title: 'Receita A' },
      { id: 2, title: 'Receita B' },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => fakeRecipes,
    });

    const result = await getUserRecipes();
    expect(result).toEqual(fakeRecipes);
    expect(fetch).toHaveBeenCalledWith('/api/recipes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('retorna lista vazia se API responde com lista vazia (caso extremo)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await getUserRecipes();
    expect(result).toEqual([]);
  });

  it('retorna lista vazia se API falha (caso inválido)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Erro interno' }),
    });

    const result = await getUserRecipes();
    expect(result).toEqual([]);
  });

  it('retorna lista vazia se fetch lançar erro (ex: sem internet)', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const result = await getUserRecipes();
    expect(result).toEqual([]);
  });
});
