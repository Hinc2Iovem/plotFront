import { useEffect } from "react";

type EscapeOfModalTypes = {
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  value: boolean;
};

export default function useEscapeOfModal({
  setValue,
  value,
}: EscapeOfModalTypes) {
  useEffect(() => {
    if (value) {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setValue(false);
        }
      };

      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [value, setValue]);
}
