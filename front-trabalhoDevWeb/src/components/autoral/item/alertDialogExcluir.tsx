"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useItemHook } from "@/hooks/item";
import { Trash2 } from "lucide-react";

interface AlertDialogExcluirProps {
    id: number;
}

export function AlertDialogExcluirItem({ id }: AlertDialogExcluirProps) {
    const { deletarItem } = useItemHook();

    const handleDelete = async () => {
        await deletarItem(id);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Trash2
                    className="cursor-pointer text-red-500"
                    style={{ width: 20, height: 20 }}
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso irá deletar
                        permanentemente o item.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
