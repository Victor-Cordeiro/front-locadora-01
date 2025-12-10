"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClasseHook } from "@/hooks/classe";
import toast from "react-hot-toast"; // Adicionando feedback visual

export default function FormNovoClasse() {
  const router = useRouter();
  const { criarClasse } = useClasseHook();
  
  const [nome, setNome] = useState<string>("");
  const [valor, setValor] = useState<string>(""); 
  const [prazoDevolucao, setPrazoDevolucao] = useState<string>(""); 
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    // Validações básicas
    if (!nome.trim()) {
        toast.error("O nome é obrigatório.");
        return;
    }
    
    // Validação do Prazo (Não pode ser negativo)
    const prazo = Number(prazoDevolucao);
    if (!prazoDevolucao || isNaN(prazo) || prazo < 0) {
        toast.error("O prazo de devolução deve ser um número válido e não negativo.");
        return;
    }

    setLoading(true);

    try {
      const classeData = {
        nome,
        valor: Number(valor), 
        prazoDevolucao: prazo,
      };

      await criarClasse(classeData);
      // Redirecionamento já acontece geralmente após o sucesso ou aqui
      router.push("/classe"); 
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a classe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white">
      <div className="text-sm text-gray-600 mb-4">
        <span className="text-gray-500">Home &gt; Classe &gt; </span>
        <span className="text-[#10476E] font-semibold">Nova Classe</span>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome da Classe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Lançamento"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#10476E] focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#10476E] focus:outline-none"
              value={valor}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0 || e.target.value === "") {
                    setValor(e.target.value);
                }
              }}
            />
          </div>

          {/* Prazo de Devolução - AJUSTADO */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Prazo Devolução (Dias) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ex: 2"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#10476E] focus:outline-none"
              value={prazoDevolucao}
              onChange={(e) => {
                // Impede inserção manual de negativos
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0 || e.target.value === "") {
                    setPrazoDevolucao(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                // Previne digitar o sinal de menos
                if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Informe a quantidade de dias para devolução.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => router.push("/classe")}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#10476E] text-white px-6 py-2 rounded-md shadow hover:bg-[#0e3b5b] transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}