import { Outlet } from "react-router-dom";
import DivBgColor from "../ui/shared/DivBgColor";
import ShowScreenSizeModal from "../helpers/ShowScreenSizeModal";

export default function StoryLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-primary" />
      <ShowScreenSizeModal />
      <Outlet />
    </>
  );
}
