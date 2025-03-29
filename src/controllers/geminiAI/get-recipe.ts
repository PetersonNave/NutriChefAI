
import {GoogleGenerativeAI} from "@google/generative-ai"

const clearJson = require("../convert-Json.js")

  // Configura a API do Google Generative AI
  const genAI = new GoogleGenerativeAI("AIzaSyACvNTNOeOaoZJQbvD13vKSP3re2UjKCK4");
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getRecipe(ingredients : string[]) { //recebe uma lista de ingredientes

    // Define o prompt com base nos ingredientes
   
   let prompt = `Crie uma receita culinária para uma pessoa usando os seguintes ingredientes:`;
    for (let i = 0; i < ingredients.length; i++) {
      prompt += ` ${ingredients[i]}`
    }
    
    prompt += `;\n A resposta deve ser formatada como num arquivo JSON, no seguinte modelo:
      {
        "title": "um nome criativo para o prato",
        "ingredients": [
          {"name" : "ingrediente 1", "unit" : "'g' ou 'ml' ", "amount" : number},
          {"name" : "ingrediente 2", "unit" : "'g' ou 'ml' ", "amount" : number},
          {"name" : "ingrediente 3", "unit" : "'g' ou 'ml' ", "amount" : number}, ...
          {"name" : "ingrediente n-2", "unit" : "'g' ou 'ml' ", "amount" : number}",
          {"name" : "ingrediente n-1", "unit" : "'g' ou 'ml' ", "amount" : number},
          {"name" : "ingrediente n", "unit" : "'g' ou 'ml' ", "amount" : number}
        ],
        "preparation": [
            "Passo 1",
            "Passo 2",
            "Passo 3", ...
            "Passo i-2",
            "Passo i-1",
            "Passo i"
          ],
        "harmonizations": [
          {
            "tip": "dica 1 de harmonização para o prato criado",
            "justification": "justificativa para dica 1"
          },
          {
            "tip": "dica 2 de harmonização para o prato criado",
            "justification": "justificativa para dica 2."
          },
        ]
    }

    Onde i<=8 ; n <= 8
    `;
    
    // Aguarda a resposta da API
    const result = await model.generateContent(prompt)
    // transforma resposta em um Json
    const cleanText = clearJson(result.response.text())
   
    return cleanText; 
}




