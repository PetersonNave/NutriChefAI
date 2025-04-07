const mockGenerateContent = jest.fn();

// Mock do modelo Gemini
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent
    })
  }))
}));

// Mock do clearJson
jest.mock('../services/convert-Json.js', () => (text: string) => JSON.parse(text));

import { translate } from '../services/geminiAI/translate';

describe('translate', () => {
  beforeEach(() => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => `{"translated": "tomato"}`
      }
    });
    jest.clearAllMocks();
  });

  it('traduz corretamente um ingrediente simples', async () => {
    const result = await translate('tomate');
    expect(result).toHaveProperty('translated');
    expect(result.translated).toBe('tomato');
  });

  it('chama o model com o prompt correto', async () => {
    await translate('alho');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const promptArg = mockGenerateContent.mock.calls[0][0];
    expect(promptArg).toContain('alho');
    expect(promptArg).toContain('Traduza do português brasileiro para o inglês');
  });
});