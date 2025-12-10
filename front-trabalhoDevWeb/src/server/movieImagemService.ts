// src/services/movieImageService.ts
import axios from "axios";

// --- CONFIGURAÇÃO ---
const API_KEY = "8e6f12c286cb3cf595dbd6c621553a42"; // <--- SUA CHAVE VAI AQUI
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

/**
 * Busca a imagem de um filme na API da TMDB baseada no nome e ano.
 * Retorna a URL completa da imagem ou null se não encontrar.
 */
export const buscarImagemDoFilme = async (nomeFilme: string, anoFilme?: string): Promise<string | null> => {
  if (!nomeFilme) return null;

  try {
    // Busca o filme
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: nomeFilme,
        year: anoFilme,
        language: "pt-BR", // Preferência por poster em português
        page: 1,
      },
    });

    const resultados = response.data.results;

    // Se encontrou algum filme e ele tem poster
    if (resultados && resultados.length > 0) {
      // Pega o primeiro resultado mais relevante
      const filme = resultados[0];
      
      if (filme.poster_path) {
        return `${IMAGE_BASE_URL}${filme.poster_path}`;
      }
    }

    return null; // Nenhum poster encontrado
  } catch (error) {
    console.error("Erro ao buscar imagem no TMDB:", error);
    return null;
  }
};