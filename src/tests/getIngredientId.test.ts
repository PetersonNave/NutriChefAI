import { getIngredientId } from '../services/spoonacular/get-id';
import { translate } from '../services/geminiAI/translate';
import { Ingredient } from '../interfaces/Ingredient';

jest.mock('../services/geminiAI/translate');

describe('getIngredientId', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('adiciona o id ao ingrediente quando a API retorna resultado', async () => {
    const mockIngredient: Ingredient = {
      name: 'tomate',
      id: '',
      amount: 1,
      unit: 'un',
    };

    // Mock do translate
    (translate as jest.Mock).mockResolvedValue({ translated: 'tomato' });

    // Mock da API Spoonacular
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ id: 12345 }],
      }),
    });

    await getIngredientId(mockIngredient);

    expect(mockIngredient.id).toBe(12345);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('tomato')
    );
  });

  it('não adiciona id se a API retornar lista vazia', async () => {
    const mockIngredient: Ingredient = {
      name: 'ingrediente-falso',
      id: '',
      amount: 1,
      unit: 'un',
    };

    (translate as jest.Mock).mockResolvedValue({ translated: 'fake-ingredient' });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
      }),
    });

    await getIngredientId(mockIngredient);

    expect(mockIngredient.id).toBe('');
  });

  it('trata erro de resposta da API', async () => {
    const mockIngredient: Ingredient = {
      name: 'cebola',
      id: '',
      amount: 1,
      unit: 'un',
    };

    (translate as jest.Mock).mockResolvedValue({ translated: 'onion' });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getIngredientId(mockIngredient);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Erro:',
      expect.any(Error)
    );
    
    expect(mockIngredient.id).toBe('');

    consoleSpy.mockRestore();
  });
});
