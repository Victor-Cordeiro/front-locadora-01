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
import { useEffect } from "react";

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
    const tituloToCreate = {
      ...values,
      classe: Number(values.classe),
      diretor: Number(values.diretor),
    };
    await criarTitulo(tituloToCreate);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input placeholder="Ano de lançamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sinopse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sinopse</FormLabel>
              <FormControl>
                <Input placeholder="Sinopse do título" {...field} />
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
                <Input placeholder="Categoria do título" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma classe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes?.map((classe) => (
                    <SelectItem key={classe.id} value={classe.id.toString()}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um diretor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {diretores?.map((diretor) => (
                    <SelectItem key={diretor.id} value={diretor.id.toString()}>
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
            <FormItem>
              <div className="mb-4">
                <FormLabel>Atores</FormLabel>
              </div>
              {atores?.map((ator) => (
                <FormField
                  key={ator.id}
                  control={form.control}
                  name="atores"
                  render={({ field }) => {
                    return (
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
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
