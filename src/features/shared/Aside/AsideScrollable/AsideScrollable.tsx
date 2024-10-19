import { ComponentProps, forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

type AsideScrollableTypes = ComponentProps<"aside">;

const AsideScrollable = forwardRef<HTMLElement, AsideScrollableTypes>(
  ({ className, children, ...props }, ref) => {
    const theme = localStorage.getItem("theme");
    const asideRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const handleTabKey = (e: KeyboardEvent) => {
        if (!asideRef.current) return;

        const focusableElements = asideRef.current.querySelectorAll("button");

        const focusable = Array.prototype.slice.call(
          focusableElements
        ) as HTMLElement[];

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (focusable.length === 0) return;

        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      const currentAside = asideRef.current;
      currentAside?.addEventListener("keydown", handleTabKey);

      return () => {
        currentAside?.removeEventListener("keydown", handleTabKey);
      };
    }, []);

    return (
      <aside
        ref={(node) => {
          asideRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={twMerge(
          ` flex flex-col gap-[1rem] ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } z-[100] w-full translate-y-[3rem] absolute text-[1.5rem] shadow-sm shadow-second-lightest-gray text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] transition-shadow h-[15rem] overflow-y-auto | containerScroll`,
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

AsideScrollable.displayName = "AsideScrollable";

export default AsideScrollable;
