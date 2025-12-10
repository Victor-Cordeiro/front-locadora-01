"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, User, Tag } from "lucide-react";
import { Ator } from "@/model/ator/ator";

interface MovieSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedActor: string;
  setSelectedActor: (value: string) => void;
  // Dados para popular os filtros
  categories: string[];
  atores: Ator[];
  onClear: () => void;
}

export function MovieSearchBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedActor,
  setSelectedActor,
  categories,
  atores,
  onClear,
}: MovieSearchBarProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* 1. Busca por Nome (Texto) */}
        <div className="w-full md:w-1/3">
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Pesquisar por Título
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Digite o nome do filme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus:ring-[#10476E]"
            />
          </div>
        </div>

        {/* 2. Busca por Categoria (Dropdown) */}
        <div className="w-full md:w-1/4">
          <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2">
            <Tag size={14} /> Categoria
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Busca por Ator (Dropdown) */}
        <div className="w-full md:w-1/4">
          <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2">
            <User size={14} /> Ator
          </label>
          <Select value={selectedActor} onValueChange={setSelectedActor}>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Todos os atores" />
            </SelectTrigger>
            <SelectContent>
              {atores.map((ator) => (
                <SelectItem key={ator.id} value={String(ator.id)}>
                  {ator.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão Limpar Filtros */}
        <div className="w-full md:w-auto">
          <Button 
            onClick={onClear}
            variant="outline" 
            className="w-full text-red-500 hover:bg-red-50 border-red-200"
          >
            <X className="w-4 h-4 mr-2" /> Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}