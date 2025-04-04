"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import '../styles/RecipeGenerate.css';

import { getRecipe } from '@/services/geminiAI/get-recipe';
import { getNutrition } from "@/services/spoonacular/get-nutrients";
import { getRecipeImage } from "@/services/serpAPI/get-image";

import Recipe from "./Recipe";
import NutritionTable from "./nutritionTable";
import IMGselector from "./Img-selector";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Send } from "lucide-react";
import { saveRecipe } from "@/services/recipeService/recipeService";
import { authService } from "@/services/authService/authService";

type Message = {
  role: string;
  text: string;
  geminiAI: any;
  nutrition: any;
  images: any;
};

export default function RecipeGenerate() {
  const router = useRouter();
  const [userIngredientes, setUserIngredientes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Olá! 👋 Eu sou o assistente de receitas. Envie os ingredientes que você tem disponíveis separados por ponto e vírgula (;). Ex: farinha; açúcar; leite",
      geminiAI: null,
      nutrition: null,
      images: null,
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = authService.getToken();
        if (!res) throw new Error("Not authenticated");
      } catch (err) {
        router.push("/");
      }
    }

    checkAuth();
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGenerate = async () => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userIngredientes, geminiAI: null, nutrition: null, images: null },
    ]);

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "Aguarde enquanto a receita é gerada...", geminiAI: null, nutrition: null, images: null },
    ]);

    const listUserIngredients = userIngredientes.split(';');
    try {
      const response = await getRecipe(listUserIngredients);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Hmmmm... Estamos preparando uma bela receita de "${response.title}" para você!!!`,
          geminiAI: null,
          nutrition: null,
          images: null,
        },
      ]);
      const nutrition = await getNutrition(response.ingredients);
      const images = await getRecipeImage(response.title);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Aqui está! Aproveite!!!`,
          geminiAI: null,
          nutrition: null,
          images: null,
        },
      ]);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: userIngredientes,
          geminiAI: response,
          nutrition: nutrition,
          images: images,
        },
      ]);

      console.log({
        role: "bot",
        text: userIngredientes,
        geminiAI: response,
        nutrition: nutrition,
        images: images,
      })

      setUserIngredientes("");
    } catch (error) {
      console.error("Erro ao gerar a receita:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange to-white flex flex-col">
      <div className="flex-1 flex justify-center px-4 py-4">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex fade-in-chat  ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl p-4 max-w-[75%] whitespace-pre-line text-sm md:text-base ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 shadow-lg "
                  }`}
                >
                  {msg.role === "bot" && msg.geminiAI && msg.nutrition && msg.images ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{msg.geminiAI.title}</h2>
                      <IMGselector selectedImage={selectedImage} setSelectedImage={setSelectedImage} imagesURLs={msg.images} />
                      <Recipe
                        ingredients={msg.geminiAI.ingredients}
                        preparation={msg.geminiAI.preparation}
                        harmonizations={msg.geminiAI.harmonizations}
                      />
                      <NutritionTable nutritionData={msg.nutrition} />
                      <Button
                        className="mt-4"
                        onClick={async () => {
                          try {
                            await saveRecipe({
                              title: msg.geminiAI.title,
                              ingredients: msg.geminiAI.ingredients,
                              preparation: msg.geminiAI.preparation,
                              harmonizations: msg.geminiAI.harmonizations,
                              images: selectedImage ? [selectedImage] : [messages[Number(index)].images[0]]
                            });
                            alert("Receita salva com sucesso!");
                            window.location.reload();
                          } catch (error: any) {
                            console.error("Erro ao salvar receita:", error);
                            alert(error.message || "Erro ao salvar receita.");
                          }
                        }}
                      >
                        Salvar Receita
                      </Button>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t p-4 flex gap-2">
            <Input
              value={userIngredientes}
              onChange={(e) => setUserIngredientes(e.target.value)}
              placeholder="Ex: tomate; alho; macarrão; azeite"
              className="flex-1 text-sm md:text-base"
            />
            <Button onClick={handleGenerate} className="shrink-0 px-4">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}