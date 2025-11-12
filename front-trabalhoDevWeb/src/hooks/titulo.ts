import { Titulo, TituloArray, TituloCreate, TituloUpdate } from "@/model/titulo/titulo";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useTituloHook = () => {
  const [titulos, setTitulos] = useState<TituloArray | null>(null);
  const [titulo, setTitulo] = useState<Titulo | null>(null);

  const criarTitulo = useCallback(async (titulo: TituloCreate) => {
    try {
      await api.post(`titulos/salvarTitulo`, titulo);
      toast.success("Título criado com sucesso!");
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

  const editarTitulo = useCallback(async (id: number, titulo: TituloUpdate) => {
    try {
      const response = await api.put(`titulos/${id}/editarTitulo`, titulo);
      setTitulo(response.data);
      toast.success("Título editado com sucesso!");
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

  const listarTitulos = useCallback(async () => {
    try {
      const response = await api.get(`titulos/listarTitulos`);
      setTitulos(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar títulos";
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

  const deletarTitulo = useCallback(async (id: number) => {
    try {
      await api.delete(`titulos/deletarTitulo/${id}`);
      toast.success("Título deletado com sucesso!");
      await listarTitulos();
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
  }, [listarTitulos]);

  const buscarTituloPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`titulos/buscarTitulo/${id}`);
      setTitulo(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar título";
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
    titulos,
    titulo,
    criarTitulo,
    editarTitulo,
    deletarTitulo,
    listarTitulos,
    buscarTituloPorId,
  };
};
