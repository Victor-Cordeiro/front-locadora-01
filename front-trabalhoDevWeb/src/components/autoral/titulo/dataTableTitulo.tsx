"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useTituloHook } from "@/hooks/titulo";
import { FilePen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertDialogExcluir } from "./alertDialogExcluir";
import { DialogVerTitulo } from "./DialogVerTitulo";

export function DataTableTitulo() {
  const { titulos, listarTitulos, deletarTitulo } = useTituloHook();
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    listarTitulos();
  }, [listarTitulos]);

  const filteredTitulos = titulos?.filter((titulo) =>
    titulo.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deletarTitulo(Number(id));
      toast.success("Título deletado com sucesso!");
    } catch {
      toast.error("Erro ao deletar título.");
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
<TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <DialogVerTitulo tituloId={titulo.id} />
                        <Link href={`/titulo/editarTitulo/${titulo.id}`}>
                          <FilePen className="cursor-pointer text-blue-500" style={{ width: 20, height: 20 }} />
                        </Link>
                        <AlertDialogExcluir
                          id={titulo.id.toString()}
                          onDelete={handleDelete}
                        />
                      </div>
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

