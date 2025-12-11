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
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTituloHook } from "@/hooks/titulo";

const formSchema = z.object({
    numSerie: z.string().min(1, { message: "Número de série é obrigatório" }),
    dtAquisicao: z.string().min(1, { message: "Data de aquisição é obrigatória" }),
    tipoItem: z.string().min(1, { message: "Tipo de item é obrigatório" }),
    titulo: z.string().min(1, { message: "Título é obrigatório" }),
});

interface FormEditarItemProps {
    id: number;
}

export function FormEditarItem({ id }: FormEditarItemProps) {
    const { item, buscarItemPorId, editarItem } = useItemHook();
    const { titulos, listarTitulos } = useTituloHook();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numSerie: "",
            dtAquisicao: "",
            tipoItem: "",
            titulo: "",
        },
    });

    useEffect(() => {
        listarTitulos();
        if (id) {
            buscarItemPorId(id).then((data) => {
                if (data) {
                    form.setValue("numSerie", data.numSerie);
                    form.setValue("dtAquisicao", new Date(data.dtAquisicao).toISOString().split("T")[0]);
                    form.setValue("tipoItem", data.tipoItem);
                    
                    // LÓGICA CORRIGIDA: Usa o ID direto se vier, senão tenta pegar do objeto
                    const idTitulo = data.tituloId || data.titulo?.id;
                    if (idTitulo) {
                        form.setValue("titulo", String(idTitulo));
                    }
                }
            });
        }
    }, [id, buscarItemPorId, form, listarTitulos]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (loading) return;
        setLoading(true);
        try {
            const itemRequest = {
                ...values,
                titulo: Number(values.titulo),
            };
            await editarItem(id, itemRequest);
            router.push("/item");
        } finally {
            setLoading(false);
        }
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                        onClick={() => router.push("/item")}
                        className="bg-gray-400 text-white px-6 py-2 rounded-md shadow"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Form>
    );
}