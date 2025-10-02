"use client";

import React from "react";
import { Ator } from "@/model/ator/ator"; // Supondo que você tenha definido a interface Ator
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useAtorHook } from "@/hooks/ator"; // Importando o hook
import { FilePen } from "lucide-react"; // Ícone de editar
import toast from "react-hot-toast";
import Link from "next/link"; // Para navegação
import { AlertDialogExcluir } from "@/components/autoral/ator/alertDialogExcluir"; // Caminho para o seu componente de diálogo de exclusão

export function DataTableAtor() {
  const { atores, listarAtores, deletarAtor } = useAtorHook(); // Usando o hook para listar, deletar atores
  const [search, setSearch] = React.useState<string>("");

  // Chamando a função de listarAtores no momento da montagem do componente
  React.useEffect(() => {
    listarAtores(); // Carrega os atores assim que o componente é montado
  }, [listarAtores]);

  // Filtrando os atores pela busca
  const filteredAtores = atores?.filter((ator) =>
    ator.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Função para excluir ator
  const handleDelete = async (id: string) => {
    try {
      await deletarAtor(Number(id));
      toast.success("Ator deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar ator.");
    }
  };

  return (
    <div className="w-full px-6">
      {/* Campo de pesquisa */}
      <div className="flex items-center py-6">
        <Input
          placeholder="Pesquisar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Exibindo mensagem de erro, se houver */}

      {/* Tabela */}
      <div className="rounded-md border">
        {atores === null ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Nome do Ator</TableHead>
                <TableHead className="text-center">Ações</TableHead> {/* Coluna de Ações */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAtores?.length ? (
                filteredAtores.map((ator) => (
                  <TableRow key={ator.id}>
                    <TableCell className="text-center">{ator.id}</TableCell>
                    <TableCell className="text-center">{ator.nome}</TableCell>

                    {/* Coluna de Ações */}
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        {/* Editar */}
                        <Link href={`/ator/editarAtor/${ator.id}`}>
                          <FilePen className="cursor-pointer text-blue-500" style={{ width: 20, height: 20 }} />
                        </Link>

                        {/* Excluir */}
                        <AlertDialogExcluir
                          id={ator.id.toString()} // Passando o ID do ator para o AlertDialogExcluir
                          onDelete={handleDelete} // Função de exclusão
                             />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
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
