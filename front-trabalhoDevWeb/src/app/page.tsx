"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTituloHook } from "@/hooks/titulo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clapperboard, LogIn, Filter } from "lucide-react";
import { Titulo } from "@/model/titulo/titulo";
import { MovieCard } from "@/components/autoral/cliente/MovieCard";
import { MovieDetailModal } from "@/components/autoral/cliente/MovieDetailModal";

// Tipos de filtro conforme caso de uso
type FilterType = "nome" | "categoria" | "ator";

export default function ClientHome() {
  const router = useRouter();
  const { titulos, listarTitulos } = useTituloHook();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("nome");
  const [selectedMovie, setSelectedMovie] = useState<Titulo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para popular os selects
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueActors, setUniqueActors] = useState<{id: number, nome: string}[]>([]);

  useEffect(() => {
    listarTitulos();
  }, [listarTitulos]);

  // Extrair dados únicos para os filtros
  useEffect(() => {
    if (titulos) {
        const categories = Array.from(new Set(titulos.map(t => t.categoria)));
        setUniqueCategories(categories);

        const actorsMap = new Map();
        titulos.forEach(t => {
            t.atores.forEach(a => {
                if(!actorsMap.has(a.id)) actorsMap.set(a.id, a.nome);
            });
        });
        setUniqueActors(Array.from(actorsMap, ([id, nome]) => ({ id, nome })));
    }
  }, [titulos]);

  // Filtragem local
  const filteredMovies = titulos?.filter((movie) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    if (filterType === "nome") return movie.nome.toLowerCase().includes(term);
    if (filterType === "categoria") return movie.categoria.toLowerCase().includes(term);
    if (filterType === "ator") return movie.atores.some(ator => ator.nome.toLowerCase().includes(term));
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f1f5ff] font-sans flex flex-col">
      
      {/* --- NAVBAR --- */}
      <header className="bg-[#10476E] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Identidade Visual */}
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => {setSearchTerm(""); setFilterType("nome")}}
            >
                <Clapperboard className="text-white h-8 w-8" />
                <h1 className="text-white text-xl font-bold tracking-wide">
                    LOCADORA<span className="text-blue-200">PASSATEMPO</span>
                </h1>
            </div>

            {/* Botão Administração */}
            <Button 
                onClick={() => router.push("/dashboard")} // Redireciona para o antigo dashboard
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 transition-all"
                variant="outline"
            >
                <LogIn size={18} />
                <span className="hidden md:inline">Administração</span>
            </Button>
        </div>
      </header>

      {/* --- HERO / SEARCH SECTION --- */}
      <section className="bg-gradient-to-b from-[#10476E] to-[#1c2b5b] pb-20 pt-10 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                Encontre o seu próximo filme
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Explore nosso acervo completo. Pesquise por título, categoria ou encontre filmes do seu ator favorito.
            </p>

            {/* BARRA DE PESQUISA (Estilo Card Flutuante) */}
            <div className="bg-white p-2 rounded-lg shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                
                {/* 1. Tipo de Filtro */}
                <div className="w-full md:w-[180px]">
                    <Select value={filterType} onValueChange={(val: any) => { setFilterType(val); setSearchTerm(""); }}>
                        <SelectTrigger className="h-12 border-none bg-gray-50 focus:ring-0 text-gray-700 font-medium">
                            <SelectValue placeholder="Filtrar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nome">Nome do Título</SelectItem>
                            <SelectItem value="categoria">Categoria</SelectItem>
                            <SelectItem value="ator">Ator</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. Campo de Busca (Dinâmico) */}
                <div className="flex-1 relative">
                    {filterType === 'nome' ? (
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                            <Input 
                                placeholder="Digite o nome do filme..." 
                                className="h-12 pl-10 border-none bg-gray-50 focus-visible:ring-0 text-gray-800 placeholder:text-gray-400 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    ) : filterType === 'categoria' ? (
                        <Select onValueChange={setSearchTerm}>
                            <SelectTrigger className="h-12 border-none bg-gray-50 text-gray-700">
                                <SelectValue placeholder="Selecione uma categoria..." />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Select onValueChange={setSearchTerm}>
                            <SelectTrigger className="h-12 border-none bg-gray-50 text-gray-700">
                                <SelectValue placeholder="Selecione um ator..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {uniqueActors.map(ator => (
                                    <SelectItem key={ator.id} value={ator.nome}>{ator.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* 3. Botão Buscar (Apenas visual, pois a busca é reativa, ou para limpar) */}
                <Button 
                    className="h-12 px-8 bg-[#10476E] hover:bg-[#004195] text-white font-semibold text-base transition-colors"
                    onClick={() => {}} // A busca já é automática no onChange
                >
                    Buscar
                </Button>
            </div>
            
            {/* Tags de Filtro Rápido (Opcional) */}
            {searchTerm && (
                <div className="flex justify-center items-center gap-2 mt-4 text-sm text-blue-200 animate-in fade-in">
                    <span>Filtro ativo: </span>
                    <span className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 font-medium">
                        {filterType === 'nome' ? `"${searchTerm}"` : searchTerm}
                    </span>
                    <button 
                        onClick={() => {setSearchTerm(""); setFilterType("nome")}} 
                        className="underline hover:text-white ml-2"
                    >
                        Limpar
                    </button>
                </div>
            )}
        </div>
      </section>

      {/* --- GRID DE RESULTADOS --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20 relative z-10">
        {titulos === null ? (
            <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Carregando catálogo...</p>
            </div>
        ) : filteredMovies?.length === 0 ? (
            <div className="bg-white p-16 rounded-lg shadow-md text-center">
                <Film className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum título encontrado</h3>
                <p className="text-gray-500 mt-1">Tente ajustar seus filtros de busca.</p>
                <Button 
                    variant="link" 
                    className="mt-4 text-[#10476E]"
                    onClick={() => {setSearchTerm(""); setFilterType("nome")}}
                >
                    Ver todos os títulos
                </Button>
            </div>
        ) : (
            <>
                <div className="flex items-center justify-between mb-6 text-white md:text-gray-800">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Filter className="h-5 w-5" /> Resultados ({filteredMovies?.length})
                    </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
            <p className="text-[#10476E] font-semibold">Locadora Passatempo</p>
            <p className="text-gray-500 text-sm mt-2">© 2025 - Todos os direitos reservados</p>
        </div>
      </footer>

      {/* --- MODAL DE DETALHES --- */}
      <MovieDetailModal 
        titulo={selectedMovie} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}