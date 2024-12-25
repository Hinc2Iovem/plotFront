import { SessionStorageKeys } from "../../../../../shared/useTypedSessionStorage";

type SetFocusedCommandInsideTypes = {
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
};

export default function getCurrentPlotfieldCommandIdInsideTypes({ getItem }: SetFocusedCommandInsideTypes) {
  const allInsideTypes = getItem("focusedCommandInsideType") || "";
  const splitted = allInsideTypes.split("?");

  return splitted[splitted.length - 1].split("-")[1] || "";
}
