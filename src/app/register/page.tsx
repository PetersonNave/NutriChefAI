"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    restrictions: [""],
    favorites: [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleListChange = (e: React.ChangeEvent<HTMLInputElement>, type: "restrictions" | "favorites", index: number) => {
    const updated = [...form[type]];
    updated[index] = e.target.value;
    setForm({ ...form, [type]: updated });
  };

  const addField = (type: "restrictions" | "favorites") => {
    setForm({ ...form, [type]: [...form[type], ""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao cadastrar");

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8">NutriChefAI</h1>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Criar Conta
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700">Restrições alimentares</label>
            {form.restrictions.map((item, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Restrição ${idx + 1}`}
                value={item}
                onChange={(e) => handleListChange(e, "restrictions", idx)}
                className="mt-1 mb-2 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ))}
            <button type="button" onClick={() => addField("restrictions")} className="text-orange-600 text-sm hover:underline">
              + Adicionar restrição
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Pratos favoritos</label>
            {form.favorites.map((item, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Prato ${idx + 1}`}
                value={item}
                onChange={(e) => handleListChange(e, "favorites", idx)}
                className="mt-1 mb-2 border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ))}
            <button type="button" onClick={() => addField("favorites")} className="text-orange-600 text-sm hover:underline">
              + Adicionar prato favorito
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}