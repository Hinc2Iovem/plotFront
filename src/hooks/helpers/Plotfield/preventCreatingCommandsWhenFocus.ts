export const preventCreatingCommandsWhenFocus = () => {
  const activeElement = document.activeElement;
  const isInputFocused =
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    activeElement?.getAttribute("contenteditable") === "true";

  console.log("prevented on focus");
  if (isInputFocused) return false;
  return true;
};
