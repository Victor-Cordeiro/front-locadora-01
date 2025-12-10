import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "8e6f12c286cb3cf595dbd6c621553a42"; // O ideal é mover para .env
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Cache global para evitar requisições repetidas na mesma sessão
const imageCache = new Map<string, string>();

export const useMovieImage = (movieName: string, year?: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieName) {
        setLoading(false);
        return;
    }

    // Cria uma chave única para o cache
    const cacheKey = `${movieName}-${year || ''}`;

    // 1. Verifica se já temos essa imagem no cache
    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey) || null);
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      setLoading(true);
      try {
        // Busca o filme
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: movieName,
                year: year,
                language: "pt-BR", // Tenta pegar poster em PT-BR
                include_adult: false
            }
        });
        
        if (response.data.results && response.data.results.length > 0) {
          // Pega o filme mais popular ou o primeiro da lista
          const filme = response.data.results[0];
          
          if (filme.poster_path) {
            const fullUrl = `${IMAGE_BASE_URL}${filme.poster_path}`;
            setImageUrl(fullUrl);
            imageCache.set(cacheKey, fullUrl); // Salva no cache
          } else {
            // Filme achado, mas sem poster
            setImageUrl(null); 
            imageCache.set(cacheKey, ""); // Marca como sem imagem para não buscar de novo
          }
        } else {
            // Filme não encontrado
            setImageUrl(null);
            imageCache.set(cacheKey, "");
        }
      } catch (error) {
        console.error("Erro TMDB:", error);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    // Adiciona um pequeno delay (debounce) para evitar flood se o usuário digitar rápido ou a lista renderizar muito rápido
    const timeoutId = setTimeout(() => {
        fetchImage();
    }, 100);

    return () => clearTimeout(timeoutId);

  }, [movieName, year]);

  return { imageUrl, loading };
};