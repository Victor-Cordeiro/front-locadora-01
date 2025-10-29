"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtorHook } from "@/hooks/ator"; // Hook para manipulação de dados de ator

interface FormEditarAtorProps {
  atorId: string; // ID do ator que será editado
}

export function FormEditarAtor({ atorId }: FormEditarAtorProps) {
  const router = useRouter();
  const { ator, editarAtor, buscarAtorPorId } = useAtorHook(); // Hook para editar ator (inclui buscarAtorPorId)
  const [nome, setNome] = useState<string>(""); // Estado para armazenar o nome do ator
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Buscar dados do ator para preencher o formulário
  useEffect(() => {
    const fetchAtor = async () => {
      if (!atorId) return;

      // If the current ator in state is not the one we want, fetch it.
      if (!ator || ator.id !== Number(atorId)) {
        await buscarAtorPorId(Number(atorId));
        return;
      }

      // If we already have the actor, populate the form
      setNome(ator?.nome || "");
    };

    fetchAtor();
  }, [atorId, ator, buscarAtorPorId]);

  // Função para salvar as alterações
  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErro(null);

    try {
      await editarAtor({ id: Number(atorId), nome }); // Enviar a requisição de edição
      router.push("/ator"); // Redirecionar para a lista de atores
    } catch (error) {
      setErro("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <span className="text-gray-500">Home &gt; Ator &gt; </span>
        <span className="text-[#10476E] font-semibold">Editar Ator</span>
      </div>

      {/* Formulário de Edição */}
      <div className="bg-white p-6 rounded-md">
        {/* Nome do Ator */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome do Ator <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)} // Atualiza o nome no estado
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
          onClick={() => router.push("/ator")}
          className="bg-gray-400 text-white px-6 py-2 rounded-md shadow"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}


