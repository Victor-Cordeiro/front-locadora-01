"use client";
import Sidebar from "@/components/autoral/sidebar/sidebar";
import { useEffect, useState } from "react";
import { useAtorHook } from "@/hooks/ator";
import { useClasseHook } from "@/hooks/classe";
import { useDiretorHook } from "@/hooks/diretor";

export default function Home() {
  // Hooks das entidades

  return (
    <div className="-m-6 flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-10 py-12 bg-[#f1f5ff]"> {/* Fundo claro e suave */}
        <div className="flex justify-start items-start flex-col gap-10 max-w-5xl mx-auto">
          {/* Dashboard Resumo */}
          <div className="w-full max-w-5xl grid gap-6 sm:grid-cols-3 mt-2">
            <div className="rounded-xl p-5 bg-gradient-to-br from-[#5f6368] to-[#37474f] text-white shadow-md hover:scale-[1.02] transition">
              <p className="text-sm uppercase tracking-wide text-white/70">Atores</p>
              <p className="text-4xl font-bold mt-2">14</p>
              <span className="text-xs text-white/60 mt-1 inline-block">Total cadastrados</span>
            </div>
            <div className="rounded-xl p-5 bg-gradient-to-br from-[#283593] to-[#1c2370] text-white shadow-md hover:scale-[1.02] transition">
              <p className="text-sm uppercase tracking-wide text-white/70">Classes</p>
              <p className="text-4xl font-bold mt-2">12</p>
              <span className="text-xs text-white/60 mt-1 inline-block">Total cadastradas</span>
            </div>
            <div className="rounded-xl p-5 bg-gradient-to-br from-[#f29c11] to-[#d17d0b] text-white shadow-md hover:scale-[1.02] transition">
              <p className="text-sm uppercase tracking-wide text-white/80">Diretores</p>
              <p className="text-4xl font-bold mt-2">10</p>
              <span className="text-xs text-white/80 mt-1 inline-block">Total cadastrados</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-extrabold text-[#0a2c5b]"> {/* Azul escuro para o título */}
            Bem-vindo ao Sistema de Locação
          </h1>

          {/* Texto descritivo */}
          <p className="text-lg text-[#37474f] leading-relaxed max-w-2xl">
            Gerencie seus produtos de forma simples e eficaz. Controle locações, acompanhe status e tenha
            visibilidade total do estoque. Utilize o menu lateral para acessar as funcionalidades.
          </p>
        </div>
      </main>
    </div>
  );
}
