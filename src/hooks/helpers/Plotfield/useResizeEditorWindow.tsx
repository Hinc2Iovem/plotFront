import { useEffect } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

type ResizeEditorWindowTypes = {
  setScaleDivPosition: React.Dispatch<React.SetStateAction<number>>;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  containerRef: React.RefObject<HTMLDivElement>;
};

const useResizeEditorWindow = ({
  containerRef,
  command,
  setScaleDivPosition,
}: ResizeEditorWindowTypes) => {
  useEffect(() => {
    const resizeEditorWindow = () => {
      if (containerRef.current) {
        if (command === "expandFlowchart") {
          setScaleDivPosition(
            window.innerWidth / 2 - containerRef.current.clientWidth / 2 + 10
          );
        } else {
          setScaleDivPosition(window.innerWidth / 2 + 10);
        }
      }
    };

    resizeEditorWindow();

    window.addEventListener("resize", resizeEditorWindow);

    return () => {
      window.removeEventListener("resize", resizeEditorWindow);
    };
  }, [containerRef, command, setScaleDivPosition]);
};

export default useResizeEditorWindow;
