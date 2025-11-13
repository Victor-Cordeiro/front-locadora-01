"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTituloHook } from "@/hooks/titulo";
import { Titulo } from "@/model/titulo/titulo";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface DialogVerTituloProps {
  tituloId: number;
}

export function DialogVerTitulo({ tituloId }: DialogVerTituloProps) {
  const { buscarTituloPorId } = useTituloHook();
  const [titulo, setTitulo] = useState<Titulo | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchTitulo = async () => {
      if (isOpen && tituloId) {
        try {
          const data = await buscarTituloPorId(tituloId);
          setTitulo(data);
        } catch (error) {
          console.error("Erro ao buscar o título:", error);
          setTitulo(null);
        }
      }
    };
    fetchTitulo();
  }, [isOpen, tituloId, buscarTituloPorId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer text-blue-500" style={{ width: 20, height: 20 }} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Título</DialogTitle>
        </DialogHeader>
        {titulo ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold col-span-1">Nome:</span>
              <span className="col-span-3">{titulo.nome}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold col-span-1">Ano:</span>
              <span className="col-span-3">{titulo.ano}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold col-span-1">Sinopse:</span>
              <span className="col-span-3">{titulo.sinopse}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold col-span-1">Categoria:</span>
              <span className="col-span-3">{titulo.categoria}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold col-span-1">Classe:</span>
              <span className="col-span-3">{titulo?.classe?.nome}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold col-span-1">Diretor:</span>
              <span className="col-span-3">{titulo?.diretor?.nome}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="font-bold col-span-1">Atores:</span>
              <div className="col-span-3">
                {titulo?.atores.map((ator) => (
                  <div key={ator.id}>{ator.nome}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}