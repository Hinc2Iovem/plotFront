import { useLocation } from "react-router-dom";
import imgDesktop from "../../assets/images/Auth/authImgDesktop.svg";
import imgMobile from "../../assets/images/Auth/authImgMobile.svg";
import SidebarRegister from "./Register/SidebarRegister";
import SidebarLogin from "./Login/SidebarLogin";

type SidebarTypes = {
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
};

export default function Sidebar({ currentPage, setCurrentPage }: SidebarTypes) {
  const { pathname } = useLocation();
  const theme = localStorage.getItem("theme");
  return (
    <div className="md:w-1/4 w-full md:h-full h-[15rem] relative flex-shrink-0">
      {theme === "light" ? (
        <>
          <img
            src={imgDesktop}
            alt="Sidebar"
            className="hidden md:block w-full h-full object-cover rounded-md max-h-[35rem]"
          />
          <img
            src={imgMobile}
            alt="Sidebar"
            className="block md:hidden w-full h-full object-cover"
          />
        </>
      ) : (
        <>
          <div className="hidden md:block w-full h-full object-cover rounded-md max-h-[35rem] bg-secondary"></div>
          <div className="block md:hidden w-full h-full object-cover bg-secondary"></div>
        </>
      )}
      <div
        className={`${
          pathname.includes("register")
            ? "absolute top-0 md:left-0 left-1/2 md:-translate-x-0 -translate-x-1/2"
            : "hidden"
        } flex md:flex-col gap-[.5rem] p-[1rem]`}
      >
        <SidebarRegister
          setCurrentPage={
            setCurrentPage as React.Dispatch<React.SetStateAction<number>>
          }
          currentPage={currentPage as number}
        />
      </div>

      <div
        className={`${
          pathname.includes("login")
            ? "absolute top-0 md:left-0 left-1/2 md:-translate-x-0 -translate-x-1/2"
            : "hidden"
        } flex md:flex-col gap-[.5rem] p-[1rem]`}
      >
        <SidebarLogin />
      </div>
    </div>
  );
}
