"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClasseHook } from "@/hooks/classe"; // Importando o hook

export default function FormNovoClasse() {
  const router = useRouter();
  const { criarClasse } = useClasseHook();
  const [nome, setNome] = useState<string>("");
  const [valor, setValor] = useState<string>(""); // Valor será uma string temporariamente, mas vamos convertê-lo para Double
  const [prazoDevolucao, setPrazoDevolucao] = useState<string>(""); // Data será uma string, mas converteremos para o formato adequado
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErro(null);

    try {
      // Mantemos valor como string para corresponder ao tipo ClasseCreate
      const classeData = {
        nome,
        valor: valor, // Mantendo como string
        prazoDevolucao: prazoDevolucao, // A data precisa ser convertida corretamente no backend
      };

      console.log("Dados a serem enviados:", classeData);

      await criarClasse(classeData); // Criando a classe
      router.push("/classe"); // Redireciona para a lista de classes
    } catch {
      setErro("Ocorreu um erro ao salvar a classe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <span className="text-gray-500">Home &gt; Classe &gt; </span>
        <span className="text-[#10476E] font-semibold">Nova Classe</span>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-md">
        {/* Nome da Classe */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome da Classe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          {/* Prazo de Devolução */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Prazo de Devolução <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={prazoDevolucao}
              onChange={(e) => setPrazoDevolucao(e.target.value)}
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
