"use client";

import { CircleUserRound, ShieldUser, ChevronDown, LogOut, MapPinned, Eye, Building2, House, ClipboardMinus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    // Lógica de logout
  };

  return (
    <aside className="bg-gradient-to-b from-[#1f35c1] to-[#3a4fa5] fixed top-0 left-0 w-64 h-screen text-white flex flex-col shadow-lg">
      {/* Scroll interno da sidebar */}
      <div className="flex-1 overflow-y-auto p-5 pt-10 space-y-6 sidebar-scroll">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo Sidebar"
            width={150}
            height={150}
            className="cursor-pointer rounded-full mx-auto mb-8"
          />
        </Link>

        {/* Menu Links */}
        <div className="space-y-4">
          <span className="text-blue-50-800">Servidor acessado: {serverName}</span>
          <Link href="/ator" className="flex gap-3 items-center text-lg font-semibold hover:text-[#5acbff] hover:bg-[#1c2b5b] p-3 rounded-md transition duration-300">
            <CircleUserRound />
            <span>Ator</span>
          </Link>

          <Link href="/classe" className="flex gap-3 items-center text-lg font-semibold hover:text-[#5acbff] hover:bg-[#1c2b5b] p-3 rounded-md transition duration-300">
            <ShieldUser />
            <span>Classe</span>
          </Link>

          <Link href="/diretor" className="flex gap-3 items-center text-lg font-semibold hover:text-[#5acbff] hover:bg-[#1c2b5b] p-3 rounded-md transition duration-300">
            <CircleUserRound />
            <span>Diretor</span>
          </Link>

        </div>
      </div>

      {/* Rodapé com informações do perfil */}
      <div className="border-t border-white/20 p-5 mt-auto">
        <div className="flex items-center gap-3">
          <CircleUserRound className="text-lg" />
          <div>
            <p className="text-sm font-semibold">Administrador</p>
            <p className="text-xs text-white/70">Perfil</p>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-4 flex items-center justify-between">
          <button 
            onClick={handleLogout} 
            className="text-sm text-red-500 hover:bg-red-600 hover:text-white p-2 rounded-md transition duration-300"
          >
            <LogOut className="inline-block mr-2" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
