"use client";
import { FormEditarSocio } from "@/components/autoral/socio/formEditarSocio";
import Link from "next/link";
import { use } from "react";

export default function EditarSocioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="container mx-auto py-10">
        {/* Breadcrumb ... */}
        <h1 className="text-2xl font-bold mb-6 text-[#10476E]">Editar Sócio</h1>
        <FormEditarSocio id={id} />
    </div>
  );
}