import { getRecipeById } from '../services/getRecipeById/getRecipeById';

describe('getRecipeById', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('retorna uma receita válida quando o ID é válido', async () => {
    const fakeRecipe = {
      id: 1,
      title: 'Receita de Teste',
      ingredients: [],
      preparation: [],
      harmonizations: [],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => fakeRecipe,
    });

    const recipe = await getRecipeById(1);
    expect(recipe).toEqual(fakeRecipe);
  });

  it('lança erro quando o fetch falha', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(getRecipeById(1234)).rejects.toThrow('Erro ao buscar receita');
  });
});