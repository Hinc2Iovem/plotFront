import { Outlet } from "react-router-dom";
import DivBgColor from "../ui/shared/DivBgColor";

export default function StoryLayout() {
  return (
    <>
      <DivBgColor bgColor="bg-primary" />
      <Outlet />
    </>
  );
}
