import { useEffect, useState } from "react";
import addCommand from "../../../../assets/images/Editor/addCommand.png";
import cross from "../../../../assets/images/Editor/cross.png";

type CreatingMultipleCommandsTypes = {
  setAllCommandsToCreate: React.Dispatch<React.SetStateAction<string[]>>;
  setShowDefaultSettings: React.Dispatch<
    React.SetStateAction<{
      wait: boolean;
      choice: boolean;
    }>
  >;
  setTime: React.Dispatch<React.SetStateAction<string | null>>;
  pc: string;
  allCommandsToCreate: string[];
};

export default function CreatingMultipleCommands({
  setAllCommandsToCreate,
  setShowDefaultSettings,
  setTime,
  pc,
  allCommandsToCreate,
}: CreatingMultipleCommandsTypes) {
  const [amountOfCommands, setAmountOfCommands] = useState(0);

  useEffect(() => {
    if (!allCommandsToCreate.length) {
      setAmountOfCommands(0);
      setShowDefaultSettings({
        choice: false,
        wait: false,
      });
    }
  }, [allCommandsToCreate]);

  const handleAddCommand = () => {
    setAmountOfCommands(1);
    setAllCommandsToCreate((prev) => [...prev, pc]);

    if (pc === "wait") {
      setShowDefaultSettings((prev) => ({ wait: true, choice: prev.choice }));
    }
    if (pc === "choice") {
      setShowDefaultSettings((prev) => ({ wait: prev.wait, choice: true }));
    }
  };

  const handleRemoveAllCommands = () => {
    setAmountOfCommands(0);
    setAllCommandsToCreate((prev) => {
      const index = prev.lastIndexOf(pc);
      if (index !== -1) {
        const newCommands = [...prev];
        newCommands.splice(index, 1);
        return newCommands;
      }
      return prev;
    });

    if (pc === "wait") {
      setTime(null);
      setShowDefaultSettings((prev) => ({ wait: false, choice: prev.choice }));
    }
    if (pc === "choice") {
      setShowDefaultSettings((prev) => ({ wait: prev.wait, choice: false }));
    }
  };

  return (
    <form
      className="self-end"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <button
        type="button"
        onClick={handleAddCommand}
        className={`${
          amountOfCommands ? "hidden" : ""
        } shadow-md rounded-full outline-secondary`}
      >
        <img src={addCommand} alt="+" className="w-[2.8rem]" />
      </button>
      <div className={`flex gap-[2rem] ${amountOfCommands ? "" : "hidden"}`}>
        <button
          type="button"
          onClick={handleRemoveAllCommands}
          className="shadow-md rounded-full outline-secondary"
        >
          <img src={cross} alt="X" className="w-[2.8rem]" />
        </button>
      </div>
    </form>
  );
}
