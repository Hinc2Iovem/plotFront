import { SessionStorageKeys } from "../../../../../shared/useTypedSessionStorage";

type SetFocusedCommandInsideTypes = {
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
  parentId: string; // condition/choice/if - plotfieldCommandId
  newType: "condition" | "choice" | "if";
};

export default function setFocusedCommandInsideType({
  getItem,
  newType,
  parentId,
  setItem,
}: SetFocusedCommandInsideTypes) {
  const allInsideTypes = getItem("focusedCommandInsideType") || "";
  if (!allInsideTypes.trim().length) {
    setItem("focusedCommandInsideType", `${newType}-${parentId}`);
  } else {
    setItem("focusedCommandInsideType", `${allInsideTypes}?${newType}-${parentId}`);
  }
}
