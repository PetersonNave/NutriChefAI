import { getNutrition } from '../services/spoonacular/get-nutrients';
import { getIngredientId } from '../services/spoonacular/get-id';
import { transformIngredient } from '../services/spoonacular/transform-ingredient';

jest.mock('../services/spoonacular/get-id');
jest.mock('../services/spoonacular/transform-ingredient');

describe('getNutrition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const mockIngredients = [
    { name: 'arroz', unit: 'g', amount: 100 },
  ];

  const transformedIngredients = [
    { name: 'arroz', id: '123', unit: 'g', amount: 100 },
  ];

  it('retorna nutrientes corretamente (caso normal)', async () => {
    (transformIngredient as jest.Mock).mockResolvedValue(transformedIngredients);
    (getIngredientId as jest.Mock).mockResolvedValue(undefined);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 130 },
            { name: 'Carbohydrates', amount: 28 },
            { name: 'Fat', amount: 0.5 },
            { name: 'Protein', amount: 2.5 },
          ]
        }
      }),
    });

    const result = await getNutrition(mockIngredients);

    expect(result[0].cal).toBe(130);
    expect(result[0].carb).toBe(28);
    expect(result[0].fat).toBe(0.5);
    expect(result[0].ptn).toBe(2.5);
  });

  it('retorna 0 para nutrientes se API retornar 404 (caso extremo)', async () => {
    (transformIngredient as jest.Mock).mockResolvedValue(transformedIngredients);
    (getIngredientId as jest.Mock).mockResolvedValue(undefined);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await getNutrition(mockIngredients);

    expect(result[0].cal).toBe(0);
    expect(result[0].carb).toBe(0);
    expect(result[0].fat).toBe(0);
    expect(result[0].ptn).toBe(0);
  });

  it('retorna -1 para nutrientes em caso de erro na API (caso inválido)', async () => {
    (transformIngredient as jest.Mock).mockResolvedValue(transformedIngredients);
    (getIngredientId as jest.Mock).mockResolvedValue(undefined);
  
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Erro de rede'));
  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const result = await getNutrition(mockIngredients);
  
    // Espera os valores padrão (-1)
    expect(result[0].cal).toBe(-1);
    expect(result[0].carb).toBe(-1);
    expect(result[0].fat).toBe(-1);
    expect(result[0].ptn).toBe(-1);
  
    expect(consoleSpy).toHaveBeenCalledWith('Erro:', expect.any(Error));
    consoleSpy.mockRestore();
  });
  
});
