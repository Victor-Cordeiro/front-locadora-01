"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useDependenteHook } from "@/hooks/dependente";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

const formSchema = z.object({
  numInscricao: z.string().min(1, "Obrigatório"),
  nome: z.string().min(1, "Obrigatório"),
  dataNascimento: z.string().min(1, "Obrigatória"),
  sexo: z.string().min(1, "Obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
});

interface Props {
  id: string;
}

export function FormEditarDependente({ id }: Props) {
  const { editarDependente, buscarDependentePorId } = useDependenteHook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numInscricao: "",
      nome: "",
      cpf: "",
      endereco: "",
      telefone: "",
      dataNascimento: "",
      sexo: "",
    },
  });

  useEffect(() => {
    async function carregar() {
      if (id) {
        const data = await buscarDependentePorId(Number(id));
        if (data) {
          form.reset({
            numInscricao: data.numInscricao,
            nome: data.nome,
            cpf: data.cpf,
            endereco: data.endereco,
            telefone: data.telefone,
            dataNascimento: data.dataNascimento,
            sexo: data.sexo,
          });
        }
      }
    }
    carregar();
  }, [id, buscarDependentePorId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const data = {
        ...values,
        id: Number(id),
        endereco: values.endereco || "",
        telefone: values.telefone || "",
      };
      await editarDependente(Number(id), data);
      router.push("/dependente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-md shadow border">
          <h2 className="text-lg font-bold text-[#10476E] mb-4 flex items-center gap-2">
            <User /> Editar Dependente
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <FormField
              control={form.control}
              name="numInscricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº Inscrição</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled 
                      className="bg-gray-100 text-gray-500 cursor-not-allowed" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        
    

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Nasc.</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dependente")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#10476E]"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}