"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocacaoHook } from "@/hooks/locacao";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formSchema = z.object({
    dtDevolucaoPrevista: z.string().min(1, "Obrigatória"),
    valorCobrado: z.string().optional(),
});

interface Props { id: string; }

export function FormEditarLocacao({ id }: Props) {
  const { editarLocacao, buscarLocacaoPorId } = useLocacaoHook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { dtDevolucaoPrevista: "", valorCobrado: "" },
  });

  useEffect(() => {
    async function carregar() {
        if(id) {
            const data = await buscarLocacaoPorId(Number(id));
            if(data) {
                form.setValue("dtDevolucaoPrevista", data.dtDevolucaoPrevista);
                form.setValue("valorCobrado", data.valorCobrado?.toString() || "");
            }
        }
    }
    carregar();
  }, [id, buscarLocacaoPorId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        // NOTA: O backend exige idCliente e idItem no DTO, mas não os retorna no GET.
        // Enviamos 0 ou valores fictícios, assumindo que o backend não vai tentar trocar o cliente
        // se o ID for inválido, ou que você ajustará o backend para retornar esses IDs.
        const payload = {
            id: Number(id),
            idCliente: 0, 
            idItem: 0,
            dtDevolucaoPrevista: values.dtDevolucaoPrevista,
            valorCobrado: values.valorCobrado ? Number(values.valorCobrado) : 0
        };
        
        await editarLocacao(Number(id), payload);
        router.push("/locacao");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-md shadow border">
            <h2 className="text-lg font-bold text-[#10476E] mb-4">Editar Locação #{id}</h2>
            <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-2 border-l-4 border-yellow-400">
                Atenção: Apenas a data de devolução e o valor podem ser ajustados aqui.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="dtDevolucaoPrevista"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Data Devolução Prevista</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="valorCobrado"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor Cobrado</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/locacao")}>Cancelar</Button>
          <Button type="submit" className="bg-[#10476E]" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}