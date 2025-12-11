import { SocioArray, SocioCreate, SocioUpdate, Socio } from "@/model/socio/socio";
import api from "@/server/api";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useSocioHook = () => {
  const [socios, setSocios] = useState<SocioArray | null>(null);
  const [socio, setSocio] = useState<Socio | null>(null);

  const listarSocios = useCallback(async () => {
    try {
      const response = await api.get(`socios/listarSocios`);
      setSocios(response.data);
    } catch {
      toast.error("Erro ao listar sócios");
    }
  }, []);

  const criarSocio = async (socio: SocioCreate): Promise<void> => {
    try {
      await api.post(`socios/salvarSocio`, socio);
      toast.success("Sócio criado com sucesso!");
    } catch (error) {
        tratarErro(error);
    }
  };

  const editarSocio = useCallback(async (id: number, socio: SocioUpdate) => {
    try {
      await api.put(`socios/${id}/editarSocio`, socio);
      toast.success("Sócio atualizado com sucesso!");
    } catch (error) {
        tratarErro(error);
    }
  }, []);

  const deletarSocio = useCallback(async (id: number) => {
    try {
      await api.delete(`socios/deletarSocio/${id}`);
      toast.success("Sócio deletado com sucesso!");
      await listarSocios();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarSocios]);

  // Rotas de Inativar/Reativar
  const inativarSocio = useCallback(async (id: number) => {
    try {
      await api.patch(`socios/inativarSocio/${id}`);
      toast.success("Sócio inativado com sucesso!");
      await listarSocios();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarSocios]);

  const reativarSocio = useCallback(async (id: number) => {
    try {
      await api.patch(`socios/reativarSocio/${id}`);
      toast.success("Sócio reativado com sucesso!");
      await listarSocios();
    } catch (error) {
        tratarErro(error);
    }
  }, [listarSocios]);

  const buscarSocioPorId = useCallback(async (id: number) => {
    try {
      const response = await api.get(`socios/buscarSocio/${id}`);
      setSocio(response.data);
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
    socios,
    socio,
    criarSocio,
    editarSocio,
    deletarSocio,
    listarSocios,
    buscarSocioPorId,
    inativarSocio,
    reativarSocio
  };
};