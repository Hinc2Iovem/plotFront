import { useCallback } from "react";

export function useTypedLocalStorage<T extends Record<string, unknown>>() {
  const setItem = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    localStorage.setItem(key as string, JSON.stringify(value));
  }, []);

  const getItem = useCallback(<K extends keyof T>(key: K): T[K] | null => {
    const item = localStorage.getItem(key as string);
    try {
      return item ? (JSON.parse(item) as T[K]) : null;
    } catch (error) {
      console.error(`Error parsing localStorage value for key ${key.toString()}:`, error);
      return null;
    }
  }, []);

  const removeItem = useCallback(<K extends keyof T>(key: K) => {
    localStorage.removeItem(key as string);
  }, []);

  const hasItem = useCallback(<K extends keyof T>(key: K): boolean => {
    return localStorage.getItem(key as string) !== null;
  }, []);

  return {
    setItem,
    getItem,
    removeItem,
    hasItem,
  };
}
