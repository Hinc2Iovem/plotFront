import { Outlet } from "react-router-dom";
import DivBgColor from "../features/shared/utilities/DivBgColor";

export default function StoryLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-primary" />
      {/* <ShowScreenSizeModal /> */}
      <Outlet />
    </>
  );
}
