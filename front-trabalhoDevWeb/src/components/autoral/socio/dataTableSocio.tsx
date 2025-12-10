"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useSocioHook } from "@/hooks/socio";
import { FilePen, Ban, CheckCircle, Trash2 } from "lucide-react"; 
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DataTableSocio() {
  const { socios, listarSocios, deletarSocio, inativarSocio, reativarSocio } = useSocioHook();
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    listarSocios();
  }, [listarSocios]);

  const filteredSocios = socios?.filter((socio) =>
    socio.nome.toLowerCase().includes(search.toLowerCase()) || 
    socio.numInscricao.includes(search)
  );

  return (
    <div className="w-full px-6">
      <div className="flex items-center py-6">
        <Input
          placeholder="Pesquisar por nome ou nº inscrição"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        {socios === null ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Nº Inscrição</TableHead>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">CPF</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Dependentes</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSocios?.length ? (
                filteredSocios.map((socio) => (
                  <TableRow key={socio.id} className={!socio.estahAtivo ? "bg-gray-100 opacity-80" : ""}>
                    <TableCell className="text-center font-medium">{socio.numInscricao}</TableCell>
                    <TableCell className="text-center">{socio.nome}</TableCell>
                    <TableCell className="text-center">{socio.cpf}</TableCell>
                    <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${socio.estahAtivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {socio.estahAtivo ? "ATIVO" : "INATIVO"}
                        </span>
                    </TableCell>
                    <TableCell className="text-center">{socio.dependentes?.length || 0}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center space-x-2">
                        {/* Editar */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/socio/editarSocio/${socio.id}`}>
                                        <FilePen className="cursor-pointer text-blue-500 w-5 h-5" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Ativar / Inativar */}
                        {socio.estahAtivo ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Ban 
                                            className="cursor-pointer text-orange-500 w-5 h-5" 
                                            onClick={() => inativarSocio(socio.id)}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>Inativar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <CheckCircle 
                                            className="cursor-pointer text-green-600 w-5 h-5" 
                                            onClick={() => reativarSocio(socio.id)}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>Reativar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {/* Excluir */}
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Trash2 className="cursor-pointer text-red-500 w-5 h-5" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Sócio?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Isso excluirá o sócio <b>{socio.nome}</b> e todos os seus dependentes permanentemente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600" onClick={() => deletarSocio(socio.id)}>
                                        Confirmar Exclusão
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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