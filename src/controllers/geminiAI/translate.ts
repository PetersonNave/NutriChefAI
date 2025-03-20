import { clearJson } from "../convert-Json";
import { model } from "./get-recipe";


export async function translate(ingredient : string){
    let prompt = ` 
      Traduza do português brasileiro para o inglês o seguinte ingrediente culinário: ${ingredient};
  
      Sua resposta deve apresentar apenas um resultado, num formato JSON: {"translated": "response_string"}
    `;
  
    const result = await model.generateContent(prompt)
    const cleanText = clearJson(result.response.text())
  
    return cleanText;
  }