"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTituloHook } from "@/hooks/titulo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClasseHook } from "@/hooks/classe";
import { useDiretorHook } from "@/hooks/diretor";
import { useAtorHook } from "@/hooks/ator";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do título é obrigatório." }),
  ano: z.string().min(4, { message: "O ano deve ter 4 dígitos." }).max(4),
  sinopse: z.string().min(1, { message: "A sinopse é obrigatória." }),
  categoria: z.string().min(1, { message: "A categoria é obrigatória." }),
  classe: z.string().min(1, { message: "A classe é obrigatória." }),
  diretor: z.string().min(1, { message: "O diretor é obrigatório." }),
  atores: z.array(z.number()).min(1, { message: "Selecione ao menos um ator." }),
});

export function FormNovoTitulo() {
  const { criarTitulo } = useTituloHook();
  const { classes, listarClasses } = useClasseHook();
  const { diretores, listarDiretores } = useDiretorHook();
  const { atores, listarAtores } = useAtorHook();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listarClasses();
    listarDiretores();
    listarAtores();
  }, [listarClasses, listarDiretores, listarAtores]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      ano: "",
      sinopse: "",
      categoria: "",
      classe: "",
      diretor: "",
      atores: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) return;
    setLoading(true);
    try {
      const tituloToCreate = {
        ...values,
        classe: Number(values.classe),
        diretor: Number(values.diretor),
      };
      await criarTitulo(tituloToCreate);
      router.push("/titulo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full p-6 bg-white rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Título</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Título" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input placeholder="Ano" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sinopse"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Sinopse</FormLabel>
                <FormControl>
                  <Input placeholder="Sinopse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Categoria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classe</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma classe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes?.map((classe) => (
                      <SelectItem key={classe.id} value={String(classe.id)}>
                        {classe.nome}
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
            name="diretor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diretor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um diretor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {diretores?.map((diretor) => (
                      <SelectItem key={diretor.id} value={String(diretor.id)}>
                        {diretor.nome}
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
            name="atores"
            render={() => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Atores</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-4 border rounded-md">
                  {atores?.map((ator) => (
                    <FormField
                      key={ator.id}
                      control={form.control}
                      name="atores"
                      render={({ field }) => (
                        <FormItem
                          key={ator.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(ator.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, ator.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== ator.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {ator.nome}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Botões */}
        <div className="flex justify-end gap-3 mb-6 mt-19">
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-[#10476E] text-white px-6 py-2 rounded-md shadow"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/titulo")}
            className="bg-gray-400 text-white px-6 py-2 rounded-md shadow"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Form>
  );
}
