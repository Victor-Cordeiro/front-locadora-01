"use client";
import { useRouter } from "next/navigation";
import { DataTableDiretor } from "@/components/autoral/diretor/dataTableDiretor";
import { CirclePlus} from "lucide-react";

export default function Diretor() {
  const router = useRouter();

  return (
    <div className="w-full font-sans flex flex-col">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-2 mt-5 ml-5">
        <span className="text-gray-500">Home &gt; </span>
        <span className="text-[#10476E] font-semibold">Diretor</span>
      </div>
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4 bg-[#CCDDE9] p-[30px] rounded-[7px] w-full">
        <h1 className="text-4xl font-bold text-[#005490] ml-5">
          Diretor
        </h1>

        {/* Botão para página de "Novo Diretor" */}
        <button
          onClick={() => router.push("diretor/novoDiretor")}
          className="flex items-center gap-2 bg-[#005490] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#004195] cursor-pointer mr-5"
        >
          <CirclePlus className="mr-2 fill-white stroke-[#1B254F]" />
          Novo Diretor
        </button>
      </div>

      <DataTableDiretor />
    </div>
  );
}
