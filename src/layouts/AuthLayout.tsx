import { Outlet } from "react-router-dom";
import DivBgColor from "../features/shared/utilities/DivBgColor";
import ShowScreenSizeModal from "../helpers/ShowScreenSizeModal";

export default function AuthLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-primary" />
      <ShowScreenSizeModal />
      <Outlet />
    </>
  );
}
