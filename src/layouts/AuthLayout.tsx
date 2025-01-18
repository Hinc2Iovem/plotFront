import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import DivBgColor from "../ui/shared/DivBgColor";

export default function AuthLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-background" />
      <Outlet />
      <Toaster />
    </>
  );
}
