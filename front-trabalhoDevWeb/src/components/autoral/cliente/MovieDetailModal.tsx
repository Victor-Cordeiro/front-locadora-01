"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Titulo } from "@/model/titulo/titulo";
import { useMovieImage } from "@/hooks/useMovieImage";
import { Calendar, User, Film, Tag } from "lucide-react";

interface MovieDetailModalProps {
  titulo: Titulo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailModal({ titulo, isOpen, onClose }: MovieDetailModalProps) {
  const imageUrl = useMovieImage(titulo?.nome || "", titulo?.ano);

  if (!titulo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-white p-0 overflow-hidden border-none shadow-2xl rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          
          {/* Imagem Lateral */}
          <div className="md:col-span-2 h-64 md:h-auto relative bg-gray-100">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={titulo.nome} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conteúdo */}
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
            <DialogHeader className="mb-4 text-left">
              <span className="text-xs font-bold text-[#10476E] uppercase tracking-wide bg-blue-50 px-2 py-1 rounded w-fit mb-2">
                {titulo.categoria}
              </span>
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {titulo.nome}
              </DialogTitle>
              <p className="text-sm text-gray-500 font-medium">{titulo.ano} • {titulo.classe?.nome}</p>
            </DialogHeader>

            <div className="space-y-4 flex-1">
              <p className="text-gray-600 text-sm leading-relaxed">
                {titulo.sinopse}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-2 text-[#10476E] font-semibold mb-1">
                    <User size={14} /> Diretor
                  </div>
                  <span className="text-gray-600">{titulo.diretor?.nome}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#10476E] font-semibold mb-1">
                    <Tag size={14} /> Valor
                  </div>
                  <span className="text-gray-600 font-medium">
                    R$ {Number(titulo.classe?.valor).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#10476E] font-semibold mb-2">
                  <Film size={14} /> Elenco
                </div>
                <div className="flex flex-wrap gap-2">
                  {titulo.atores?.map((ator) => (
                    <span key={ator.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                      {ator.nome}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 flex justify-end">
                 <Button onClick={onClose} variant="outline" className="mr-2">Fechar</Button>
                 <Button className="bg-[#10476E] hover:bg-[#004195] text-white">
                    Consultar Disponibilidade
                 </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}