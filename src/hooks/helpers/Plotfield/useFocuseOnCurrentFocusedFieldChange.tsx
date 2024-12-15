import { useEffect } from "react";

type FocuseOnCurrentFocusedFieldChangeTypes = {
  currentInput: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  isCommandFocused: boolean;
};

export default function useFocuseOnCurrentFocusedFieldChange({
  currentInput,
  isCommandFocused,
}: FocuseOnCurrentFocusedFieldChangeTypes) {
  useEffect(() => {
    if (isCommandFocused && currentInput) {
      currentInput.current?.focus();
    }
  }, [isCommandFocused, currentInput]);
}
