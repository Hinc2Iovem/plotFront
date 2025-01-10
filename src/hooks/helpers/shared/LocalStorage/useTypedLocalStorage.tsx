import { useCallback } from "react";

export type LocalStorageTypes = {
  theme: "light" | "dark";
};

export function useTypedLocalStorage<T extends Record<string, unknown>>() {
  const setItem = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    localStorage.setItem(key as string, JSON.stringify(value));
  }, []);

  const getItem = useCallback(<K extends keyof T>(key: K): T[K] | null => {
    const item = localStorage.getItem(key as string);
    try {
      const parsed = item ? (JSON.parse(item) as T[K]) : null;
      return parsed;
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
