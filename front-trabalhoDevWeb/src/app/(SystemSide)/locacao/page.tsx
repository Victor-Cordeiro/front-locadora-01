"use client";
import { useRouter } from "next/navigation";
import { DataTableLocacao } from "@/components/autoral/locacao/dataTableLocacao";
import { DialogDevolucao } from "@/components/autoral/locacao/dialogDevolucao";
import { CirclePlus } from "lucide-react";

export default function LocacaoPage() {
  const router = useRouter();
  return (
    <div className="w-full font-sans flex flex-col">
      <div className="text-sm text-gray-600 mb-2 mt-5 ml-5">
        <span className="text-gray-500">Home &gt; </span>
        <span className="text-[#10476E] font-semibold">Locação</span>
      </div>
      <div className="flex justify-between items-center mb-4 bg-[#CCDDE9] p-[30px] rounded-[7px] w-full">
        <h1 className="text-4xl font-bold text-[#005490] ml-5">Controle de Locações</h1>
        <div className="flex gap-3 mr-5">
            {/* Botão de Devolução */}
            <DialogDevolucao />
            
            {/* Botão Nova Locação */}
            <button onClick={() => router.push("locacao/novaLocacao")} className="flex items-center gap-2 bg-[#005490] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#004195] cursor-pointer">
                <CirclePlus className="mr-2 fill-white stroke-[#1B254F]" /> Nova Locação
            </button>
        </div>
      </div>
      <DataTableLocacao />
    </div>
  );
}