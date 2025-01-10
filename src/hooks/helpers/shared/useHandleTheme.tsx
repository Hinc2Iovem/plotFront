import { useEffect } from "react";
import { LocalStorageTypes, useTypedLocalStorage } from "./LocalStorage/useTypedLocalStorage";

export default function useHandleTheme() {
  const { getItem, setItem } = useTypedLocalStorage<LocalStorageTypes>();
  useEffect(() => {
    setItem("theme", "dark");

    const selectedTheme = getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }, []);
}
