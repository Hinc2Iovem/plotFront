import { useState } from "react";

type SidebarRegisterTypes = {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
};

export default function SidebarRegister({
  currentPage,
  setCurrentPage,
}: SidebarRegisterTypes) {
  const [currentPageHover, setCurrentPageHover] = useState(currentPage);

  return (
    <>
      <div
        onMouseOver={() => setCurrentPageHover(1)}
        onMouseLeave={() => setCurrentPageHover(0)}
        className="flex items-center gap-[.5rem]"
      >
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          className={`rounded-full ${
            currentPage === 1
              ? "bg-primary-darker text-text-light"
              : "bg-transparent text-text-dark"
          } text-[1rem] z-[10] w-[3rem] hover:bg-primary-darker transition-all h-[3rem] border-[1px] border-secondary shadow-sm shadow-light-gray px-[1rem] py-[.5rem]`}
        >
          1
        </button>
        <h4
          className={`${
            currentPage === 1 || currentPageHover === 1
              ? "text-text-light"
              : "text-gray-200"
          } text-[1.3rem]`}
        >
          Личные Данные
        </h4>
      </div>
      <div
        onMouseOver={() => setCurrentPageHover(2)}
        onMouseLeave={() => setCurrentPageHover(0)}
        className="flex items-center gap-[.5rem]"
      >
        <button
          type="button"
          onClick={() => setCurrentPage(2)}
          className={`rounded-full ${
            currentPage === 2
              ? "bg-primary-darker text-text-light"
              : "bg-transparent text-text-dark"
          } text-[1rem] z-[10] w-[3rem] hover:bg-primary-darker transition-all h-[3rem] border-[1px] border-secondary shadow-sm shadow-light-gray px-[1rem] py-[.5rem]`}
        >
          2
        </button>
        <h4
          className={`${
            currentPage === 2 || currentPageHover === 2
              ? "text-text-light"
              : "text-gray-200"
          } text-[1.3rem]`}
        >
          Роль
        </h4>
      </div>
    </>
  );
}
