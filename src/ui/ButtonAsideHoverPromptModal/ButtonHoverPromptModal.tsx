import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";
import AsideHoverPromptModal from "./AsideHoverPromptModal";

const ButtonHoverPromptModalStyles = cva(["z-[999] transition-all outline-none w-fit bg-secondary"], {
  variants: {
    variant: {
      icon: ["bg-secondary rounded-full"],
      iconWithShadow: ["hover:shadow-black bg-secondary hover:shadow-sm rounded-full"],
      rectangle: ["rounded-md"],
      rectangleWithShadow: ["hover:shadow-gray-300 rounded-md shadow-sm"],
    },
  },
  defaultVariants: {
    variant: "iconWithShadow",
  },
});

export interface hidePromptModal {
  hideModal?: boolean;
  contentName: string;
  positionByAbscissa: "left" | "right";
  position?: "absolute" | "relative" | "fixed" | "sticky";
  asideClasses?: string;
}

interface exclusivelyButtonTypes extends hidePromptModal {
  marginAutoSide?: "ml-auto" | "mr-auto" | "m-auto";
  positionForDiv?: string;
}

type ButtonHoverPromptModalProps = VariantProps<typeof ButtonHoverPromptModalStyles> &
  ComponentProps<"button"> &
  exclusivelyButtonTypes;

export default function ButtonHoverPromptModal({
  variant,
  className,
  contentName,
  hideModal,
  positionByAbscissa = "right",
  marginAutoSide,
  position,
  positionForDiv,
  asideClasses,
  ...props
}: ButtonHoverPromptModalProps) {
  const [showAsidePrompt, setShowAsidePrompt] = useState(false);
  const putDiveInPositionByAbscissa = position !== "relative" ? `${positionForDiv}` : "";
  return (
    <div
      className={`${marginAutoSide ? `${marginAutoSide}` : ""} ${
        position ? position : "relative"
      } ${putDiveInPositionByAbscissa}`}
    >
      <button
        {...props}
        className={twMerge(ButtonHoverPromptModalStyles({ variant }), className)}
        onMouseOver={() => setShowAsidePrompt(true)}
        onMouseOut={() => setShowAsidePrompt(false)}
      ></button>
      <AsideHoverPromptModal
        contentName={contentName}
        hideModal={hideModal}
        showAsidePrompt={showAsidePrompt}
        positionByAbscissa={positionByAbscissa}
        position={position}
        asideClasses={asideClasses}
      />
    </div>
  );
}
