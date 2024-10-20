export const preventCreatingCommandsWhenFocus = () => {
  const activeElement = document.activeElement;
  const isInputFocused =
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    activeElement?.getAttribute("contenteditable") === "true";

  if (isInputFocused) return false;
  return true;
};
