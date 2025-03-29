"use client";

import { useState } from "react";
import { Button } from "@/components/button";

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-orange-600 leading-tight mb-4">
          NutriChefAI
        </h1>
        <p className="text-lg text-gray-700">
          Descubra o poder da nutrição inteligente. Com o NutriChefAI, você recebe receitas personalizadas com base nos seus objetivos, restrições e preferências alimentares. Saúde e sabor lado a lado.
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Acesse sua conta</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            placeholder="Senha"
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
            onClick={() => setShowRegister(true)}
            className="text-orange-600 hover:underline ml-2"
          >
            Criar agora
          </button>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Criar Conta</h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded">
                🥗 Cadastrar
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
