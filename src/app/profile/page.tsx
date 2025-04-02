"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        restrictions: [] as string[],
        favorites: [] as string[],
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
        });

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        const data = await res.json();

        setForm({
          name: data.name || "",
          email: data.email || "",
          restrictions: data.restrictions?.map((r: any) => r.value) || [],
          favorites: data.favorites?.map((f: any) => f.value) || [],
        });

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setMessage("Erro ao carregar informações do usuário.");
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "restrictions" | "favorites", index: number) => {
    const newValues = [...form[field]];
    newValues[index] = e.target.value;
    setForm((prev) => ({ ...prev, [field]: newValues }));
  };

  const addArrayItem = (field: "restrictions" | "favorites") => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao atualizar perfil");
      }

      setMessage("Informações atualizadas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      setMessage(error.message || "Erro ao salvar");
    }
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-600">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-orange-600 mb-6">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restrições Alimentares</label>
            {form.restrictions.map((r, i) => (
              <Input
                key={i}
                value={r}
                onChange={(e) => handleArrayChange(e, "restrictions", i)}
                placeholder={`Restrição ${i + 1}`}
                className="mb-2"
              />
            ))}
            <Button type="button" onClick={() => addArrayItem("restrictions")} className="mt-1 text-sm">
              + Adicionar restrição
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferências</label>
            {form.favorites.map((f, i) => (
              <Input
                key={i}
                value={f}
                onChange={(e) => handleArrayChange(e, "favorites", i)}
                placeholder={`Preferência ${i + 1}`}
                className="mb-2"
              />
            ))}
            <Button type="button" onClick={() => addArrayItem("favorites")} className="mt-1 text-sm">
              + Adicionar preferência
            </Button>
          </div>

          <Button type="submit" className="w-full">Salvar alterações</Button>
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm text-orange-600 hover:underline flex items-center gap-1"
            >
            <ArrowLeft className="h-4 w-4" />
            Voltar
            </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}