"use client";
import { FormNovoTitulo } from "@/components/autoral/titulo/formNovoTitulo";

export default function NovoTituloPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Novo Título</h1>
      <FormNovoTitulo />
    </div>
  );
}
