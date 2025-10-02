"use client";
import React from "react";
import { Classe } from "@/model/classe/classe"; // Supondo que você tenha definido a interface Classe
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useClasseHook } from "@/hooks/classe"; // Importando o hook
import { FilePen } from "lucide-react"; // Ícone de editar
import toast from "react-hot-toast";
import Link from "next/link"; // Para navegação
import { AlertDialogExcluir } from "@/components/autoral/classe/alertDialogExcluir"; // Caminho para o seu componente de diálogo de exclusão

export function DataTableClasse() {
  const { classes, listarClasses, deletarClasse } = useClasseHook(); // Usando o hook para listar, deletar classes
  const [search, setSearch] = React.useState<string>("");

  // Chamando a função de listarClasses no momento da montagem do componente
  React.useEffect(() => {
    listarClasses(); // Carrega as classes assim que o componente é montado
  }, [listarClasses]);

  // Filtrando as classes pela busca
  const filteredClasses = classes?.filter((classe) =>
    classe.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Função para excluir classe
  const handleDelete = async (id: string) => {
    try {
      // Chama o hook de deletação para remover a classe do backend
      await deletarClasse(Number(id));
      toast.success("Classe deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar classe.");
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

      {/* Tabela */}
      <div className="rounded-md border">
        {classes === null ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Nome da Classe</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead className="text-center">Prazo de Devolução</TableHead>
                <TableHead className="text-center">Ações</TableHead> {/* Coluna de Ações */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses?.length ? (
                filteredClasses.map((classe) => (
                  <TableRow key={classe.id}>
                    <TableCell className="text-center">{classe.id}</TableCell>
                    <TableCell className="text-center">{classe.nome}</TableCell>
                    <TableCell className="text-center">
                      {isNaN(Number(classe.valor)) ? "R$ 0.00" : `R$ ${Number(classe.valor).toFixed(2)}`}
                    </TableCell>
                    <TableCell className="text-center">{classe.prazoDevolucao}</TableCell>

                    {/* Coluna de Ações */}
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        {/* Editar */}
                        <Link href={`/classe/editarClasse/${classe.id}`}>
                          <FilePen className="cursor-pointer text-blue-500" style={{ width: 20, height: 20 }} />
                        </Link>

                        {/* Excluir */}
                        <AlertDialogExcluir
                          id={classe.id.toString()} // Passando o ID da classe para o AlertDialogExcluir
                          onDelete={handleDelete} // Função de exclusão
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
