"use client";
import { FormNovoSocio } from "@/components/autoral/socio/formNovoSocio";
import Link from "next/link";

export default function NovoSocioPage() {
  return (
    <div className="container mx-auto py-10">
        {/* Breadcrumb ... */}
        <h1 className="text-2xl font-bold mb-6 text-[#10476E]">Cadastro de Sócio</h1>
        <FormNovoSocio />
    </div>
  );
}