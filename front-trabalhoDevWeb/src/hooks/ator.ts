import { Ator, AtorArray, AtorCreate, AtorUpdate } from "@/model/ator/ator";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useAtorHook = () => {
  const [atores, setAtores] = useState<AtorArray | null>(null);
  const [ator, setAtor] = useState<Ator | null>(null);

  // Criar ator (Create)
  const criarAtor = async (ator: AtorCreate): Promise<void> => {
    try {
      await api.post(`atores/salvarAtor`, ator);
      toast.success("Ator criado com sucesso!!!");
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro desconhecido";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  };

  // Editar ator (Update)
  const editarAtor = useCallback(async (ator: AtorUpdate) => {
    try {
      await api.put(`atores/${ator.id}/editarAtor`, ator);
      toast.success("Ator editado com sucesso!");
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro desconhecido";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  // Deletar ator (Delete)
  // Listar todos os atores
  const listarAtores = async () => {
    try {
      const response = await api.get(`atores/listarAtores`);
      setAtores(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar atores";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  };

  const deletarAtor = useCallback(async (id: number) => {
    try {
      await api.delete(`atores/deletarAtor/${id}`);
      toast.success("Ator deletado com sucesso!!!");
      await listarAtores(); // Recarregar a lista após deletar
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro desconhecido";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, [listarAtores]);

  // Buscar ator por ID
  const buscarAtorPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`atores/${id}/buscarAtorPorId`);
      setAtor(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar o ator";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  return {
    atores,
    ator,
    criarAtor,
    editarAtor,
    deletarAtor,
    listarAtores,
    buscarAtorPorId,
  };
};
