"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getRecipeById } from "@/services/getRecipeById/getRecipeById";
import Recipe from "@/components/Recipe";
import NutritionTable from "@/components/nutritionTable";
import IMGselector from "@/components/Img-selector";
import { Button } from "@/components/button";
import Layout from "@/layouts/layout";
import IMGRender from "@/components/img-render";

export default function RecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(Number(id));
        console.log(data)
        setRecipe(data);
      } catch (err: any) {
        setError("Erro ao carregar receita");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadRecipe();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-600">Carregando...</p>;
  if (error || !recipe) return <p className="p-6 text-red-600">{error || "Receita não encontrada."}</p>;
  const recipeImageSrc = recipe.images[0].url
  return (
    <Layout>
        <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <Button onClick={() => router.back()} className="mb-4">Voltar</Button>
          <h1 className="text-3xl font-bold text-orange-600 mb-4">{recipe.title}</h1>
          {
            recipeImageSrc && <IMGRender imageSrc={recipe.images[0].url}/>
          }
          <Recipe
            ingredients={recipe.ingredients}
            preparation={[]}
            harmonizations={recipe.harmonizations || []}
          />
        </div>
    </div>    
    </Layout>
  
  );
}
