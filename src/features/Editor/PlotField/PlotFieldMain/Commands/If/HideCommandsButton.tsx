type HideCommandsButtonTypes = {
  setHideCommands: React.Dispatch<React.SetStateAction<boolean>>;
  hideCommands: boolean;
};

export default function HideCommandsButton({ hideCommands, setHideCommands }: HideCommandsButtonTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <button
      onClick={(e) => {
        setHideCommands((prev) => !prev);
        e.currentTarget.blur();
      }}
      className={`${
        hideCommands
          ? `${
              theme === "light"
                ? "bg-secondary outline-none"
                : "hover:bg-red-light hover:text-text-dark bg-primary text-text-light focus-within:bg-red-light focus-within:text-text-dark outline-gray-600"
            } focus-within:opacity-95 hover:opacity-95 text-text-light`
          : ` ${
              theme === "light"
                ? "bg-red-mid outline-none"
                : "bg-red-light hover:bg-primary hover:text-text-light focus-within:bg-primary focus-within:text-text-light"
            } text-text-dark focus-within:opacity-95 hover:opacity-95`
      } px-[1rem] w-fit shadow-md hover:shadow-sm transition-all active:scale-[0.95] py-[.5rem] rounded-md text-[1.5rem]`}
    >
      {hideCommands ? "Открыть" : "Скрыть"}
    </button>
  );
}
