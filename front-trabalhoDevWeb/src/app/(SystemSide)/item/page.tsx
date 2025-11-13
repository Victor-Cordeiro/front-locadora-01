"use client";
import { DataTableItem } from "@/components/autoral/item/dataTableItem";
import { useItemHook } from "@/hooks/item";
import { Item } from "@/model/item/item";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ItemPage() {
    const { itens, listarItens } = useItemHook();
    const router = useRouter();

    useEffect(() => {
        listarItens();
    }, [listarItens]);

    const columns: ColumnDef<Item>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "numSerie",
            header: "Número de Série",
        },
        {
            accessorKey: "dtAquisicao",
            header: "Data de Aquisição",
            cell: ({ row }) => new Date(row.original.dtAquisicao).toLocaleDateString(),
        },
        {
            accessorKey: "tipoItem",
            header: "Tipo",
        },
    ];

    return (
        <div className="w-full font-sans flex flex-col">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-2 mt-5 ml-5">
                <span className="text-gray-500">Home &gt; </span>
                <span className="text-[#10476E] font-semibold">Item</span>
            </div>
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-4 bg-[#CCDDE9] p-[30px] rounded-[7px] w-full">
                <h1 className="text-4xl font-bold text-[#005490] ml-5">
                    Item
                </h1>

                {/* Botão para página de "Novo Item" */}
                <button
                    onClick={() => router.push("item/novoItem")}
                    className="flex items-center gap-2 bg-[#005490] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#004195] cursor-pointer mr-5"
                >
                    <CirclePlus className="mr-2 fill-white stroke-[#1B254F]" />
                    Novo Item
                </button>
            </div>

            {itens && <DataTableItem columns={columns} data={itens} />}
        </div>
    );
}
