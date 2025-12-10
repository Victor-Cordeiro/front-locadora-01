"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTituloHook } from "@/hooks/titulo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clapperboard, LogIn, Filter, X, Film, User, Tag } from "lucide-react";
import { Titulo } from "@/model/titulo/titulo";
import { MovieCard } from "@/components/autoral/cliente/MovieCard";
import { cn } from "@/lib/utils"; // Importante para classes condicionais
import { MovieDetailModal } from "@/components/autoral/cliente/MovieDetailModal";

type FilterType = "nome" | "categoria" | "ator";

export default function ClientHome() {
  const router = useRouter();
  const { titulos, listarTitulos } = useTituloHook();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("nome");
  const [selectedMovie, setSelectedMovie] = useState<Titulo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueActors, setUniqueActors] = useState<{id: number, nome: string}[]>([]);

  useEffect(() => {
    listarTitulos();
  }, [listarTitulos]);

  useEffect(() => {
    if (titulos) {
        const categories = Array.from(new Set(titulos.map(t => t.categoria))).sort();
        setUniqueCategories(categories);

        const actorsMap = new Map();
        titulos.forEach(t => {
            t.atores.forEach(a => {
                if(!actorsMap.has(a.id)) actorsMap.set(a.id, a.nome);
            });
        });
        setUniqueActors(Array.from(actorsMap, ([id, nome]) => ({ id, nome })).sort((a, b) => a.nome.localeCompare(b.nome)));
    }
  }, [titulos]);

  const filteredMovies = titulos?.filter((movie) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    if (filterType === "nome") return movie.nome.toLowerCase().includes(term);
    if (filterType === "categoria") return movie.categoria.toLowerCase().includes(term);
    if (filterType === "ator") return movie.atores.some(ator => ator.nome.toLowerCase().includes(term));
    
    return true;
  });

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* --- NAVBAR --- */}
      <header className="bg-[#10476E] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => {setSearchTerm(""); setFilterType("nome")}}
            >
                <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Clapperboard className="text-white h-5 w-5" />
                </div>
                <h1 className="text-white text-lg font-bold tracking-wide">
                    LOCADORA<span className="text-blue-200">PASSATEMPO</span>
                </h1>
            </div>

            <Button 
                onClick={() => router.push("/dashboard")} 
                className="bg-transparent hover:bg-white/10 text-white border border-white/20 gap-2 transition-all rounded-full px-5 h-9 text-sm"
            >
                <LogIn size={14} />
                <span className="hidden md:inline">Área Administrativa</span>
            </Button>
        </div>
      </header>

      {/* --- HERO / SEARCH SECTION --- */}
      <section className="bg-[#10476E] pb-16 pt-10 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                    Qual filme você quer ver hoje?
                </h2>
                <p className="text-blue-100 text-base max-w-xl mx-auto font-light">
                    Explore nosso acervo completo de clássicos e lançamentos.
                </p>
            </div>

            {/* BARRA DE PESQUISA REFINADA */}
            <div className="bg-white p-1 rounded-full shadow-xl flex flex-col md:flex-row items-center max-w-2xl mx-auto border border-blue-800/30">
                
                {/* Seletor de Tipo */}
                <div className="w-full md:w-[160px] relative border-b md:border-b-0 md:border-r border-gray-100">
                    <Select value={filterType} onValueChange={(val: any) => { setFilterType(val); setSearchTerm(""); }}>
                        <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-gray-600 font-medium px-4 rounded-l-full hover:bg-gray-50 transition-colors text-sm">
                            <div className="flex items-center gap-2">
                                {filterType === 'nome' && <Search size={14} className="text-[#10476E]" />}
                                {filterType === 'categoria' && <Tag size={14} className="text-[#10476E]" />}
                                {filterType === 'ator' && <User size={14} className="text-[#10476E]" />}
                                <SelectValue placeholder="Filtrar por" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nome">Por Título</SelectItem>
                            <SelectItem value="categoria">Por Categoria</SelectItem>
                            <SelectItem value="ator">Por Ator</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Campo de Busca */}
                <div className="flex-1 w-full relative group">
                    {filterType === 'nome' ? (
                        <div className="relative w-full h-full flex items-center">
                            <Input 
                                placeholder="Digite o nome do filme..." 
                                className="h-10 pl-4 pr-10 border-none bg-transparent focus-visible:ring-0 text-gray-800 placeholder:text-gray-400 text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    ) : filterType === 'categoria' ? (
                        <Select onValueChange={setSearchTerm} value={searchTerm}>
                            <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-gray-800 text-sm pl-4 pr-12 w-full">
                                <SelectValue placeholder="Escolha uma categoria..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {uniqueCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Select onValueChange={setSearchTerm} value={searchTerm}>
                            <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-gray-800 text-sm pl-4 pr-12 w-full">
                                <SelectValue placeholder="Escolha um ator..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {uniqueActors.map(ator => (
                                    <SelectItem key={ator.id} value={ator.nome}>{ator.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Botão Limpar (X) - Ajuste de Posição */}
                    {searchTerm && (
                        <button 
                            onClick={clearSearch}
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1",
                                // Se for 'nome' (input), fica na direita padrão (right-3)
                                // Se for select, empurramos mais para a esquerda (right-8) para não cobrir a seta
                                filterType === 'nome' ? "right-3" : "right-8"
                            )}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Botão Buscar */}
                <div className="w-full md:w-auto p-0.5">
                    <Button 
                        className="h-9 w-full md:w-auto px-6 bg-[#10476E] hover:bg-[#003366] text-white font-medium text-sm rounded-full shadow-sm transition-all"
                    >
                        Buscar
                    </Button>
                </div>
            </div>
            
            {/* Filtro Ativo */}
            {searchTerm && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-50 text-xs backdrop-blur-sm border border-white/20">
                        <Filter size={12} />
                        Filtrando por {filterType}: 
                        <span className="font-semibold text-white">"{searchTerm}"</span>
                    </span>
                </div>
            )}
        </div>
      </section>

      {/* --- GRID DE RESULTADOS --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {titulos === null ? (
            <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-gray-400 text-sm">Carregando catálogo...</div>
            </div>
        ) : filteredMovies?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Film className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum título encontrado</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">
                    Tente ajustar seus termos de busca ou mudar a categoria.
                </p>
                <Button 
                    variant="link" 
                    className="mt-2 text-[#10476E] text-sm"
                    onClick={clearSearch}
                >
                    Limpar filtros
                </Button>
            </div>
        ) : (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        Acervo Disponível
                        <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium">
                            {filteredMovies?.length}
                        </span>
                    </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                    {filteredMovies?.map((movie) => (
                        <MovieCard 
                            key={movie.id} 
                            titulo={movie} 
                            onClick={(m) => { setSelectedMovie(m); setIsModalOpen(true); }} 
                        />
                    ))}
                </div>
            </>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[#10476E] font-semibold text-sm">Locadora Passatempo</p>
            <p className="text-gray-400 text-xs mt-1">© 2025 - Todos os direitos reservados</p>
        </div>
      </footer>

      <MovieDetailModal 
        titulo={selectedMovie} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}