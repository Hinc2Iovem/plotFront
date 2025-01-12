import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type GoBackButton = ComponentProps<"button"> & {
  link: string;
};

export default function GoBackButton({ className, link, ...props }: GoBackButton) {
  return (
    <Button
      {...props}
      className={twMerge(
        `text-white bg-brand-gradient rounded-none rounded-tr-md rounded-br-md text-[20px] hover:shadow-md hover:shadow-brand-gradient-left focus-within:shadow-md focus-within:shadow-brand-gradient-left transition-all active:scale-[.99]`,
        className
      )}
      asChild
    >
      <Link to={link}>Назад</Link>
    </Button>
  );
}
