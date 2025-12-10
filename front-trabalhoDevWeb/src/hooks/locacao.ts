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
      // toast.error("Erro ao listar locações");
      console.error("Erro de listagem ou endpoint não implementado", error);
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

  // Função específica para Devolução por Número de Série (Regra de Negócio)
  const realizarDevolucao = useCallback(async (numSerie: string) => {
    try {
        const response = await api.put(`locacoes/${numSerie}/devolver`);
        toast.success(`Devolução do item ${numSerie} registrada!`);
        await listarLocacoes(); // Atualiza a lista
        return response.data;
    } catch (error) {
        tratarErro(error);
    }
  }, [listarLocacoes]);

  const buscarLocacaoPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`locacoes/buscarLocacao/${id}`); // Ajuste a rota se necessário
      setLocacao(response.data);
      return response.data;
    } catch (error) {
        // Fallback: tenta pegar da lista carregada se o endpoint de detalhe não existir
        if(locacoes) {
            const found = locacoes.find(l => l.id === id);
            if(found) return found;
        }
        tratarErro(error);
    }
  }, [locacoes]);

  const tratarErro = (error: unknown) => {
    const axiosError = error as AxiosError;
    let mensagem = "Ocorreu um erro inesperado";
    if (axiosError.response?.data) {
        const data = axiosError.response.data as { message?: string };
        if (data?.message) mensagem = data.message;
    }
    toast.error(mensagem);
    throw error;
  };

  return {
    locacoes,
    locacao,
    criarLocacao,
    editarLocacao,
    deletarLocacao,
    realizarDevolucao,
    listarLocacoes,
    buscarLocacaoPorId
  };
};