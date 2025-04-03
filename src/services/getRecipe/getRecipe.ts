export async function getRecipeById(id: number) {
  const res = await fetch(`/api/recipes/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar receita");
  return await res.json();
}