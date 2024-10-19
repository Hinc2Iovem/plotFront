import { useEffect, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

export default function useCheckKeysCombinationExpandTranslationSide() {
  const [command, setCommand] =
    useState<PossibleCommandsCreatedByCombinationOfKeysTypes>(
      "" as PossibleCommandsCreatedByCombinationOfKeysTypes
    );
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        (event.key.toLowerCase() === "c" || event.key.toLowerCase() === "с")
      ) {
        if (command === "expandTranslationSide") {
          setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
        } else {
          setCommand("expandTranslationSide");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [command]);

  return command;
}
