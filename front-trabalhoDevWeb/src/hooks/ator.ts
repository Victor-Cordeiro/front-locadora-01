import { Ator, AtorArray, AtorCreate, AtorUpdate } from "@/model/ator/ator";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const useAtorHook = () => {
  const [atores, setAtores] = useState<AtorArray | null>(null);
  const [ator, setAtor] = useState<Ator | null>(null);

  // Criar ator (Create)
  const criarAtor = async (ator: AtorCreate) => {
    try {
      await api.post(`atores/salvarAtor`, ator);
      toast.success("Ator criado com sucesso!!!");
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
  };

  // Editar ator (Update)
  const editarAtor = async (ator: AtorUpdate) => {
    try {
      const response = await api.put(`atores/editarAtor`, ator);
      setAtor(response.data);
      toast.success("Ator editado com sucesso!!!");
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
  };

  // Deletar ator (Delete)
  const deletarAtor = async (id: number) => {
    try {
      await api.delete(`atores/deletarAtor/${id}`);
      toast.success("Ator deletado com sucesso!!!");
      listarAtores();  // Recarregar a lista após deletar
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
  };

  // Listar todos os atores
  const listarAtores = async () => {
    try {
      const response = await api.get(`atores/listarAtores`);
      setAtores(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar atores";
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
  };

  // Buscar ator por ID
  const buscarAtorPorId = async (id: number) => {
    try {
      const response = await api.get(`atores/buscarAtor/${id}`);
      setAtor(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar ator";
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
  };

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
