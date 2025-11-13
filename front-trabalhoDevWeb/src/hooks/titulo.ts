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
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  const editarTitulo = useCallback(async (id: number, titulo: TituloUpdate) => {
    try {
      // Volta para o padrão dos outros recursos: PUT /titulos/{id}/editarTitulo
      // O POST em /titulos/salvarTitulo sempre cria um novo registro (não faz upsert),
      // causando duplicação ao invés de atualização.
      const response = await api.put(`titulos/${id}/editarTitulo`, titulo);
      setTitulo(response.data);
      toast.success("Título editado com sucesso!");
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

  const listarTitulos = useCallback(async () => {
    try {
      const response = await api.get(`titulos/listarTitulos`);
      setTitulos(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar títulos";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  const deletarTitulo = useCallback(async (id: number) => {
    const tryDelete = async (url: string) => {
      await api.delete(url);
    };

    try {
      await tryDelete(`titulos/deletarTitulo/${id}`);
      toast.success("Título deletado com sucesso!");
      await listarTitulos();
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      // Fallback: alguns backends usam a rota no formato 
      // titulos/{id}/deletarTitulo
      if (axiosError.response?.status === 400 || axiosError.response?.status === 404) {
        try {
          await tryDelete(`titulos/${id}/deletarTitulo`);
          toast.success("Título deletado com sucesso!");
          await listarTitulos();
          return;
        } catch (fallbackError) {
          const ax2 = fallbackError as AxiosError<any>;
          let mensagem = "Erro ao deletar título";
          if (ax2.response?.data) {
            const data = ax2.response.data as { message?: string };
            if (data?.message) mensagem = data.message;
          }
          if (ax2.response?.status === 400 || ax2.response?.status === 409) {
            // Provável violação de integridade referencial (itens vinculados)
            if (!/vinculad|constraint|chave/i.test(mensagem)) {
              mensagem = "Não é possível excluir este título: existem itens vinculados a ele.";
            }
          }
          toast.error(mensagem);
          return;
        }
      }

      let mensagem = "Erro ao deletar título";
      if (axiosError.response?.data) {
        const data = axiosError.response.data as { message?: string };
        if (data?.message) mensagem = data.message;
      }
      if (axiosError.response?.status === 400 || axiosError.response?.status === 409) {
        if (!/vinculad|constraint|chave/i.test(mensagem)) {
          mensagem = "Não é possível excluir este título: existem itens vinculados a ele.";
        }
      }
      toast.error(mensagem);
    }
  }, [listarTitulos]);

  const buscarTituloPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`titulos/buscarTitulo/${id}`);
      setTitulo(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar o título";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
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
