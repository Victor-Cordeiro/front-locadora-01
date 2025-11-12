"use client";
import { FormEditarTitulo } from "@/components/autoral/titulo/formEditarTitulo";

interface Params {
  id: string;
}

export default function EditarTituloPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Editar Título</h1>
      <FormEditarTitulo id={id} />
    </div>
  );
}
