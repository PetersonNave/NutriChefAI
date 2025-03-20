import { Ingredient } from "../../interfaces/Ingredient";


// Função que recebe uma lista de objetos representando o ingrediente com nome, unidade de medida e quantidade; retorna este mesmo objeto porém como pertencente à interface Ingredient 
export async function transformIngredient(ingredients: {name : string, unit : string, amount : number}[]) {

    const newIngredients: Ingredient[] = ingredients.map((ingredient, index) => ({
        name: ingredient.name,
        id: `id-${index}`,  // ID fictício 
        amount: ingredient.amount,           
        unit: ingredient.unit,        
    }));

    return newIngredients;// retorna uma lista de objetos da interface Ingredient, agora possuem um ID
}