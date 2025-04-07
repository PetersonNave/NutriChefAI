import { getRecipe } from '../services/geminiAI/get-recipe';
import prisma from '../lib/prisma';

// Mock da API Gemini
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => `
              {
                "title": "Receita Aleatória",
                "ingredients": [
                  { "name": "tomate", "unit": "un", "amount": 2 }
                ],
                "preparation": ["Corte os tomates.", "Refogue com azeite."],
                "harmonizations": [
                  {
                    "tip": "Sirva com vinho tinto",
                    "justification": "Realça o sabor do tomate"
                  }
                ]
              }
            `
          }
        })
      })
    }))
  };
});

// Mock do clearJson
jest.mock('../services/convert-Json.js', () => (text: string) => JSON.parse(text));

describe('getRecipe', () => {
    beforeAll(async () => {
        await prisma.ingredient.deleteMany();
        await prisma.preparationStep.deleteMany();
        await prisma.harmonization.deleteMany();
        await prisma.image.deleteMany();
        await prisma.recipe.deleteMany();

        await prisma.restriction.deleteMany();
        await prisma.favorite.deleteMany();

        await prisma.user.deleteMany();
      
        await prisma.user.create({
          data: {
            name: 'Gemini Tester',
            email: 'gemini@test.com',
            password: '$2a$10$hashedpass123'
          }
        });
      });
      

  it('retorna uma receita válida com ingredientes fornecidos', async () => {
    const recipe = await getRecipe(['tomate', 'cebola']);
    expect(recipe).toHaveProperty('title');
    expect(recipe.ingredients).toBeInstanceOf(Array);
    expect(recipe.ingredients.length).toBeGreaterThan(0);
    expect(recipe.preparation).toBeInstanceOf(Array);
    expect(recipe.harmonizations).toBeInstanceOf(Array);
  });

  it('retorna uma receita aleatória se não adicionar ingredientes', async () => {
    const recipe = await getRecipe([]);
    expect(recipe).toHaveProperty('title');
    expect(recipe.ingredients).toBeInstanceOf(Array);
    expect(recipe.ingredients.length).toBeGreaterThan(0);
  });

  it('respeita o limite máximo de 8 ingredientes', async () => {
    const ingredients = Array.from({ length: 20 }, (_, i) => `ingrediente${i + 1}`);
    const recipe = await getRecipe(ingredients);
    expect(recipe.ingredients.length).toBeLessThanOrEqual(8);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
