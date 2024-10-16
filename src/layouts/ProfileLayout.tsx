import { Outlet } from "react-router-dom";
import DivBgColor from "../features/shared/utilities/DivBgColor";
import ShowScreenSizeModal from "../helpers/ShowScreenSizeModal";

export default function ProfileLayout() {
  const bgColor = localStorage.getItem("theme");
  return (
    <>
      <DivBgColor
        bgColor={`${bgColor === "light" ? "bg-primary" : "bg-secondary"}`}
      />
      <ShowScreenSizeModal />
      <Outlet />
    </>
  );
}
