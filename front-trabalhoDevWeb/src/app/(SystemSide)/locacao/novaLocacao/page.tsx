"use client";
import { FormNovaLocacao } from "@/components/autoral/locacao/formNovaLocacao";
import Link from "next/link";

export default function NovaLocacaoPage() {
  return (
    <div className="container mx-auto py-10">
        <div className="text-sm text-gray-600 mb-5">
            <Link href="/locacao" className="text-gray-500 hover:text-gray-700">Locação</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#10476E] font-semibold">Nova</span>
        </div>
        <FormNovaLocacao />
    </div>
  );
}