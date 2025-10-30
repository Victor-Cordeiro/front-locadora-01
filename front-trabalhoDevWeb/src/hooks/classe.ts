import { Classe, ClasseArray, ClasseCreate, ClasseUpdate } from "@/model/classe/classe";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useClasseHook = () => {
  const [classes, setClasses] = useState<ClasseArray | null>(null);
  const [classe, setClasse] = useState<Classe | null>(null);

  // Criar classe (Create)
  const criarClasse = useCallback(async (classe: ClasseCreate) => {
    try {
      await api.post(`classes/salvarClasse`, classe);
      toast.success("Classe criada com sucesso!!!");
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro desconhecido";
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === "string") {
          mensagem = axiosError.response.data;
        } else if (typeof axiosError.response.data === "object") {
          const dataObj = axiosError.response.data as { error?: string };
          mensagem = dataObj.error || JSON.stringify(axiosError.response.data);
        }
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  // Editar classe (Update)
  const editarClasse = useCallback(async (classe: ClasseUpdate) => {
    try {
      const response = await api.put(`classes/editarClasse`, classe);
      setClasse(response.data);
      toast.success("Classe editada com sucesso!!!");
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro desconhecido";
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === "string") {
          mensagem = axiosError.response.data;
        } else if (typeof axiosError.response.data === "object") {
          const dataObj = axiosError.response.data as { error?: string };
          mensagem = dataObj.error || JSON.stringify(axiosError.response.data);
        }
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  // Listar todas as classes
  const listarClasses = useCallback(async () => {
    try {
      const response = await api.get(`classes/listarClasses`);
      setClasses(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar classes";
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === "string") {
          mensagem = axiosError.response.data;
        } else if (typeof axiosError.response.data === "object") {
          const dataObj = axiosError.response.data as { error?: string };
          mensagem = dataObj.error || JSON.stringify(axiosError.response.data);
        }
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  const deletarClasse = useCallback(async (id: number) => {
    try {
      await api.delete(`classes/deletarClasse/${id}`);
      toast.success("Classe deletada com sucesso!!!");
      await listarClasses(); // Recarregar a lista após deletar
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro desconhecido";
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === "string") {
          mensagem = axiosError.response.data;
        } else if (typeof axiosError.response.data === "object") {
          const dataObj = axiosError.response.data as { error?: string };
          mensagem = dataObj.error || JSON.stringify(axiosError.response.data);
        }
      }
      toast.error(mensagem);
      throw error;
    }
  }, [listarClasses]);

  // Buscar classe por ID
  const buscarClassePorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`classes/buscarclasse/${id}`);
      setClasse(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar classe";
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === "string") {
          mensagem = axiosError.response.data;
        } else if (typeof axiosError.response.data === "object") {
          const dataObj = axiosError.response.data as { error?: string };
          mensagem = dataObj.error || JSON.stringify(axiosError.response.data);
        }
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  return {
    classes,
    classe,
    criarClasse,
    editarClasse,
    deletarClasse,
    listarClasses,
    buscarClassePorId,  // Certifique-se de que a função seja exportada aqui
  };
};
