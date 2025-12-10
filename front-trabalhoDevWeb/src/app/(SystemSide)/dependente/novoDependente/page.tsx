"use client";
import { FormNovoDependente } from "@/components/autoral/dependente/formNovoDependente";
import Link from "next/link";

export default function NovoDependentePage() {
  return (
    <div className="container mx-auto py-10">
        <div className="text-sm text-gray-600 mb-5">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/dependente" className="text-gray-500 hover:text-gray-700">Dependente</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#10476E] font-semibold">Novo Dependente</span>
        </div>
        <FormNovoDependente />
    </div>
  );
}