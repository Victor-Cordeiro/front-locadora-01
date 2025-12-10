"use client";
import { useMovieImage } from "@/hooks/useMovieImage";
import { Titulo } from "@/model/titulo/titulo";

interface MovieCardProps {
  titulo: Titulo;
  onClick: (titulo: Titulo) => void;
}

export function MovieCard({ titulo, onClick }: MovieCardProps) {
  const imageUrl = useMovieImage(titulo.nome, titulo.ano);

  return (
    <div 
      onClick={() => onClick(titulo)}
      className="group relative cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#10476E]"
    >
      {/* Imagem (Capa) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={titulo.nome}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge de Categoria sobreposta */}
        <div className="absolute top-2 right-2">
          <span className="bg-[#10476E] text-white text-xs font-semibold px-2 py-1 rounded shadow-sm">
            {titulo.categoria}
          </span>
        </div>
      </div>

      {/* Informações Resumidas */}
      <div className="p-3">
        <h3 className="text-[#10476E] font-bold text-sm line-clamp-1 group-hover:text-[#005490] transition-colors">
          {titulo.nome}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{titulo.ano}</span>
          <span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
            {titulo.diretor?.nome}
          </span>
        </div>
      </div>
    </div>
  );
}