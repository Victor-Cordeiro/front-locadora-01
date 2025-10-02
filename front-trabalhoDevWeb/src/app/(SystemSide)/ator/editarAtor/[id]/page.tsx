"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtorHook } from "@/hooks/ator"; 
import { FormEditarAtor } from "@/components/autoral/ator/formEditarAtor";

export default function EditarAtor() {
  const params = useParams(); 
  const router = useRouter();

  const id = params?.id as string; 

  const { ator, buscarAtorPorId } = useAtorHook(); 

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          await buscarAtorPorId(Number(id)); 
        } catch (error) {
          console.error("Erro ao buscar ator:", error);
          alert("Ator não encontrado ou ocorreu um erro.");
          router.push("/ator"); 
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

  if (!ator) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p>Ator não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      <FormEditarAtor atorId={id} /> {}
    </div>
  );
}
