"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocacaoHook } from "@/hooks/locacao";
import { Locacao } from "@/model/locacao/locacao";
import { Eye, User, Film, Calendar, CreditCard, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

interface DialogVerLocacaoProps {
  locacaoId: number;
}

export function DialogVerLocacao({ locacaoId }: DialogVerLocacaoProps) {
  const { buscarLocacaoPorId } = useLocacaoHook();
  const [locacao, setLocacao] = useState<Locacao | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && locacaoId) {
      setLoading(true);
      buscarLocacaoPorId(locacaoId)
        .then((data) => setLocacao(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, locacaoId, buscarLocacaoPorId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: 'UTC' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="hover:bg-gray-100 p-2 rounded-full cursor-pointer transition-colors" title="Ver Detalhes">
            <Eye className="text-blue-600 w-5 h-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#10476E] flex items-center gap-2">
            <FileText size={20} /> Detalhes da Locação #{locacaoId}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
            <div className="py-10 text-center text-gray-500">Carregando informações...</div>
        ) : locacao ? (
          <div className="grid gap-4 py-2 text-sm">
            
            {/* Seção Cliente */}
            <div className="space-y-1">
              <h4 className="font-bold text-gray-500 text-xs uppercase flex items-center gap-1">
                <User size={14} /> Cliente
              </h4>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <p className="text-base font-medium text-gray-800">{locacao.nomeCliente}</p>
                <p className="text-xs text-gray-500">
                    {locacao.numInscricaoCliente ? `Inscrição: ${locacao.numInscricaoCliente}` : `ID: ${locacao.idCliente}`}
                </p>
              </div>
            </div>

            <Separator />

            {/* Seção Item */}
            <div className="space-y-1">
              <h4 className="font-bold text-gray-500 text-xs uppercase flex items-center gap-1">
                <Film size={14} /> Item Locado
              </h4>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <p className="text-base font-medium text-gray-800">{locacao.tituloItem}</p>
                <div className="flex gap-3 mt-1">
                    <span className="text-xs font-mono bg-white border px-2 py-0.5 rounded text-gray-600">
                        Série: <b>{locacao.numSerieItem}</b>
                    </span>
                    <span className="text-xs text-gray-500 flex items-center capitalize">
                        Tipo: {locacao.tipoItem?.toLowerCase()}
                    </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Datas e Valores */}
            <div className="grid grid-cols-2 gap-4 bg-blue-50/30 p-3 rounded-md border border-blue-100/50">
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5"><Calendar size={12}/> Data Locação</p>
                <p className="font-medium text-gray-700">{formatDate(locacao.dtLocacao)}</p>
              </div>
              <div>
                <p className="text-xs text-orange-600 flex items-center gap-1 mb-0.5"><Calendar size={12}/> Previsão</p>
                <p className="font-medium text-orange-700">{formatDate(locacao.dtDevolucaoPrevista)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5"><CreditCard size={12}/> Valor Cobrado</p>
                <p className="font-medium text-green-700">R$ {locacao.valorCobrado?.toFixed(2)}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-500 mb-0.5">Situação</p>
                 {locacao.dtDevolucaoEfetiva ? (
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Devolvido</span>
                 ) : (
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">Em Aberto</span>
                 )}
              </div>
            </div>

            {/* Info de Devolução (se houver) */}
            {locacao.dtDevolucaoEfetiva && (
                <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center border border-gray-200">
                    <div>
                        <p className="text-xs text-gray-500">Data Devolução</p>
                        <p className="font-bold text-gray-700">{formatDate(locacao.dtDevolucaoEfetiva)}</p>
                    </div>
                    {locacao.multaCobrada && locacao.multaCobrada > 0 ? (
                        <div className="text-right">
                            <p className="text-xs text-red-500 font-bold uppercase">Multa</p>
                            <p className="font-bold text-red-600">R$ {locacao.multaCobrada.toFixed(2)}</p>
                        </div>
                    ) : (
                        <div className="text-right">
                            <p className="text-xs text-green-600 font-bold uppercase">Sem Multa</p>
                        </div>
                    )}
                </div>
            )}

          </div>
        ) : (
          <div className="py-8 text-center text-red-400">Locação não encontrada.</div>
        )}
        
        <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}