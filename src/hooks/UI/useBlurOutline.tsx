import { useEffect } from "react";

type useBlurOutlineProps = {
  modalRef?: React.MutableRefObject<
    HTMLInputElement | HTMLTextAreaElement | null
  >;
};

export default function useBlurOutline({ modalRef }: useBlurOutlineProps) {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (modalRef?.current && e.key === "Escape") {
        modalRef.current.blur();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [modalRef]);
}
