"use client";
import { useMovieImage } from "@/hooks/useMovieImage";
import { Titulo } from "@/model/titulo/titulo";
import { ImageOff, Loader2 } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  titulo: Titulo;
  onClick: (titulo: Titulo) => void;
}

export function MovieCard({ titulo, onClick }: MovieCardProps) {
  // Agora o hook retorna loading também
  const { imageUrl, loading } = useMovieImage(titulo.nome, titulo.ano);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      onClick={() => onClick(titulo)}
      className="group relative cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#10476E] flex flex-col h-full"
    >
      {/* Container da Imagem (Aspect Ratio fixo para não quebrar o grid) */}
      <div className="relative w-full aspect-[2/3] bg-gray-100 overflow-hidden">
        
        {/* 1. Loading State */}
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        )}

        {/* 2. Imagem Real */}
        {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={imageUrl} 
              alt={titulo.nome}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
        ) : (
            // 3. Fallback (Caso não ache imagem ou ainda esteja carregando o null)
            !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                    <ImageOff className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-semibold text-slate-500 line-clamp-2">{titulo.nome}</span>
                </div>
            )
        )}
        
        {/* Badge de Categoria */}
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-[#10476E]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-white/20">
            {titulo.categoria}
          </span>
        </div>
      </div>

      {/* Informações */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
            <h3 className="text-gray-900 font-bold text-sm leading-tight line-clamp-2 group-hover:text-[#10476E] transition-colors mb-1">
            {titulo.nome}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
                {titulo.diretor?.nome || "Diretor desconhecido"}
            </p>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">
            {titulo.ano}
          </span>
          {titulo.classe && (
             <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                R$ {Number(titulo.classe.valor).toFixed(2)}
             </span>
          )}
        </div>
      </div>
    </div>
  );
}