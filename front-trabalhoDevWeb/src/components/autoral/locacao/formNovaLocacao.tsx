"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocacaoHook } from "@/hooks/locacao";
import { useSocioHook } from "@/hooks/socio";
import { useItemHook } from "@/hooks/item";
import { useTituloHook } from "@/hooks/titulo"; // <--- Novo hook
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarIcon, CreditCard, User, Film } from "lucide-react";

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
  const { titulos, listarTitulos } = useTituloHook(); // <--- Usamos titulos para descobrir a classe
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarSocios();
    listarItens();
    listarTitulos(); // <--- Carrega os títulos com suas classes e itens
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

  // Monitora a seleção do Item
  const watchIdItem = form.watch("idItem");

  useEffect(() => {
    if (watchIdItem && titulos) {
        const idSelecionado = Number(watchIdItem);
        
        // Lógica: Procura em todos os títulos qual deles contém o item selecionado
        const tituloEncontrado = titulos.find(t => 
            t.itens?.some(item => item.id === idSelecionado)
        );
        
        if (tituloEncontrado && tituloEncontrado.classe) {
            const classe = tituloEncontrado.classe;
            
            // 1. Define Valor sugerido da Classe
            // (Converte para string pois o input espera string ou number controlado)
            form.setValue("valorCobrado", String(classe.valor));

            // 2. Define Data Prevista (Hoje + Prazo da Classe em dias)
            const hoje = new Date();
            const prazoDias = Number(classe.prazoDevolucao);
            
            if (!isNaN(prazoDias)) {
                const dataPrevista = new Date(hoje);
                dataPrevista.setDate(hoje.getDate() + prazoDias);
                
                // Formata para YYYY-MM-DD
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
                
                {/* Cliente */}
                <FormField
                    control={form.control}
                    name="idCliente"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><User size={16}/> Cliente / Sócio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o cliente..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {socios?.filter(s => s.estahAtivo).map((socio) => (
                                    <SelectItem key={socio.id} value={String(socio.id)}>
                                        {socio.nome} (Insc: {socio.numInscricao})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Item - Mostramos a lista de Itens normalmente */}
                <FormField
                    control={form.control}
                    name="idItem"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Film size={16}/> Item (Filme/Série)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o item..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {itens?.map((item) => {
                                    // Podemos tentar achar o nome do título aqui também para exibir bonito na lista,
                                    // usando a mesma lógica dos titulos, ou usar o que já vem no item se disponível.
                                    // Como não mudamos o back, item.titulo pode estar vazio, então usamos apenas o numSerie e tipo.
                                    return (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.numSerie} - {item.tipoItem}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
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