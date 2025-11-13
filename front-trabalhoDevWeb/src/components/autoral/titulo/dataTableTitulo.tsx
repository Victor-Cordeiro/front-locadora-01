"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useTituloHook } from "@/hooks/titulo";
import { FilePen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DialogVerTitulo } from "@/components/autoral/titulo/DialogVerTitulo";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialogExcluir } from "./alertDialogExcluir";

export function DataTableTitulo() {
  const { titulos, listarTitulos, deletarTitulo } = useTituloHook();
  const [search, setSearch] = React.useState<string>("");
  const router = useRouter();

  React.useEffect(() => {
    listarTitulos();
  }, [listarTitulos]);

  const filteredTitulos = titulos?.filter((titulo) =>
    titulo.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deletarTitulo(Number(id));
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  return (
    <div className="w-full px-6">
      <div className="flex items-center py-6">
        <Input
          placeholder="Pesquisar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        {titulos === null ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Nome do Título</TableHead>
                <TableHead className="text-center">Ano</TableHead>
                <TableHead className="text-center">Sinopse</TableHead>
                <TableHead className="text-center">Categoria</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTitulos?.length ? (
                filteredTitulos.map((titulo) => (
                  <TableRow key={titulo.id}>
                    <TableCell className="text-center">{titulo.id}</TableCell>
                    <TableCell className="text-center">{titulo.nome}</TableCell>
                    <TableCell className="text-center">{titulo.ano}</TableCell>
                    <TableCell className="text-center">{titulo.sinopse}</TableCell>
                    <TableCell className="text-center">{titulo.categoria}</TableCell>
                    <TableCell className="flex items-center justify-center space-x-2">
                      <Pencil
                        className="cursor-pointer text-blue-500"
                        style={{ width: 20, height: 20 }}
                        onClick={() => router.push(`/titulo/editarTitulo/${titulo.id}`)}
                      />
                      <AlertDialogExcluir id={String(titulo.id)} onDelete={handleDelete} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Sem resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

