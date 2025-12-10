"use client";
import { FormEditarLocacao } from "@/components/autoral/locacao/formEditarLocacao";
import Link from "next/link";
import { use } from "react";

export default function EditarLocacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="container mx-auto py-10">
        <div className="text-sm text-gray-600 mb-5">
            <Link href="/locacao" className="text-gray-500 hover:text-gray-700">Locação</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#10476E] font-semibold">Editar</span>
        </div>
        <FormEditarLocacao id={id} />
    </div>
  );
}