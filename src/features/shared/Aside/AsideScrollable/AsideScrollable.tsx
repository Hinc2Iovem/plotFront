import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type AsideScrollableTypes = ComponentProps<"aside">;

export default function AsideScrollable({
  className,
  children,
  ...props
}: AsideScrollableTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <aside
      className={twMerge(
        ` flex flex-col gap-[1rem] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } z-[100] w-full translate-y-[3rem] absolute text-[1.5rem] text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow max-h-[10rem] overflow-y-auto | containerScroll`,
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
