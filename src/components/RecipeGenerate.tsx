import React, { useState } from "react";

import  '../Styles/RecipeGenerate.css';

import {getRecipe} from '../scripts/geminiAI.js';
import {transformIngredient, getIngredientId} from '../scripts/spoonacular'
import Recipe from "./Recipe";


export default function RecipeGenerate() {
  const [geminiAI, setGeminiAI] = useState <any | null>(null);
  const [userIngredientes, setUserIngredientes] = useState(""); // Para capturar o valor do input

  getIngredientId("tomato");
  
  // Função chamada ao clicar no botão
  const handleGenerate = async () => {
    const listUserIngredients = userIngredientes.split(';')
    

    try {
        const response = await getRecipe(listUserIngredients);
        let ingredients = transformIngredient(response.ingredients)
        console.log("resposta:" , response);
        setGeminiAI(response);
        
    } catch (error) {
        console.error("Erro ao gerar a receita:", error);
        <>
        deu errado
        </>
    }
  };

  return (
    <div className="generateRecipe">
      <div className="inputGenerate">
        {/* Campo de input */}
            <input className="input"
            value={userIngredientes}
            onChange={(e) => setUserIngredientes(e.target.value)} // Atualiza o estado em tempo real
            placeholder="Digite os ingredientes separados por ';'"
            type="text"
            />
            {userIngredientes && (<button className="button" onClick={handleGenerate}>Gerar minha receita</button>)}
            
      </div>
      
      
      {/* Renderiza receita se geminiAI existir */}
      {geminiAI ? (
        <div className="notebook">  
          <div className="recipeContent">
            <div className="recipe-top">
              <h1>{geminiAI.title}</h1>
              <div className="img-content">IMAGEM GERADA</div>
            </div>
            <div className="text-content">
           
              <Recipe  ingredients={geminiAI.ingredients} preparation={geminiAI.preparation} harmonizations={geminiAI.harmonizations}/>
            </div>
                    
          </div>                  
        </div>
                ) : null}
    </div>
  );
}