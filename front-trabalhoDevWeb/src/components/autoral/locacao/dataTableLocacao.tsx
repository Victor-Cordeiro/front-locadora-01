"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useLocacaoHook } from "@/hooks/locacao";
import { FilePen, Trash2, CheckCheck, Clock, AlertCircle } from "lucide-react"; 
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
import { DialogVerLocacao } from "./dialogVerLocacao";

export function DataTableLocacao() {
  const { locacoes, listarLocacoes, deletarLocacao } = useLocacaoHook();
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    listarLocacoes();
  }, [listarLocacoes]);

  // Agora podemos filtrar por Nome do Cliente e Título também!
  const filtered = locacoes?.filter((loc) =>
    loc.id.toString().includes(search) || 
    loc.nomeCliente?.toLowerCase().includes(search.toLowerCase()) ||
    loc.tituloItem?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {timeZone: 'UTC'});
  };

  const formatMoney = (val?: number) => {
    return val !== undefined ? `R$ ${val.toFixed(2)}` : "R$ 0,00";
  };

  return (
    <div className="w-full px-6">
      <div className="flex items-center py-6 gap-4">
        <Input
          placeholder="Pesquisar por ID, Cliente ou Filme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        {locacoes === null ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Cliente</TableHead>
                <TableHead className="text-center">Item</TableHead>
                <TableHead className="text-center">Data Locação</TableHead>
                <TableHead className="text-center">Prev. Devolução</TableHead>
                <TableHead className="text-center">Dt. Devolução</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered?.length ? (
                filtered.map((loc) => {
                    const isDevolvido = !!loc.dtDevolucaoEfetiva;
                    const isAtrasado = !isDevolvido && new Date(loc.dtDevolucaoPrevista) < new Date();

                    return (
                  <TableRow key={loc.id}>
                    <TableCell className="text-center font-medium">{loc.id}</TableCell>
                    <TableCell className="text-center text-xs">{loc.nomeCliente}</TableCell>
                    <TableCell className="text-center text-xs truncate max-w-[150px]" title={`${loc.tituloItem} (${loc.numSerieItem})`}>
                        {loc.tituloItem} <br/> 
                        <span className="text-gray-400 font-mono text-[10px]">{loc.numSerieItem}</span>
                    </TableCell>
                    <TableCell className="text-center text-xs">{formatDate(loc.dtLocacao)}</TableCell>
                    <TableCell className="text-center text-xs">{formatDate(loc.dtDevolucaoPrevista)}</TableCell>
                    <TableCell className="text-center text-xs">{formatDate(loc.dtDevolucaoEfetiva)}</TableCell>
                    <TableCell className="text-center text-xs font-semibold">{formatMoney(loc.valorCobrado)}</TableCell>
                    
                    <TableCell className="text-center">
                        {isDevolvido ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                                <CheckCheck size={12}/> Devolvido
                            </span>
                        ) : isAtrasado ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                                <AlertCircle size={12}/> Atrasado
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                                <Clock size={12}/> Aberto
                            </span>
                        )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center items-center space-x-2">
                        
                        {/* --- BOTÃO VER DETALHES --- */}
                        <DialogVerLocacao locacaoId={loc.id} />

                        {/* --- BOTÃO EDITAR --- */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/locacao/editarLocacao/${loc.id}`}>
                                        <div className="hover:bg-gray-100 p-2 rounded-full cursor-pointer transition-colors">
                                            <FilePen className="text-blue-500 w-5 h-5" />
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Editar Locação</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* --- BOTÃO EXCLUIR --- */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className="hover:bg-red-50 p-2 rounded-full cursor-pointer transition-colors">
                                    <Trash2 className="text-red-500 w-5 h-5" />
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Locação?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Certifique-se que deseja remover este registro histórico.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600" onClick={() => deletarLocacao(loc.id)}>
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )})
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Nenhum registro encontrado.
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