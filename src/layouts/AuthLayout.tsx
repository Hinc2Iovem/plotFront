import { Outlet } from "react-router-dom";
import DivBgColor from "../ui/shared/DivBgColor";
import ShowScreenSizeModal from "../helpers/ShowScreenSizeModal";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-background" />
      <ShowScreenSizeModal />
      <Outlet />
      <Toaster />
    </>
  );
}
