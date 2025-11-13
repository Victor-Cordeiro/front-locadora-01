"use client";
import { use } from "react";
import { FormEditarTitulo } from "@/components/autoral/titulo/formEditarTitulo";
import Link from "next/link";

interface EditarTituloPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarTituloPage({ params }: EditarTituloPageProps) {
  const { id } = use(params);
  return (
    <div className="container mx-auto py-10">
      <div className="text-sm text-gray-600 mb-5">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/titulo" className="text-gray-500 hover:text-gray-700">
          Título
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-[#10476E] font-semibold">Editar Título</span>
      </div>
      <FormEditarTitulo id={id} />
    </div>
  );
}
