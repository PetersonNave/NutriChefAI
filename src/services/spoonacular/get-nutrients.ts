import { NutrientAPI } from "../../interfaces/NutrientAPI";
import { getIngredientId } from "./get-id";
import { transformIngredient } from "./transform-ingredient";

const API_KEY = "b42bbd255cbf4135a62e811ad72dc9b0"; // fazer variável de ambiente

// Recebe a lista de ingredientes gerada pela GeminiAI, retorna lista de objetos do tipo Ingredient com todas informações nutricionais
export async function getNutrition(ingredients: {name : string, unit : string, amount : number}[]) {
  
  let newingredients = await transformIngredient(ingredients);

  await Promise.all(newingredients.map( 
      async (ingredient) => await getIngredientId(ingredient)
    ));
  

    await Promise.all(
      newingredients.map(async (ingredient) => {
        const url = `https://api.spoonacular.com/food/ingredients/${ingredient.id}/information?amount=${ingredient.amount}&unit=${ingredient.unit}&apiKey=${API_KEY}`;
    
        try {
          const response = await fetch(url);
    
          if (!response.ok) {
            if (response.status === 404) {
              ingredient.cal = 0;
              ingredient.carb = 0;
              ingredient.fat = 0;
              ingredient.ptn = 0;
              return ingredient;
            } 
            throw new Error(`Erro na requisição: ${response.status}`);
          }
    
          const data = await response.json();
          
    
          const nutrients = data.nutrition?.nutrients ?? [];
    
          ingredient.cal = nutrients.find((n: NutrientAPI)  => n.name === "Calories")?.amount ?? -1;
          ingredient.carb = nutrients.find((n: NutrientAPI) => n.name === "Carbohydrates")?.amount ?? -1;
          ingredient.fat = nutrients.find((n: NutrientAPI) => n.name === "Fat")?.amount ?? -1;
          ingredient.ptn = nutrients.find((n: NutrientAPI)  => n.name === "Protein")?.amount ?? -1;
    
        } catch (error) {
            console.error("Erro:", error);
            ingredient.cal = -1;
            ingredient.carb = -1;
            ingredient.fat = -1;
            ingredient.ptn = -1;
          }
        
    
        return ingredient;
      })
    );
    
    return newingredients;
    
}

