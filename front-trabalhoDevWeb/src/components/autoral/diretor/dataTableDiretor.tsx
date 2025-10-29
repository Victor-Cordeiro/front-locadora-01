"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useDiretorHook } from "@/hooks/diretor"; // Importando o hook
import { FilePen } from "lucide-react"; // Ícone de editar
import toast from "react-hot-toast";
import Link from "next/link"; // Para navegação
import { AlertDialogExcluir } from "@/components/autoral/diretor/alertDialogExcluir"; // Caminho para o seu componente de diálogo de exclusão

export function DataTableDiretor() {
  const { diretores, listarDiretores, deletarDiretor } = useDiretorHook(); // Usando o hook para listar, deletar diretores
  const [search, setSearch] = React.useState<string>("");

  // Chamando a função de listarDiretores no momento da montagem do componente
  React.useEffect(() => {
    listarDiretores(); // Carrega os diretores assim que o componente é montado
  }, [listarDiretores]);

  // Filtrando os diretores pela busca
  const filteredDiretores = diretores?.filter((diretor) =>
    diretor.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Função para excluir diretor
  const handleDelete = async (id: string) => {
    try {
      await deletarDiretor(Number(id));
      toast.success("Diretor deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar diretor.");
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
        {diretores === null ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Nome do Diretor</TableHead>
                <TableHead className="text-center">Ações</TableHead> {/* Coluna de Ações */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiretores?.length ? (
                filteredDiretores.map((diretor) => (
                  <TableRow key={diretor.id}>
                    <TableCell className="text-center">{diretor.id}</TableCell>
                    <TableCell className="text-center">{diretor.nome}</TableCell>

                    {/* Coluna de Ações */}
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        {/* Editar */}
                        <Link href={`/diretor/editarDiretor/${diretor.id}`}>
                          <FilePen className="cursor-pointer text-blue-500" style={{ width: 20, height: 20 }} />
                        </Link>

                        {/* Excluir */}
                        <AlertDialogExcluir
                          id={diretor.id.toString()} // Passando o ID do diretor para o AlertDialogExcluir
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
