import { useEffect } from "react";
import { LocalStorageTypes, useTypedLocalStorage } from "./LocalStorage/useTypedLocalStorage";

export default function useHandleTheme({ currentTheme }: { currentTheme?: "light" | "dark" }) {
  const { setItem } = useTypedLocalStorage<LocalStorageTypes>();

  useEffect(() => {
    if (currentTheme) {
      document.body.classList.add(currentTheme);
      document.body.classList.remove(currentTheme === "dark" ? "light" : "dark");
      setItem("theme", currentTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      setItem("theme", "light");
    }
  }, [currentTheme]);
}
