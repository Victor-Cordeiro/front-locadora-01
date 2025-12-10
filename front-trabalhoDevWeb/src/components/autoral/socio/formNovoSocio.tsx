"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSocioHook } from "@/hooks/socio";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash, User, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Schema de Validação
const dependenteSchema = z.object({
    numInscricao: z.string().min(1, "Obrigatório"),
    nome: z.string().min(1, "Obrigatório"),
    dataNascimento: z.string().min(1, "Obrigatória"),
    sexo: z.string().min(1, "Obrigatório"),
    cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
    endereco: z.string().optional(),
    telefone: z.string().optional(),
});

const socioSchema = z.object({
  numInscricao: z.string().min(1, "Obrigatório"),
  nome: z.string().min(3, "Mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  endereco: z.string().min(1, "Obrigatório"),
  telefone: z.string().min(1, "Obrigatório"),
  dataNascimento: z.string().min(1, "Obrigatória"),
  sexo: z.string().min(1, "Obrigatório"),
  dependentes: z.array(dependenteSchema).max(3, "Máximo de 3 dependentes")
});

export function FormNovoSocio() {
  const { criarSocio } = useSocioHook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof socioSchema>>({
    resolver: zodResolver(socioSchema),
    defaultValues: {
      numInscricao: "", nome: "", cpf: "", endereco: "", telefone: "",
      dataNascimento: "", sexo: "", dependentes: []
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dependentes",
  });

  async function onSubmit(values: z.infer<typeof socioSchema>) {
    setLoading(true);
    try {
        const payload = {
            ...values,
            dependentes: values.dependentes.map(d => ({
                ...d,
                endereco: d.endereco || values.endereco, // Herda endereço se vazio (regra de negócio comum, opcional)
                telefone: d.telefone || values.telefone
            }))
        };
        await criarSocio(payload);
        router.push("/socio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* DADOS DO SÓCIO */}
        <div className="bg-white p-6 rounded-md shadow border">
            <h2 className="text-lg font-bold text-[#10476E] mb-4 flex items-center gap-2"><User size={20}/> Dados do Sócio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="numInscricao" render={({ field }) => (
                    <FormItem><FormLabel>Nº Inscrição</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                    <FormItem><FormLabel>CPF</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                    <FormItem><FormLabel>Data Nasc.</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sexo" render={({ field }) => (
                    <FormItem><FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="telefone" render={({ field }) => (
                    <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="endereco" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Endereço</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        {/* DEPENDENTES */}
        <div className="bg-gray-50 p-6 rounded-md shadow border border-dashed border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2"><Users size={20}/> Dependentes ({fields.length}/3)</h3>
                {fields.length < 3 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ numInscricao: "", nome: "", cpf: "", dataNascimento: "", sexo: "", endereco: "", telefone: "" })} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Plus className="w-4 h-4 mr-2"/> Adicionar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
            {fields.map((field, index) => (
                <div key={field.id} className="relative bg-white p-4 rounded border border-gray-200 shadow-sm">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:bg-red-50" onClick={() => remove(index)}>
                        <Trash className="w-4 h-4"/>
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <FormField control={form.control} name={`dependentes.${index}.nome`} render={({ field }) => (<FormItem className="col-span-2"><FormLabel className="text-xs">Nome</FormLabel><FormControl><Input className="h-8 text-sm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`dependentes.${index}.cpf`} render={({ field }) => (<FormItem><FormLabel className="text-xs">CPF</FormLabel><FormControl><Input className="h-8 text-sm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`dependentes.${index}.dataNascimento`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Data Nasc.</FormLabel><FormControl><Input type="date" className="h-8 text-sm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`dependentes.${index}.numInscricao`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Inscrição</FormLabel><FormControl><Input className="h-8 text-sm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`dependentes.${index}.sexo`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Sexo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Selecione"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    </div>
                </div>
            ))}
            {fields.length === 0 && <p className="text-center text-gray-400 italic">Nenhum dependente adicionado.</p>}
            </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/socio")}>Cancelar</Button>
          <Button type="submit" className="bg-[#10476E]" disabled={loading}>{loading ? "Salvando..." : "Salvar Sócio"}</Button>
        </div>
      </form>
    </Form>
  );
}