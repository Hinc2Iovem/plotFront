import { useCallback } from "react";
import { CurrentlyFocusedVariationTypes } from "../../../../features/Editor/Context/Navigation/NavigationContext";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";

export type SessionStorageKeys = {
  // general(editor)
  focusedTopologyBlock: string;
  episodeId: string;

  // search
  plotfieldSearch: string;

  // navigation(focus)
  focusedCommand: string;
  focusedCommandName: AllPossiblePlotFieldComamndsTypes;
  focusedCommandOrder: number;
  focusedCommandType: CurrentlyFocusedVariationTypes;
  focusedCommandParentId: string;
  focusedCommandParentType: "choice" | "condtition" | "if" | "else";
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
    try {
      const parsed = item ? (JSON.parse(item) as T[K]) : null;
      return parsed;
    } catch (error) {
      console.error(`Error parsing sessionStorage value for key ${key.toString()}:`, error);
      return null;
    }
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
