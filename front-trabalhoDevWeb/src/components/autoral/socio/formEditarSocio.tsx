"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSocioHook } from "@/hooks/socio";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Trash, User } from "lucide-react";
import { SocioUpdate } from "@/model/socio/socio";
import { Dependente } from "@/model/dependente/dependente"; 

// Schema ajustado sem CPF/Endereço para dependentes
const dependenteSchema = z.object({
  id: z.number().optional(),
  numInscricao: z.string().min(1, "Obrigatório"),
  nome: z.string().min(1, "Obrigatório"),
  dataNascimento: z.string().min(1, "Obrigatória"),
  sexo: z.string().min(1, "Obrigatório"),
});

const socioSchema = z.object({
  numInscricao: z.string().min(1, "Obrigatório"),
  nome: z.string().min(3, "Mínimo 3 caracteres"),
  cpf: z.string().min(1, "Obrigatório"),
  endereco: z.string().min(1, "Obrigatório"),
  telefone: z.string().min(1, "Obrigatório"),
  dataNascimento: z.string().min(1, "Obrigatória"),
  sexo: z.string().min(1, "Obrigatório"),
  dependentes: z.array(dependenteSchema).max(3, "Máximo de 3 dependentes")
});

interface FormEditarSocioProps {
  id: string;
}

export function FormEditarSocio({ id }: FormEditarSocioProps) {
  const { editarSocio, buscarSocioPorId } = useSocioHook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof socioSchema>>({
    resolver: zodResolver(socioSchema),
    defaultValues: {
      numInscricao: "",
      nome: "",
      cpf: "",
      endereco: "",
      telefone: "",
      dataNascimento: "",
      sexo: "",
      dependentes: []
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "dependentes",
  });

  useEffect(() => {
    const carregarDados = async () => {
      if (id) {
        const socioData = await buscarSocioPorId(Number(id));
        if (socioData) {
          // Preenche dados do Sócio
          form.setValue("nome", socioData.nome);
          form.setValue("numInscricao", socioData.numInscricao);
          form.setValue("cpf", socioData.cpf);
          form.setValue("endereco", socioData.endereco);
          form.setValue("telefone", socioData.telefone);

          // Formata data do sócio
          const dataSocio = socioData.dataNascimento
            ? new Date(socioData.dataNascimento).toISOString().split("T")[0]
            : "";
          form.setValue("dataNascimento", dataSocio);

          form.setValue("sexo", socioData.sexo);

          // Preenche dependentes
          if (socioData.dependentes && socioData.dependentes.length > 0) {
            replace(socioData.dependentes.map((dep: Dependente) => ({
              id: dep.id,
              numInscricao: dep.numInscricao,
              nome: dep.nome,
              // Formata data do dependente
              dataNascimento: dep.dataNascimento
                ? new Date(dep.dataNascimento).toISOString().split("T")[0]
                : "",
              sexo: dep.sexo,
            })));
          }
        }
      }
    };
    carregarDados();
  }, [id, buscarSocioPorId, form, replace]);

  async function onSubmit(values: z.infer<typeof socioSchema>) {
    setLoading(true);
    try {
      const payload: SocioUpdate = {
        id: Number(id),
        ...values,
        dependentes: values.dependentes
      };

      await editarSocio(Number(id), payload);
      router.push("/socio");
    } catch (error) {
      console.error("Erro ao editar sócio:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Card do Sócio */}
        <div className="bg-white p-6 rounded-md shadow border">
          <h2 className="text-xl font-bold text-[#10476E] mb-4 flex items-center gap-2">
            <User /> Editar Sócio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="numInscricao" render={({ field }) => (
              <FormItem>
                <FormLabel>Nº Inscrição</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem className="col-span-2"><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="cpf" render={({ field }) => (
              <FormItem><FormLabel>CPF</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="dataNascimento" render={({ field }) => (
              <FormItem><FormLabel>Data Nasc.</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="sexo" render={({ field }) => (
              <FormItem><FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="telefone" render={({ field }) => (
              <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="endereco" render={({ field }) => (
              <FormItem className="col-span-2"><FormLabel>Endereço</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        {/* Card dos Dependentes */}
        <div className="bg-gray-50 p-6 rounded-md shadow border border-dashed border-gray-400">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Dependentes ({fields.length}/3)</h3>
            {fields.length < 3 && (
              <Button type="button" variant="outline" onClick={() => append({ numInscricao: "", nome: "", dataNascimento: "", sexo: "" })} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            )}
          </div>

          {/* Lista de Dependentes */}
          {fields.map((field, index) => (
            <div key={field.id} className="relative bg-white p-4 mb-4 rounded border border-gray-200 shadow-sm">
              <div className="absolute top-2 right-2">
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormField control={form.control} name={`dependentes.${index}.nome`} render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel className="text-xs">Nome</FormLabel><FormControl><Input className="h-8 text-sm" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                {/* ------ Alteração Aqui ------ */}
                <FormField control={form.control} name={`dependentes.${index}.numInscricao`} render={({ field }) => {
                   // Verifica se o dependente já tem um ID (veio do backend), se sim, desabilita.
                   const isExisting = !!form.getValues(`dependentes.${index}.id`);
                   return (
                      <FormItem>
                        <FormLabel className="text-xs">Inscrição</FormLabel>
                        <FormControl>
                          <Input 
                            className={`h-8 text-sm ${isExisting ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} 
                            {...field} 
                            disabled={isExisting} // Desabilita se já existir
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                   );
                }} />
                {/* --------------------------- */}

                <FormField control={form.control} name={`dependentes.${index}.dataNascimento`} render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">Data Nasc.</FormLabel><FormControl><Input type="date" className="h-8 text-sm" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`dependentes.${index}.sexo`} render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem></SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          ))}
          {fields.length === 0 && <p className="text-center text-gray-400 italic py-4">Nenhum dependente vinculado.</p>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => router.push("/socio")}>Cancelar</Button>
          <Button type="submit" className="bg-[#10476E]" disabled={loading}>{loading ? "Salvando..." : "Salvar Alterações"}</Button>
        </div>
      </form>
    </Form>
  );
}