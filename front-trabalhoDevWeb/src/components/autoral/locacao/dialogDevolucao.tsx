"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocacaoHook } from "@/hooks/locacao";
import { RefreshCcw } from "lucide-react";

export function DialogDevolucao() {
    const [numSerie, setNumSerie] = useState("");
    const [open, setOpen] = useState(false);
    const { realizarDevolucao } = useLocacaoHook();

    const handleDevolver = async () => {
        if(!numSerie) return;
        await realizarDevolucao(numSerie);
        setOpen(false);
        setNumSerie("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-md">
                    <RefreshCcw size={16}/> Devolver Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Devolução</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="numSerie">Número de Série do Item</Label>
                        <Input 
                            id="numSerie" 
                            value={numSerie} 
                            onChange={(e) => setNumSerie(e.target.value)} 
                            placeholder="Digite ou bipe o código..."
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDevolver} disabled={!numSerie} className="bg-green-600 hover:bg-green-700">Confirmar Devolução</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}