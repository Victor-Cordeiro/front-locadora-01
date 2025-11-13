import { Item, ItemRequest } from "@/model/item/item";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useItemHook = () => {
  const [itens, setItens] = useState<Item[] | null>(null);
  const [item, setItem] = useState<Item | null>(null);

  const criarItem = useCallback(async (item: ItemRequest) => {
    try {
      await api.post(`itens/salvarItem`, item);
      toast.success("Item criado com sucesso!!!");
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

  const editarItem = useCallback(async (id: number, item: ItemRequest) => {
    try {
      await api.put(`itens/${id}/editarItem`, item);
      toast.success("Item editado com sucesso!");
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

  const listarItens = useCallback(async () => {
    try {
      const response = await api.get(`itens/listarItens`);
      setItens(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao listar itens";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  const deletarItem = useCallback(async (id: number) => {
    try {
      await api.delete(`itens/deletarItem/${id}`);
      toast.success("Item deletado com sucesso!!!");
      await listarItens();
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
  }, [listarItens]);

  const buscarItemPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`itens/buscarItem/${id}`);
      setItem(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let mensagem = "Erro ao buscar o item";
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        mensagem = errorData.message;
      }
      toast.error(mensagem);
      throw error;
    }
  }, []);

  return {
    item,
    itens,
    criarItem,
    editarItem,
    listarItens,
    deletarItem,
    buscarItemPorId,
  };
};
