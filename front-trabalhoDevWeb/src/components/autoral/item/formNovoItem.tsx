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
import { useItemHook } from "@/hooks/item";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTituloHook } from "@/hooks/titulo";
import { useEffect } from "react";

const formSchema = z.object({
    numSerie: z.string().min(1, { message: "Número de série é obrigatório" }),
    dtAquisicao: z.string().min(1, { message: "Data de aquisição é obrigatória" }),
    tipoItem: z.string().min(1, { message: "Tipo de item é obrigatório" }),
    titulo: z.string().min(1, { message: "Título é obrigatório" }),
});

export function FormNovoItem() {
    const { criarItem } = useItemHook();
    const { titulos, listarTitulos } = useTituloHook();
    const router = useRouter();

    useEffect(() => {
        listarTitulos();
    }, [listarTitulos]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numSerie: "",
            dtAquisicao: "",
            tipoItem: "",
            titulo: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const itemRequest = {
            ...values,
            titulo: Number(values.titulo),
        };
        await criarItem(itemRequest);
        router.push("/item");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="numSerie"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Série</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o número de série" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dtAquisicao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Aquisição</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tipoItem"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Item</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o tipo de item" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um título" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {titulos?.map((titulo) => (
                                        <SelectItem key={titulo.id} value={String(titulo.id)}>
                                            {titulo.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Salvar</Button>
            </form>
        </Form>
    );
}
