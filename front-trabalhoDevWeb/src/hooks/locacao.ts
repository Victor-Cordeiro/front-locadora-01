import { Locacao, LocacaoArray, LocacaoCreate, LocacaoUpdate } from "@/model/locacao/locacao";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useLocacaoHook = () => {
  const [locacoes, setLocacoes] = useState<LocacaoArray | null>(null);
  const [locacao, setLocacao] = useState<Locacao | null>(null);

  const listarLocacoes = useCallback(async () => {
    try {
      const response = await api.get(`locacoes/listarLocacoes`);
      setLocacoes(response.data);
    } catch (error) {
      console.error("Erro de listagem", error);
      toast.error("Erro ao carregar locações");
    }
  }, []);

  // NOVO: Busca apenas locações que ainda não foram devolvidas
  // Usado no Dialog de Devolução para facilitar a busca
  const listarLocacoesPendentes = useCallback(async () => {
    try {
        const response = await api.get(`locacoes/pendentes`);
        return response.data as LocacaoArray;
    } catch (error) {
        console.error("Erro ao listar pendentes", error);
        return [];
    }
  }, []);

  const criarLocacao = async (dados: LocacaoCreate): Promise<void> => {
    try {
      await api.post(`locacoes/salvarLocacao`, dados);
      toast.success("Locação realizada com sucesso!");
    } catch (error) {
        tratarErro(error);
    }
  };

  const editarLocacao = useCallback(async (id: number, dados: LocacaoUpdate) => {
    try {
      await api.put(`locacoes/${id}/editarLocacao`, dados);
      toast.success("Locação atualizada com sucesso!");
    } catch (error) {
        tratarErro(error);
    }
  }, []);

  const deletarLocacao = useCallback(async (id: number) => {
    try {
      await api.delete(`locacoes/${id}`);
      toast.success("Locação excluída com sucesso!");
      await listarLocacoes();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarLocacoes]);

  const realizarDevolucao = useCallback(async (numSerie: string) => {
    try {
        const response = await api.put(`locacoes/${numSerie}/devolver`);
        toast.success(`Devolução do item ${numSerie} registrada!`);
        await listarLocacoes(); 
        return response.data;
    } catch (error) {
        tratarErro(error);
        throw error;
    }
  }, [listarLocacoes]);

  const buscarLocacaoPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`locacoes/buscarLocacao/${id}`);
      setLocacao(response.data);
      return response.data;
    } catch (error) {
        tratarErro(error);
    }
  }, []);

  const tratarErro = (error: unknown) => {
    const axiosError = error as AxiosError;
    let mensagem = "Ocorreu um erro inesperado";
    if (axiosError.response?.data) {
        // Tenta pegar a mensagem de erro do objeto de erro padrão ou customizado
        const data = axiosError.response.data as { message?: string; error?: string };
        mensagem = data.message || data.error || JSON.stringify(data);
    }
    toast.error(mensagem);
  };

  return {
    locacoes,
    locacao,
    criarLocacao,
    editarLocacao,
    deletarLocacao,
    realizarDevolucao,
    listarLocacoes,
    listarLocacoesPendentes,
    buscarLocacaoPorId
  };
};