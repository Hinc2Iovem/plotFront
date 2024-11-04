type CheckIsCurrentFieldFocusedTypes = {
  itemId: string;
};

export default function checkIsCurrentFieldFocused({
  itemId,
}: CheckIsCurrentFieldFocusedTypes) {
  const currentFocusedField = sessionStorage.getItem(`focusedCommand`);

  return currentFocusedField?.split("-")[1] === itemId;
}
