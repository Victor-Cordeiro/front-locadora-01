"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Titulo } from "@/model/titulo/titulo";
import { useMovieImage } from "@/hooks/useMovieImage";
import { User, Film, Tag, ImageOff, Loader2, X, Calendar, DollarSign, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Se não tiver scroll-area instalado, troque por uma div com overflow-y-auto

interface MovieDetailModalProps {
  titulo: Titulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailModal({
  titulo,
  isOpen,
  onClose,
}: MovieDetailModalProps) {
  const { imageUrl, loading } = useMovieImage(titulo?.nome || "", titulo?.ano);

  if (!titulo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* ALTERAÇÕES VISUAIS:
         1. sm:max-w-[900px]: Deixa o modal mais largo para o conteúdo respirar.
         2. [&>button]:hidden: Remove o botão fechar padrão para usarmos o nosso.
         3. gap-0: Remove espaçamentos indesejados entre as colunas.
      */}
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-none shadow-2xl bg-white gap-0 [&>button]:hidden rounded-xl">
        
        {/* Layout: Mobile (Coluna) / Desktop (Linha com a imagem fixa em 340px) */}
        <div className="flex flex-col md:grid md:grid-cols-[340px_1fr] md:min-h-[550px]">
          
          {/* --- COLUNA DA IMAGEM --- */}
          {/* relative h-64 md:h-auto: Altura fixa no mobile, altura automática (preenche o pai) no desktop */}
          <div className="relative h-72 md:h-auto bg-gray-100 overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
                <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
              </div>
            ) : imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={titulo.nome}
                // absolute inset-0 + object-cover: A imagem cobre todo o espaço sem deformar
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400 p-6 text-center">
                <ImageOff className="w-16 h-16 mb-3 opacity-50" />
                <span className="text-sm font-medium">Capa indisponível</span>
              </div>
            )}
            
            {/* Gradiente sutil no topo (apenas mobile) para o botão fechar aparecer melhor se a imagem for clara */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/50 to-transparent md:hidden pointer-events-none" />
          </div>

          {/* --- COLUNA DE CONTEÚDO --- */}
          <div className="relative flex flex-col h-full bg-white">
            
            {/* Botão Fechar (Posicionado absolutamente no canto superior direito) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-gray-100/80 hover:bg-gray-200 text-gray-600 rounded-full transition-all backdrop-blur-sm outline-none focus:ring-2 focus:ring-[#10476E]"
              title="Fechar"
            >
              <X size={20} />
            </button>

            {/* Cabeçalho */}
            <div className="p-6 md:p-8 md:pb-4 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-[#10476E] text-white text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wide">
                  {titulo.categoria}
                </span>
                {titulo.classe && (
                   <span className="bg-blue-50 text-[#10476E] border border-blue-100 text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
                     {titulo.classe.nome}
                   </span>
                )}
              </div>

              <DialogHeader className="text-left space-y-2">
                <DialogTitle className="text-3xl md:text-4xl font-extrabold text-[#1B254F] leading-tight pr-10 break-words">
                  {titulo.nome}
                </DialogTitle>
                
                <div className="flex flex-wrap items-center text-gray-500 text-sm font-medium gap-x-6 gap-y-2 pt-1">
                   <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-[#10476E]" />
                      <span>{titulo.ano}</span>
                   </div>
                   {titulo.diretor && (
                     <div className="flex items-center gap-1.5">
                        <User size={16} className="text-[#10476E]" />
                        <span>Dir. {titulo.diretor.nome}</span>
                     </div>
                   )}
                </div>
                <DialogDescription className="sr-only">
                  Detalhes do filme
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Conteúdo com Scroll (Para garantir que não estoure a tela) */}
            <ScrollArea className="flex-1 px-6 md:px-8 pb-8 h-[300px] md:h-auto">
              <div className="space-y-8">
                
                {/* Sinopse */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sinopse</h3>
                  <p className="text-gray-700 text-base leading-relaxed text-justify">
                    {titulo.sinopse || "Nenhuma sinopse cadastrada para este título."}
                  </p>
                </div>

                {/* Cards de Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4 hover:border-blue-200 transition-colors">
                        <div className="bg-white p-2.5 rounded-full shadow-sm text-[#10476E] mt-1">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Valor da Locação</p>
                            <p className="text-2xl font-bold text-[#10476E]">
                                {titulo.classe?.valor 
                                  ? `R$ ${Number(titulo.classe.valor).toFixed(2)}` 
                                  : "--"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4 hover:border-blue-200 transition-colors">
                         <div className="bg-white p-2.5 rounded-full shadow-sm text-[#10476E] mt-1">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Prazo Devolução</p>
                            <p className="text-xl font-bold text-gray-800">
                                {titulo.classe?.prazoDevolucao 
                                  ? `${titulo.classe.prazoDevolucao} dias` 
                                  : "Padrão"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Elenco */}
                {titulo.atores && titulo.atores.length > 0 && (
                  <div className="space-y-3 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm uppercase tracking-wide">
                      <Film size={16} className="text-[#10476E]" /> 
                      Elenco Principal
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {titulo.atores.map((ator) => (
                        <span
                          key={ator.id}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200"
                        >
                          {ator.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}