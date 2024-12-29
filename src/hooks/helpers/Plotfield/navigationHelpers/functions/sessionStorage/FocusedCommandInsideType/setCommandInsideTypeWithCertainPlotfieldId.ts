import { SessionStorageKeys } from "../../../../../shared/SessionStorage/useTypedSessionStorage";

type SetFocusedCommandInsideTypes = {
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
};

export default function setCommandInsideTypeWithCertainPlotfieldId({ getItem, setItem }: SetFocusedCommandInsideTypes) {
  const allInsideTypes = getItem("focusedCommandInsideType") || "";
  const splitted = allInsideTypes.split("?");
  // TODO basically when someone clicks on element with contextMenu
  const withoutLast = splitted.splice(0, splitted.length - 1).join("?");
  setItem("focusedCommandInsideType", `${withoutLast}`);

  return splitted[splitted.length - 2].split("-")[1] || "";
}
