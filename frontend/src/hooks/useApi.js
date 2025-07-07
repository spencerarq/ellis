import { useState, useEffect, useCallback } from 'react';

/**
 * Um hook customizado para buscar dados de uma API.
 * Ele gerencia os estados de carregamento, erro e os dados recebidos.
 * @param {Function} apiFunc - A função do serviço de API a ser executada (ex: getAlunos).
 * @returns {{data: any, loading: boolean, error: string|null}}
 */
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;