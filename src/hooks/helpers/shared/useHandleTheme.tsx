import { useEffect } from "react";

export default function useHandleTheme() {
  useEffect(() => {
    localStorage.setItem("theme", "dark");

    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }, []);
}
