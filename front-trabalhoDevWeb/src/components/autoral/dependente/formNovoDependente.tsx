"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover
import { useDependenteHook } from "@/hooks/dependente";
import { useSocioHook } from "@/hooks/socio";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Shield, Check, ChevronsUpDown, Search } from "lucide-react"; // Import Icons
import { cn } from "@/lib/utils";

const formSchema = z.object({
    idSocio: z.string().min(1, "Selecione um sócio responsável"),
    numInscricao: z.string().min(1, "Obrigatório"),
    nome: z.string().min(1, "Obrigatório"),
    dataNascimento: z.string().min(1, "Obrigatória"),
    sexo: z.string().min(1, "Obrigatório"),
    cpf: z.string().min(11, "CPF inválido"),
    endereco: z.string().optional(),
    telefone: z.string().optional(),
});

export function FormNovoDependente() {
  const { criarDependente } = useDependenteHook();
  const { socios, listarSocios } = useSocioHook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estado para o Combobox
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    listarSocios();
  }, [listarSocios]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idSocio: "",
      numInscricao: "",
      nome: "",
      cpf: "",
      endereco: "",
      telefone: "",
      dataNascimento: "",
      sexo: "",
    },
  });

  // Filtragem dos sócios
  const sociosFiltrados = socios?.filter(s => 
      s.estahAtivo && (
          s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.numInscricao.includes(searchTerm)
      )
  ) || [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        const { idSocio, ...dependenteData } = values;
        const data = {
            ...dependenteData,
            endereco: dependenteData.endereco || "",
            telefone: dependenteData.telefone || ""
        };
        await criarDependente(Number(idSocio), data);
        router.push("/dependente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white p-6 rounded-md shadow border">
            <h2 className="text-lg font-bold text-[#10476E] mb-4 flex items-center gap-2"><User /> Dados do Dependente</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* COMBOBOX DE SÓCIO COM BUSCA */}
                <FormField
                    control={form.control}
                    name="idSocio"
                    render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                        <FormLabel className="flex items-center gap-1 font-bold text-gray-700"><Shield size={16}/> Sócio Responsável</FormLabel>
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                            ? socios?.find((s) => String(s.id) === field.value)?.nome + " (Insc: " + socios?.find((s) => String(s.id) === field.value)?.numInscricao + ")"
                                            : "Selecione ou busque o sócio..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <div className="flex items-center border-b px-3">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <input 
                                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Buscar por nome ou inscrição..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                                    form.setValue("idSocio", String(socio.id));
                                                    setOpenCombobox(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === String(socio.id) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{socio.nome}</span>
                                                    <span className="text-xs text-gray-500">Insc: {socio.numInscricao} | CPF: {socio.cpf}</span>
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

                {/* Resto do Formulário Igual */}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger></FormControl>
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

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/dependente")}>Cancelar</Button>
          <Button type="submit" className="bg-[#10476E]" disabled={loading}>{loading ? "Salvando..." : "Salvar Dependente"}</Button>
        </div>
      </form>
    </Form>
  );
}