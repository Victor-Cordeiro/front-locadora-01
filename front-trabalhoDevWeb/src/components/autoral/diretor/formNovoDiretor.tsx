"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDiretorHook } from "@/hooks/diretor"; // Importando o hook

export default function FormNovoDiretor() {
  const router = useRouter();
  const { criarDiretor } = useDiretorHook(); // Usando o hook para criar diretor
  const [nome, setNome] = useState<string>("");  // Campo do nome
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErro(null);

    try {
      await criarDiretor({ nome });
      router.push("/diretor"); // Redireciona para a lista de diretores
    } catch (err) {
      setErro("Ocorreu um erro ao salvar o diretor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <span className="text-gray-500">Home &gt; Diretor &gt; </span>
        <span className="text-[#10476E] font-semibold">Novo Diretor</span>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-md">
        {/* Nome do Diretor */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome do Diretor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Exibindo mensagem de erro, se houver */}
      {erro && <div className="text-red-500 mt-2">{erro}</div>}

      {/* Botões */}
      <div className="flex justify-end gap-3 mb-6 mt-19">
        <button
          onClick={handleSubmit}
          className="bg-[#10476E] text-white px-6 py-2 rounded-md shadow"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
        <button
          onClick={() => router.push("/diretor")}
          className="bg-gray-400 text-white px-6 py-2 rounded-md shadow"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
