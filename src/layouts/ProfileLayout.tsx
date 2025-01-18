import { Outlet } from "react-router-dom";
import DivBgColor from "../ui/shared/DivBgColor";
import { Button } from "@/components/ui/button";
import useHandleTheme from "@/hooks/helpers/shared/useHandleTheme";
import { useState } from "react";
import { LocalStorageTypes, useTypedLocalStorage } from "@/hooks/helpers/shared/LocalStorage/useTypedLocalStorage";

export default function ProfileLayout() {
  const { getItem } = useTypedLocalStorage<LocalStorageTypes>();

  const [currentTheme, setCurrentTheme] = useState(getItem("theme"));

  useHandleTheme({
    currentTheme: currentTheme
      ? currentTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  });

  return (
    <>
      <DivBgColor bgColor={`bg-background`} />
      <Button
        variant={"outline"}
        className="text-text fixed bottom-[10px] right-[10px] z-[10]"
        onClick={() => setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      >
        {currentTheme === "light" ? "dark" : "light"}
      </Button>
      <Outlet />
    </>
  );
}
