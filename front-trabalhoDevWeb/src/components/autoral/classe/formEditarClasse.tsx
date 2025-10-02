"use client";
import { useState, useEffect } from "react";
import { useClasseHook } from "@/hooks/classe";
import { useRouter } from "next/navigation";

interface FormEditarClasseProps {
  classeId: string; // ID da classe a ser editada
}

export function FormEditarClasse({ classeId }: FormEditarClasseProps) {
  const router = useRouter();
  const { classe, editarClasse, buscarClassePorId } = useClasseHook();

  const [nome, setNome] = useState<string>("");
  const [valor, setValor] = useState<string>(""); // Valor será uma string temporariamente, mas vamos convertê-lo para Double
  const [prazoDevolucao, setPrazoDevolucao] = useState<string>(""); // Prazo de devolução será uma string, mas será convertido para o formato adequado no backend
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar os dados da classe ao inicializar
  useEffect(() => {
    const fetchClasse = async () => {
      if (classeId) {
        const data = await buscarClassePorId(Number(classeId)); // Buscar a classe pelo ID
        setNome(data?.nome || "");
        setValor(data?.valor.toString() || ""); // Convertendo o valor para string
        setPrazoDevolucao(data?.prazoDevolucao || "");
      }
    };

    fetchClasse();
  }, [classeId]);

  // Função para salvar alterações
  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErro(null);

    try {
      const classeAtualizada = {
        id: Number(classeId), // ID da classe
        nome,
        valor: valor, // Mantendo como string
        prazoDevolucao: prazoDevolucao, // Prazo de devolução como string
      };

      await editarClasse(classeAtualizada); // Envia a requisição de edição
      router.push("/classe"); // Redireciona para a lista de classes
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
        <span className="text-gray-500">Home &gt; Classe &gt; </span>
        <span className="text-[#10476E] font-semibold">Editar Classe</span>
      </div>

      {/* Formulário de Edição */}
      <div className="bg-white p-6 rounded-md">
        {/* Nome da Classe */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome da Classe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={nome}
              onChange={(e) => setNome(e.target.value)} // Atualiza o nome
            />
          </div>

          {/* Valor da Classe */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Valor <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-md p-2"
              value={valor}
              onChange={(e) => setValor(e.target.value)} // Atualiza o valor
            />
          </div>

          {/* Prazo de Devolução */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Prazo de Devolução <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2"
              value={prazoDevolucao}
              onChange={(e) => setPrazoDevolucao(e.target.value)} // Atualiza o prazo de devolução
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
          onClick={() => router.push("/classe")}
          className="bg-gray-400 text-white px-6 py-2 rounded-md shadow"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
