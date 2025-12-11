"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocacaoHook } from "@/hooks/locacao";
import { useSocioHook } from "@/hooks/socio";
import { useItemHook } from "@/hooks/item";
import { useTituloHook } from "@/hooks/titulo";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { CalendarIcon, CreditCard, User, Film, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema de validação
const formSchema = z.object({
    idCliente: z.string().min(1, "Cliente é obrigatório"),
    idItem: z.string().min(1, "Item é obrigatório"),
    dtDevolucaoPrevista: z.string().min(1, "Data prevista é obrigatória"),
    valorCobrado: z.string().min(1, "Valor é obrigatório"),
});

export function FormNovaLocacao() {
  const { criarLocacao } = useLocacaoHook();
  const { socios, listarSocios } = useSocioHook();
  const { itens, listarItens } = useItemHook();
  const { titulos, listarTitulos } = useTituloHook();
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados para controlar os Comboboxes
  const [openCliente, setOpenCliente] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    listarSocios();
    listarItens();
    listarTitulos();
  }, [listarSocios, listarItens, listarTitulos]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idCliente: "",
      idItem: "",
      dtDevolucaoPrevista: "",
      valorCobrado: "",
    },
  });

  // --- Lógica de Filtros Otimizada ---
  
  // Filtra clientes ativos por Nome, Inscrição ou CPF
  const sociosFiltrados = useMemo(() => {
    if (!socios) return [];
    const termo = searchCliente.toLowerCase();
    return socios.filter(s => 
        s.estahAtivo && (
            s.nome.toLowerCase().includes(termo) || 
            s.numInscricao.includes(termo) ||
            s.cpf.includes(termo)
        )
    );
  }, [socios, searchCliente]);

  // Filtra itens por Nome do Filme (Titulo), Série ou Tipo
  const itensFiltrados = useMemo(() => {
    if (!itens) return [];
    const termo = searchItem.toLowerCase();
    return itens.filter(i => 
        i.numSerie.toLowerCase().includes(termo) ||
        i.tipoItem.toLowerCase().includes(termo) ||
        // Usa o novo campo nomeTitulo vindo do backend
        (i.nomeTitulo && i.nomeTitulo.toLowerCase().includes(termo))
    );
  }, [itens, searchItem]);


  // --- Monitoramento para Preenchimento Automático ---
  const watchIdItem = form.watch("idItem");

  useEffect(() => {
    if (watchIdItem && titulos) {
        const idSelecionado = Number(watchIdItem);
        
        // Encontra o título dono do item para pegar a Classe e calcular preço/prazo
        // Como o item tem apenas o ID do título, precisamos buscar na lista de títulos completa
        const tituloEncontrado = titulos.find(t => 
            t.itens?.some(item => item.id === idSelecionado)
        );
        
        if (tituloEncontrado && tituloEncontrado.classe) {
            const classe = tituloEncontrado.classe;
            
            // 1. Define Valor sugerido
            form.setValue("valorCobrado", String(classe.valor));

            // 2. Define Data Prevista
            const hoje = new Date();
            const prazoDias = Number(classe.prazoDevolucao);
            
            if (!isNaN(prazoDias)) {
                const dataPrevista = new Date(hoje);
                dataPrevista.setDate(hoje.getDate() + prazoDias);
                const dataFormatada = dataPrevista.toISOString().split('T')[0];
                form.setValue("dtDevolucaoPrevista", dataFormatada);
            }
        }
    }
  }, [watchIdItem, titulos, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        const payload = {
            idCliente: Number(values.idCliente),
            idItem: Number(values.idItem),
            dtDevolucaoPrevista: values.dtDevolucaoPrevista,
            valorCobrado: Number(values.valorCobrado)
        };
        
        await criarLocacao(payload);
        router.push("/locacao");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white p-6 rounded-md shadow border">
            <h2 className="text-lg font-bold text-[#10476E] mb-4 flex items-center gap-2">Nova Locação</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* --- COMBOBOX CLIENTE --- */}
                <FormField
                    control={form.control}
                    name="idCliente"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2"><User size={16}/> Cliente / Sócio</FormLabel>
                        <Popover open={openCliente} onOpenChange={setOpenCliente}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                            ? socios?.find((s) => String(s.id) === field.value)?.nome
                                            : "Selecione o cliente..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <div className="flex items-center border-b px-3">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <input 
                                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Buscar sócio..."
                                        value={searchCliente}
                                        onChange={(e) => setSearchCliente(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-[200px] overflow-y-auto p-1">
                                    {sociosFiltrados.length === 0 ? (
                                        <div className="py-6 text-center text-sm text-muted-foreground">Sócio não encontrado.</div>
                                    ) : (
                                        sociosFiltrados.map((socio) => (
                                            <div
                                                key={socio.id}
                                                className={cn(
                                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                                    field.value === String(socio.id) ? "bg-accent" : ""
                                                )}
                                                onClick={() => {
                                                    form.setValue("idCliente", String(socio.id));
                                                    setOpenCliente(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === String(socio.id) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span>{socio.nome}</span>
                                                    <span className="text-xs text-gray-400">Insc: {socio.numInscricao} | CPF: {socio.cpf}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* --- COMBOBOX ITEM --- */}
                <FormField
                    control={form.control}
                    name="idItem"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2"><Film size={16}/> Item (Filme/Série)</FormLabel>
                        <Popover open={openItem} onOpenChange={setOpenItem}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                            ? itens?.find((i) => String(i.id) === field.value)
                                                ? `${itens.find((i) => String(i.id) === field.value)?.nomeTitulo || 'Item'} (${itens.find((i) => String(i.id) === field.value)?.numSerie})`
                                                : "Item selecionado"
                                            : "Selecione o item..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <div className="flex items-center border-b px-3">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <input 
                                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Buscar filme ou nº série..."
                                        value={searchItem}
                                        onChange={(e) => setSearchItem(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-[200px] overflow-y-auto p-1">
                                    {itensFiltrados.length === 0 ? (
                                        <div className="py-6 text-center text-sm text-muted-foreground">Item não encontrado.</div>
                                    ) : (
                                        itensFiltrados.map((item) => (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                                    field.value === String(item.id) ? "bg-accent" : ""
                                                )}
                                                onClick={() => {
                                                    form.setValue("idItem", String(item.id));
                                                    setOpenItem(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === String(item.id) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col w-full overflow-hidden">
                                                    {/* Mostra o Nome do Título vindo do backend */}
                                                    <span className="font-medium truncate">{item.nomeTitulo || "Sem título"}</span>
                                                    <div className="flex justify-between w-full text-xs text-gray-500">
                                                        <span>Série: {item.numSerie}</span>
                                                        <span>{item.tipoItem}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Data Prevista */}
                <FormField
                    control={form.control}
                    name="dtDevolucaoPrevista"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><CalendarIcon size={16}/> Data Devolução Prevista</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Valor */}
                <FormField
                    control={form.control}
                    name="valorCobrado"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><CreditCard size={16}/> Valor da Locação (R$)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/locacao")}>Cancelar</Button>
          <Button type="submit" className="bg-[#10476E]" disabled={loading}>{loading ? "Registrando..." : "Confirmar Locação"}</Button>
        </div>
      </form>
    </Form>
  );
}