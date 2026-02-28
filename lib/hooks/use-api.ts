"use client";

import { useState, useEffect } from "react";

export function useApi<T>(url: string | null, initialData: T): { data: T; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(!!url);

  const fetchData = () => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, refetch: fetchData };
}
