import { transformIngredient } from '../services/spoonacular/transform-ingredient';


describe('transformIngredient', () => {
  it('transforma uma lista de ingredientes em objetos do tipo Ingredient com IDs fictícios', async () => {
    const input = [
      { name: 'tomate', unit: 'un', amount: 2 },
      { name: 'cebola', unit: 'un', amount: 1 },
    ];

    const result = await transformIngredient(input);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'tomate',
      id: 'id-0',
      amount: 2,
      unit: 'un',
    });
    expect(result[1]).toEqual({
      name: 'cebola',
      id: 'id-1',
      amount: 1,
      unit: 'un',
    });
  });

  it('retorna lista vazia se não houver ingredientes', async () => {
    const result = await transformIngredient([]);
    expect(result).toEqual([]);
  });

  it('gera ids únicos mesmo que os ingredientes tenham nomes repetidos', async () => {
    const input = [
      { name: 'ovo', unit: 'un', amount: 1 },
      { name: 'ovo', unit: 'un', amount: 2 },
    ];

    const result = await transformIngredient(input);

    expect(result[0].id).toBe('id-0');
    expect(result[1].id).toBe('id-1');
    expect(result[0].name).toBe('ovo');
    expect(result[1].name).toBe('ovo');
  });
});
