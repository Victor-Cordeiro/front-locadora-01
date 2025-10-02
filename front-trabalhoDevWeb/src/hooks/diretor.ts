import { Diretor, DiretorArray, DiretorCreate, DiretorUpdate } from "@/model/diretor/diretor";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const useDiretorHook = () => {
  const [diretores, setDiretores] = useState<DiretorArray | null>(null);
  const [diretor, setDiretor] = useState<Diretor | null>(null);

  // Criar diretor (Create)
  const criarDiretor = async (diretor: DiretorCreate) => {
    try {
      await api.post(`diretores/salvarDiretor`, diretor);
      toast.success("Diretor criado com sucesso!!!");
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

  // Editar diretor (Update)
  const editarDiretor = async (diretor: DiretorUpdate) => {
    try {
      const response = await api.put(`diretores/editarDiretor`, diretor);
      setDiretor(response.data);
      toast.success("Diretor editado com sucesso!!!");
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

  // Deletar diretor (Delete)
  const deletarDiretor = async (id: number) => {
    try {
      await api.delete(`diretores/deletarDiretor/${id}`);
      toast.success("Diretor deletado com sucesso!!!");
      listarDiretores();  // Recarregar a lista após deletar
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

  // Listar todos os diretores
  const listarDiretores = async () => {
    try {
      const response = await api.get(`diretores/listarDiretores`);
      setDiretores(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar diretores";
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

  // Buscar diretor por ID
  const buscarDiretorPorId = async (id: number) => {
    try {
      const response = await api.get(`diretores/buscarDiretor/${id}`);
      setDiretor(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar diretor";
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
    diretores,
    diretor,
    criarDiretor,
    editarDiretor,
    deletarDiretor,
    listarDiretores,
    buscarDiretorPorId,
  };
};
