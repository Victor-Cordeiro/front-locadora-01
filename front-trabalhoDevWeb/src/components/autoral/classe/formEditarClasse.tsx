"use client";
import { useState, useEffect } from "react";
import { useClasseHook } from "@/hooks/classe";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormEditarClasseProps {
  classeId: string;
}

export function FormEditarClasse({ classeId }: FormEditarClasseProps) {
  const router = useRouter();
  const { editarClasse, buscarClassePorId } = useClasseHook();

  const [nome, setNome] = useState<string>("");
  const [valor, setValor] = useState<string>(""); 
  const [prazoDevolucao, setPrazoDevolucao] = useState<string>(""); 
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasse = async () => {
      if (classeId) {
        try {
            const data = await buscarClassePorId(Number(classeId));
            if (data) {
                setNome(data.nome);
                setValor(data.valor.toString());
                // Garante que o prazo venha como string para o input
                setPrazoDevolucao(data.prazoDevolucao.toString()); 
            }
        } catch (error) {
            console.error("Erro ao carregar classe", error);
            toast.error("Erro ao carregar dados da classe.");
        }
      }
    };
    fetchClasse();
  }, [classeId, buscarClassePorId]);

  const handleSubmit = async () => {
    if (loading) return;

    const prazo = Number(prazoDevolucao);
    if (!prazoDevolucao || isNaN(prazo) || prazo < 0) {
        toast.error("O prazo de devolução deve ser um número válido e não negativo.");
        return;
    }

    setLoading(true);

    try {
      const classeAtualizada = {
        id: Number(classeId),
        nome,
        valor: Number(valor),
        prazoDevolucao: prazo,
      };

      await editarClasse(classeAtualizada);
      router.push("/classe");
    } catch {
      toast.error("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white">
      <div className="text-sm text-gray-600 mb-4">
        <span className="text-gray-500">Home &gt; Classe &gt; </span>
        <span className="text-[#10476E] font-semibold">Editar Classe</span>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome da Classe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#10476E] focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
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

          {/* Prazo de Devolução - CORRIGIDO PARA NUMBER */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Prazo Devolução (Dias) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#10476E] focus:outline-none"
              value={prazoDevolucao}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 0 || e.target.value === "") {
                    setPrazoDevolucao(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                }
              }}
            />
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