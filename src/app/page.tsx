"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService/authService";

export default function Home() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        authService.saveToken(data.token); 
        throw new Error(data?.message || "Erro ao fazer login");
      }

      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-orange-600 leading-tight mb-4">
          NutriChefAI
        </h1>
        <p className="text-lg text-gray-700">
          Descubra o poder da nutrição inteligente. Com o NutriChefAI, você recebe receitas personalizadas com base nos seus objetivos, restrições e preferências alimentares. Saúde e sabor lado a lado.
        </p>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Acesse sua conta</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded">
            🍽️ Entrar
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Ainda não tem conta?</span>
          <button
            className="text-orange-600 hover:underline ml-2"
          >
            <Link href="/register" className="text-orange-600 hover:underline ml-2">
              Criar agora
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
