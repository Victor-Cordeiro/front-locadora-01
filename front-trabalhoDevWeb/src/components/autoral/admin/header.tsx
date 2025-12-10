"use client";
import Link from "next/link";
import { LogOut, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="bg-[#10476E] text-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl hover:text-gray-200 transition">
            <LayoutGrid size={24} />
            <span>Painel Administrativo</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-right hidden md:block">
            <p className="font-semibold">Funcionário</p>
            <p className="text-xs text-blue-200">Logado</p>
        </div>
        <Link href="/">
            <Button variant="destructive" size="sm" className="gap-2 bg-red-600 hover:bg-red-700">
                <LogOut size={16} /> Sair / Voltar ao Site
            </Button>
        </Link>
      </div>
    </header>
  );
}