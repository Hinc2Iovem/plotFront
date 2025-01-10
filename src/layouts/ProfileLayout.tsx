import { Outlet } from "react-router-dom";
import DivBgColor from "../ui/shared/DivBgColor";
import ShowScreenSizeModal from "../helpers/ShowScreenSizeModal";

export default function ProfileLayout() {
  return (
    <>
      <DivBgColor bgColor={`bg-background`} />
      <ShowScreenSizeModal />
      <Outlet />
    </>
  );
}
