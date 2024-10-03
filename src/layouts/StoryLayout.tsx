import { Outlet } from "react-router-dom";
import DivBgColor from "../features/shared/utilities/DivBgColor";
import ShowScreenSizeModal from "../helpers/ShowScreenSizeModal";

export default function StoryLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-neutral-magnolia" />
      <ShowScreenSizeModal />
      <Outlet />
    </>
  );
}
