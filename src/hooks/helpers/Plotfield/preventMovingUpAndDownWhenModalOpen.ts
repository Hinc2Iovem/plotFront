export const preventMovingUpAndDownWhenModalOpen = () => {
  const modal = document.querySelector("[data-state='open']");

  if (modal) {
    return true;
  }

  return false;
};
