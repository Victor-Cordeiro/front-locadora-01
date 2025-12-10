"use client";
import { FormEditarDependente } from "@/components/autoral/dependente/formEditarDependente";
import Link from "next/link";
import { use } from "react";

export default function EditarDependentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="container mx-auto py-10">
        <div className="text-sm text-gray-600 mb-5">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/dependente" className="text-gray-500 hover:text-gray-700">Dependente</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#10476E] font-semibold">Editar Dependente</span>
        </div>
        <FormEditarDependente id={id} />
    </div>
  );
}