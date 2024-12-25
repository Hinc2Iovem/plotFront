import { useCallback } from "react";
import { CurrentlyFocusedVariationTypes } from "../../../features/Editor/Context/Navigation/NavigationContext";

export type SessionStorageKeys = {
  // general(editor)
  focusedTopologyBlock: string;

  // navigation(focus)
  focusedCommand: string;
  focusedCommandType: CurrentlyFocusedVariationTypes;
  focusedCommandParentId: string;
  focusedCommandInsideType: string;
  focusedConditionIsElse: boolean;

  // navigation(search)
  altCurrent: string;
  altArrowLeft: string;
  altArrowRight: string;
};

export default function useTypedSessionStorage<T extends Record<string, unknown>>() {
  const setItem = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    sessionStorage.setItem(key as string, JSON.stringify(value));
  }, []);

  const getItem = useCallback(<K extends keyof T>(key: K): T[K] | null => {
    const item = sessionStorage.getItem(key as string);
    return item ? (JSON.parse(item) as T[K]) : null;
  }, []);

  const removeItem = useCallback(<K extends keyof T>(key: K) => {
    sessionStorage.removeItem(key as string);
  }, []);

  const hasItem = useCallback(<K extends keyof T>(key: K): boolean => {
    return sessionStorage.getItem(key as string) !== null;
  }, []);

  return {
    setItem,
    getItem,
    removeItem,
    hasItem,
  };
}
