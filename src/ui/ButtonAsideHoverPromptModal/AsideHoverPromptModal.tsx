import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { hidePromptModal } from "./ButtonHoverPromptModal";

const AsideHoverPromptModalStyles = cva(
  ["z-[2] transition-all w-fit absolute bottom-[-4.5rem] py-[.5rem] px-[1rem] whitespace-nowrap bg-secondary"],
  {
    variants: {
      variant: {
        squareModalPromptWithShadow: "rounded-md shadow-sm shadow-black bg-secondary font-medium",
      },
    },
    defaultVariants: {
      variant: "squareModalPromptWithShadow",
    },
  }
);

interface AsidePromptModal extends hidePromptModal {
  showAsidePrompt: boolean;
}

type AsideHoverPromptModalProps = VariantProps<typeof AsideHoverPromptModalStyles> &
  ComponentProps<"aside"> &
  AsidePromptModal;

export default function AsideHoverPromptModal({
  contentName,
  variant,
  className,
  hideModal,
  showAsidePrompt,
  positionByAbscissa,
  position,
  asideClasses,
  ...props
}: AsideHoverPromptModalProps) {
  const clickToOpenModal = hideModal ? "hidden" : "block";
  const hoverOnButtonToOpenAsideModal = showAsidePrompt ? "block" : "hidden";
  const wrapperDivPositionAbsolute = position === "relative" ? "" : "bottom-[-4rem]";
  const currentPosition = `${positionByAbscissa}-0`;

  return (
    <aside
      {...props}
      className={twMerge(
        AsideHoverPromptModalStyles({ variant }),
        className,
        clickToOpenModal,
        hoverOnButtonToOpenAsideModal,
        currentPosition,
        wrapperDivPositionAbsolute,
        asideClasses
      )}
    >
      {contentName}
    </aside>
  );
}
