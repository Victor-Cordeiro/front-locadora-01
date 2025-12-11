import { Dependente, DependenteCreate, DependenteUpdate } from "@/model/dependente/dependente";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useDependenteHook = () => {
  const [dependentes, setDependentes] = useState<Dependente[] | null>(null);
  const [dependente, setDependente] = useState<Dependente | null>(null);

  const listarDependentes = useCallback(async () => {
    try {
      const response = await api.get(`dependentes/listarDependentes`);
      setDependentes(response.data);
    } catch {
      toast.error("Erro ao listar dependentes");
    }
  }, []);

  // Nota: A rota de criação exige o ID do Sócio na URL
  const criarDependente = async (idSocio: number, dependente: DependenteCreate): Promise<void> => {
    try {
      await api.post(`dependentes/incluirDependente/${idSocio}`, dependente);
      toast.success("Dependente criado com sucesso!");
    } catch (error) {
        tratarErro(error);
    }
  };

  const editarDependente = useCallback(async (id: number, dependente: DependenteUpdate) => {
    try {
      await api.put(`dependentes/${id}/editarDependente`, dependente);
      toast.success("Dependente atualizado com sucesso!");
    } catch (error) {
        tratarErro(error);
    }
  }, []);

  const deletarDependente = useCallback(async (id: number) => {
    try {
      await api.delete(`dependentes/deletarDependente/${id}`);
      toast.success("Dependente deletado com sucesso!");
      await listarDependentes();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarDependentes]);

  const inativarDependente = useCallback(async (id: number) => {
    try {
      await api.patch(`dependentes/inativarDependente/${id}`);
      toast.success("Dependente inativado com sucesso!");
      await listarDependentes();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarDependentes]);

  const reativarDependente = useCallback(async (id: number) => {
    try {
      await api.patch(`dependentes/reativarDependente/${id}`);
      toast.success("Dependente reativado com sucesso!");
      await listarDependentes();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarDependentes]);

  const buscarDependentePorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`dependentes/buscarDependente/${id}`);
      setDependente(response.data);
      return response.data;
    } catch (error) {
        tratarErro(error);
    }
  }, []);

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
    dependentes,
    dependente,
    criarDependente,
    editarDependente,
    deletarDependente,
    inativarDependente,
    reativarDependente,
    listarDependentes,
    buscarDependentePorId
  };
};