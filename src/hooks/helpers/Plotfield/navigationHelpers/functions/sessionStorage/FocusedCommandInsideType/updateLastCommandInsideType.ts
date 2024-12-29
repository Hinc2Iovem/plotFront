import { SessionStorageKeys } from "../../../../../shared/SessionStorage/useTypedSessionStorage";

type SetFocusedCommandInsideTypes = {
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
  parentId: string; // condition/choice/if - plotfieldCommandId
  newType: "condition" | "choice" | "if";
};

export default function updateLastCommandInsideType({
  getItem,
  setItem,
  newType,
  parentId,
}: SetFocusedCommandInsideTypes) {
  const allInsideTypes = getItem("focusedCommandInsideType") || "";
  const splitted = allInsideTypes.split("?");
  const withoutLast = splitted.splice(0, splitted.length - 1).join("?");
  setItem("focusedCommandInsideType", `${withoutLast}?${newType}-${parentId}`);
}
