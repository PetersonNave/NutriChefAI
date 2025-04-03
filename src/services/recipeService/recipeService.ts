import { authService } from "../authService/authService";

export async function saveRecipe(recipe: {
  title: string;
  ingredients: any;
  preparation: any;
  harmonizations?: any;
}) {
  const token = authService.getToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Erro ao salvar receita.");
  }

  return await response.json();
}