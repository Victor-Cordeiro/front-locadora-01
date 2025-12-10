"use client";
import Link from "next/link";
import { 
  Users, 
  Clapperboard, 
  Film, 
  UserCog, 
  Shapes, 
  CreditCard, 
  Baby, 
  LogOut 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  
  const menuItems = [
    { 
      title: "Sócios", 
      icon: <Users size={40} />, 
      href: "/socio", 
      desc: "Gerenciar sócios e inscrições",
      color: "border-l-blue-600 text-blue-700 hover:bg-blue-50"
    },
    { 
      title: "Dependentes", 
      icon: <Baby size={40} />, 
      href: "/dependente", 
      desc: "Gerenciar dependentes vinculados",
      color: "border-l-cyan-500 text-cyan-700 hover:bg-cyan-50"
    },
    { 
      title: "Títulos", 
      icon: <Clapperboard size={40} />, 
      href: "/titulo", 
      desc: "Catálogo de filmes e séries",
      color: "border-l-purple-600 text-purple-700 hover:bg-purple-50"
    },
    { 
      title: "Itens (Estoque)", 
      icon: <Film size={40} />, 
      href: "/item", 
      desc: "Controle de fitas/DVDs físicos",
      color: "border-l-indigo-600 text-indigo-700 hover:bg-indigo-50"
    },
    { 
      title: "Locações", 
      icon: <CreditCard size={40} />, 
      href: "/locacao", 
      desc: "Registrar saídas e devoluções",
      color: "border-l-green-600 text-green-700 hover:bg-green-50"
    },
    { 
      title: "Atores", 
      icon: <UserCog size={40} />, 
      href: "/ator", 
      desc: "Cadastro de elenco",
      color: "border-l-orange-500 text-orange-700 hover:bg-orange-50"
    },
    { 
      title: "Diretores", 
      icon: <UserCog size={40} />, 
      href: "/diretor", 
      desc: "Cadastro de diretores",
      color: "border-l-red-500 text-red-700 hover:bg-red-50"
    },
    { 
      title: "Classes", 
      icon: <Shapes size={40} />, 
      href: "/classe", 
      desc: "Preços e prazos de devolução",
      color: "border-l-yellow-500 text-yellow-700 hover:bg-yellow-50"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#10476E]">Painel de Controle</h1>
        <p className="text-gray-500">Selecione um módulo para gerenciar o sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.title} className="group">
            <Card className={`h-full border-l-8 shadow-sm hover:shadow-md transition-all duration-300 ${item.color}`}>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="pt-10 border-t border-gray-200 mt-10">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#10476E] transition-colors">
            <LogOut className="mr-2" size={20} />
            Voltar para a Área do Cliente
        </Link>
      </div>
    </div>
  );
}