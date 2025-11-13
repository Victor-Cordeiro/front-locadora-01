import { Diretor, DiretorArray, DiretorCreate, DiretorUpdate } from "@/model/diretor/diretor";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useDiretorHook = () => {
  const [diretores, setDiretores] = useState<DiretorArray | null>(null);
  const [diretor, setDiretor] = useState<Diretor | null>(null);

  // Criar diretor (Create)
  const criarDiretor = useCallback(async (diretor: DiretorCreate) => {
    try {
      await api.post(`diretores/salvarDiretor`, diretor);
      toast.success("Diretor criado com sucesso!!!");
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

  // Editar diretor (Update)
  const editarDiretor = useCallback(async (diretor: DiretorUpdate) => {
    try {
      await api.put(`diretores/${diretor.id}/editarDiretor`, diretor);
      toast.success("Diretor editado com sucesso!");
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

  // Listar todos os diretores
  const listarDiretores = useCallback(async () => {
    try {
      const response = await api.get(`diretores/listarDiretores`);
      setDiretores(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar diretores";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  const deletarDiretor = useCallback(async (id: number) => {
    try {
      await api.delete(`diretores/deletarDiretor/${id}`);
      toast.success("Diretor deletado com sucesso!!!");
      await listarDiretores(); // Recarregar a lista após deletar
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
  }, [listarDiretores]);

  // Buscar diretor por ID
  const buscarDiretorPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`diretores/${id}/buscarDiretorPorId`);
      setDiretor(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar o diretor";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  return {
    diretores,
    diretor,
    criarDiretor,
    editarDiretor,
    deletarDiretor,
    listarDiretores,
    buscarDiretorPorId,
  };
};
