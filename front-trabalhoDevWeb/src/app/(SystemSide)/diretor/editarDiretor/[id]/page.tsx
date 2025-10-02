"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDiretorHook } from "@/hooks/diretor"; 
import { FormEditarDiretor } from "@/components/autoral/diretor/formEditarDiretor";

export default function EditarDiretor() {
  const params = useParams(); 
  const router = useRouter();

  const id = params?.id as string; 

  const { diretor, buscarDiretorPorId } = useDiretorHook(); 

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          await buscarDiretorPorId(Number(id)); 
        } catch (error) {
          console.error("Erro ao buscar diretor:", error);
          alert("Diretor não encontrado ou ocorreu um erro.");
          router.push("/diretor"); 
        } finally {
          setIsLoading(false); 
        }
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!diretor) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p>Diretor não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      <FormEditarDiretor diretorId={id} /> {}
    </div>
  );
}
