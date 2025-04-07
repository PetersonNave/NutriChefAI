import { getRecipeImage } from '../services/serpAPI/get-image';

describe('getRecipeImage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna 10 imagens quando resposta da API contém 10 resultados', async () => {
    const fakeImages = Array.from({ length: 10 }, (_, i) => ({
      thumbnail: `https://img${i}.jpg`,
    }));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ images_results: fakeImages }),
    });

    const result = await getRecipeImage('bolo de cenoura');
    expect(result).toHaveLength(10);
    expect(result[0]).toBe('https://img0.jpg');
  });

  it('lança erro se o fetch falhar', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(getRecipeImage('pizza')).rejects.toThrow('Network error');
  });

  it('lança erro se a estrutura do retorno for inválida', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(getRecipeImage('feijoada')).rejects.toThrow();
  });
});
