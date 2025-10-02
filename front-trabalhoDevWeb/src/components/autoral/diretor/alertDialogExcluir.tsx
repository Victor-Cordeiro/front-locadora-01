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

import { CircleCheck, CircleX, Trash2, X } from "lucide-react";

interface AlertDialogProps {
  id: string;  // Passando apenas o ID do diretor para deletar
  onDelete: (id: string) => void; // Função que será chamada ao confirmar a exclusão
}

export function AlertDialogExcluir({ id, onDelete }: AlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="cursor-pointer" style={{ width: "22px", height: "22px", color: "#1b254f" }} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex justify-between items-start">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Diretor</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogCancel asChild>
            <button className="text-gray-500 hover:text-gray-700 border-none">
              <X className="w-5 h-5" />
            </button>
          </AlertDialogCancel>
        </div>
        <AlertDialogDescription className="mt-4 text-bold">
          Tem certeza que deseja excluir este Diretor?
        </AlertDialogDescription>
        <AlertDialogFooter className="space-x-2 mt-4">
          <AlertDialogAction
            className="bg-[#005490] text-white"
            onClick={() => onDelete(id)} // Chama a função de exclusão
          >
            <CircleCheck /> Confirmar
          </AlertDialogAction>
          <AlertDialogCancel className="bg-gray-500 text-white">
            <CircleX /> Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
