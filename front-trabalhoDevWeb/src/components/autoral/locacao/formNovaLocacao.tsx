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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarIcon, CreditCard, User, Film } from "lucide-react";

const formSchema = z.object({
    idCliente: z.string().min(1, "Cliente é obrigatório"),
    idItem: z.string().min(1, "Item é obrigatório"),
    dtDevolucaoPrevista: z.string().min(1, "Data prevista é obrigatória"),
    valorCobrado: z.string().optional(),
});

export function FormNovaLocacao() {
  const { criarLocacao } = useLocacaoHook();
  const { socios, listarSocios } = useSocioHook();
  const { itens, listarItens } = useItemHook();
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarSocios();
    listarItens();
  }, [listarSocios, listarItens]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idCliente: "",
      idItem: "",
      dtDevolucaoPrevista: "",
      valorCobrado: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        const payload = {
            idCliente: Number(values.idCliente),
            idItem: Number(values.idItem),
            dtDevolucaoPrevista: values.dtDevolucaoPrevista,
            // Converte string para number se houver valor
            valorCobrado: values.valorCobrado ? Number(values.valorCobrado) : undefined
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
                
                {/* Seleção de Cliente */}
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

                {/* Seleção de Item */}
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
                                {itens?.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.numSerie} - {item.titulo?.nome} ({item.tipoItem})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

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

                <FormField
                    control={form.control}
                    name="valorCobrado"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><CreditCard size={16}/> Valor (Opcional)</FormLabel>
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