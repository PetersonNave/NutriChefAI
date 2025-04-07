import { saveRecipe } from '../services/recipeService/recipeService';
import { authService } from '../services/authService/authService';

jest.mock('../services/authService/authService');

describe('saveRecipe', () => {
  const mockRecipe = {
    title: 'Pizza Teste',
    ingredients: [{ name: 'Queijo', amount: 200, unit: 'g' }],
    preparation: ['Misture tudo', 'Asse por 20 minutos'],
    harmonizations: [{ tip: 'Sirva com vinho' }],
    images: [],
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('salva a receita com token válido (caso normal)', async () => {
    (authService.getToken as jest.Mock).mockReturnValue('fake-token');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, id: 1 }),
    });

    const result = await saveRecipe(mockRecipe);
    expect(result).toEqual({ success: true, id: 1 });

    expect(fetch).toHaveBeenCalledWith('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
      body: JSON.stringify(mockRecipe),
    });
  });

  it('lança erro se usuário não estiver autenticado (sem token)', async () => {
    (authService.getToken as jest.Mock).mockReturnValue(null);

    await expect(saveRecipe(mockRecipe)).rejects.toThrow('Usuário não autenticado.');
  });

  it('lança erro se a API retornar erro (ex: 400 ou 500)', async () => {
    (authService.getToken as jest.Mock).mockReturnValue('fake-token');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Erro de validação' }),
    });

    await expect(saveRecipe(mockRecipe)).rejects.toThrow('Erro de validação');
  });

  it('lança erro genérico se a API falhar sem mensagem', async () => {
    (authService.getToken as jest.Mock).mockReturnValue('fake-token');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(saveRecipe(mockRecipe)).rejects.toThrow('Erro ao salvar receita.');
  });
});
