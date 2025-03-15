import { Ingredient } from "../../interfaces/Ingredient";
import { translate } from "../geminiAI/translate";



const API_KEY = "b42bbd255cbf4135a62e811ad72dc9b0"; // fazer variável de ambiente


// Recebe um objeto do tipo Ingredient e adiciona à sua propriedade "id" seu respectivo id na API spoonancular
export async function getIngredientId(ingredient: Ingredient) {

    let ingridentInEnglish = await translate(ingredient.name);
    
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${ingridentInEnglish.translated}&number=1&apiKey=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      
      const data = await response.json();

      if (data.results.length > 0) {
        ingredient.id = data.results[0].id;
      
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }
  

  