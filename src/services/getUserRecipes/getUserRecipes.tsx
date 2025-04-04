export async function getUserRecipes(): Promise<{ id: number; title: string }[]> {
  try {
    const res = await fetch("/api/recipes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar receitas");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro no getUserRecipes:", error);
    return [];
  }
}