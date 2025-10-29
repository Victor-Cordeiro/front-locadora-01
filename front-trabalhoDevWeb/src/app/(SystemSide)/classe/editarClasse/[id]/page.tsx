"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClasseHook } from "@/hooks/classe"; 
import { FormEditarClasse } from "@/components/autoral/classe/formEditarClasse";

export default function EditarClasse() {
  const params = useParams(); 
  const router = useRouter();

  const id = params?.id as string; // Pegando o ID da classe na URL

  const { classe, buscarClassePorId } = useClasseHook(); // Hook para buscar classe

  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          await buscarClassePorId(Number(id)); // Buscar a classe pelo ID
        } catch (error) {
          console.error("Erro ao buscar classe:", error);
          alert("Classe não encontrada ou ocorreu um erro.");
          router.push("/classe"); // Redireciona para a lista de classes em caso de erro
        } finally {
          setIsLoading(false); // Finaliza o carregamento
        }
      }
    };
    fetchData();
  }, [id, buscarClassePorId, router]);

  // Exibe uma mensagem de carregamento enquanto os dados estão sendo carregados
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se a classe não for encontrada, exibe uma mensagem de erro
  if (!classe) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p>Classe não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* Passa o ID da classe para o formulário de edição */}
      <FormEditarClasse classeId={id} /> 
    </div>
  );
}
