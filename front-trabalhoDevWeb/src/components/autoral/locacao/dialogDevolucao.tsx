"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useLocacaoHook } from "@/hooks/locacao";
import { Locacao } from "@/model/locacao/locacao";
import { RefreshCcw, Search, Check, PackageOpen, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DialogDevolucao() {
    const [open, setOpen] = useState(false);
    const [selectedNumSerie, setSelectedNumSerie] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [pendentes, setPendentes] = useState<Locacao[]>([]);
    const [loading, setLoading] = useState(false);
    
    const { realizarDevolucao, listarLocacoesPendentes } = useLocacaoHook();

    useEffect(() => {
        if(open) {
            setSearchTerm("");
            setSelectedNumSerie("");
            setLoading(true);
            // Busca do backend apenas as locações ativas
            listarLocacoesPendentes()
                .then(dados => setPendentes(dados || []))
                .finally(() => setLoading(false));
        }
    }, [open, listarLocacoesPendentes]);

    // Filtra localmente os itens pendentes
    const filtrados = pendentes.filter(loc => {
        const term = searchTerm.toLowerCase();
        return (
            loc.tituloItem?.toLowerCase().includes(term) ||
            loc.numSerieItem?.toLowerCase().includes(term) ||
            loc.nomeCliente?.toLowerCase().includes(term)
        );
    });

    const handleDevolver = async () => {
        if(!selectedNumSerie) return;
        try {
            await realizarDevolucao(selectedNumSerie);
            setOpen(false); // Fecha ao concluir com sucesso
        } catch {
            // Erro já tratado no hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-md">
                    <RefreshCcw size={16}/> Devolver Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#10476E]">
                        <RefreshCcw size={20}/> Registrar Devolução
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-2">
                    <div className="flex flex-col gap-2">
                        <Label>Buscar Locação Pendente</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Digite filme, série ou nome do cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-2 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                            <span>Itens Aguardando Devolução</span>
                            <span>{filtrados.length} encontrados</span>
                        </div>
                        <ScrollArea className="h-[250px] bg-gray-50/30">
                            {loading ? (
                                <div className="flex items-center justify-center h-40 text-gray-400">Carregando...</div>
                            ) : filtrados.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
                                    <PackageOpen size={32} strokeWidth={1.5} />
                                    <p>Nenhuma locação encontrada.</p>
                                </div>
                            ) : (
                                <div className="p-2 space-y-1">
                                    {filtrados.map((loc) => {
                                        const isSelected = selectedNumSerie === loc.numSerieItem;
                                        // Verifica se está atrasado para mostrar alerta visual
                                        const isLate = new Date(loc.dtDevolucaoPrevista) < new Date();

                                        return (
                                            <div
                                                key={loc.id}
                                                onClick={() => setSelectedNumSerie(loc.numSerieItem!)}
                                                className={cn(
                                                    "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-all border",
                                                    isSelected 
                                                        ? "bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-200" 
                                                        : "bg-white border-transparent hover:bg-gray-100 hover:border-gray-200"
                                                )}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className={cn("font-semibold", isSelected ? "text-blue-800" : "text-gray-800")}>
                                                            {loc.tituloItem}
                                                        </span>
                                                        <span className="font-mono text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                                                            {loc.numSerieItem}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                                                        <span className="flex items-center gap-1">
                                                            <User size={12} /> {loc.nomeCliente}
                                                        </span>
                                                        {isLate && (
                                                            <span className="text-red-600 font-bold text-[10px] bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
                                                                <AlertCircle size={10}/> Atrasado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="ml-3 bg-blue-600 text-white rounded-full p-0.5 animate-in zoom-in-50">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button 
                        onClick={handleDevolver} 
                        disabled={!selectedNumSerie} 
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto transition-colors"
                    >
                        Confirmar Devolução
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}