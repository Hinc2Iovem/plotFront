import { SessionStorageKeys } from "../../../../../shared/SessionStorage/useTypedSessionStorage";

type SetFocusedCommandInsideTypes = {
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
};

export default function getPrevPlotfieldCommandIdInsideTypes({ getItem, setItem }: SetFocusedCommandInsideTypes) {
  const allInsideTypes = getItem("focusedCommandInsideType") || "";
  const splitted = allInsideTypes.split("?");

  if (splitted.length < 1 || splitted.length === 1) {
    console.log("main level");
    setItem("focusedCommandInsideType", ``);
    return;
  }

  const withoutLast = splitted.splice(0, splitted.length - 1).join("?");
  setItem("focusedCommandInsideType", `${withoutLast}`);

  return splitted[splitted.length - 2].split("-")[1] || "";
}
