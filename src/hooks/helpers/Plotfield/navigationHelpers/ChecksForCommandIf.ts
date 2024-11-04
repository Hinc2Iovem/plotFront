import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../../features/Editor/PlotField/Context/PlotfieldCommandIfSlice";

type GoingDownInsideIfTypes = {
  currentCommandId: string | undefined;
  isGoingDown: boolean;
  insideIf: boolean;
  getFirstCommandInsideIf: ({
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes | null;
  updateFocuseReset: ({ value }: { value: boolean }) => void;
  updateFocuseIfReset: ({ value }: { value: boolean }) => void;
};

export function GoingDownInsideIf({
  isGoingDown,
  insideIf,
  currentCommandId,
  getFirstCommandInsideIf,
}: GoingDownInsideIfTypes) {
  if (isGoingDown) {
    if (insideIf) {
      const firstCommand = getFirstCommandInsideIf({
        commandIfId: currentCommandId || "",
        isElse: false,
      });

      if (!firstCommand?._id?.trim().length) {
        console.log("This if doesn't have any commands yet to be focused on.");
        // updateFocuseReset({ value: false });
        // updateFocuseIfReset({ value: false });
        return;
      }

      sessionStorage.setItem(
        `focusedCommand`,
        `${
          firstCommand.sayType?.trim()
            ? firstCommand.sayType
            : firstCommand.command
        }-${firstCommand._id}${firstCommand.command === "if" ? "-if" : ""}`
      );
    } else {
      const firstCommand = getFirstCommandInsideIf({
        commandIfId: currentCommandId || "",
        isElse: true,
      });
      if (!firstCommand?._id?.trim().length) {
        console.log("This if doesn't have any commands yet to be focused on.");
        // updateFocuseReset({ value: false });
        // updateFocuseIfReset({ value: false });
        return;
      }

      sessionStorage.setItem(
        `focusedCommand`,
        `${
          firstCommand.sayType?.trim()
            ? firstCommand.sayType
            : firstCommand.command
        }-${firstCommand._id}${firstCommand.command === "if" ? "-else" : ""}`
      );
    }
  }
}

export function GoingUpFromIf() {
  const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");

  const focusedCommandIf = sessionStorage
    .getItem("focusedCommandIf")
    ?.split("?")
    .filter(Boolean);

  const deepLevel = focusedCommandIf?.includes("none")
    ? null
    : (focusedCommandIf?.length || 0) > 0
    ? (focusedCommandIf?.length || 0) - 1
    : null;

  if (typeof deepLevel !== "number") {
    sessionStorage.setItem("focusedCommand", `none-${currentTopologyBlockId}`);
    console.log("You are not inside command if");
    return;
  }

  if (deepLevel === 0) {
    const currentFocusedCommandIf = (focusedCommandIf || [])[deepLevel];
    const isCommandIf = currentFocusedCommandIf.split("-")[0];
    const plotfieldCommandId = currentFocusedCommandIf.split("-")[1];
    sessionStorage.setItem(
      "focusedCommand",
      `if-${plotfieldCommandId}-${isCommandIf === "if" ? "if" : "else"}`
    );
    sessionStorage.setItem("focusedCommandIf", `none`);
  } else {
    const currentFocusedCommandIf = (focusedCommandIf || [])[deepLevel];
    const newFocusedCommandIfArray = (focusedCommandIf || []).slice(0, -1);
    const isCommandIf = currentFocusedCommandIf.split("-")[0];
    const plotfieldCommandId = currentFocusedCommandIf.split("-")[1];

    sessionStorage.setItem(
      "focusedCommand",
      `if-${plotfieldCommandId}-${isCommandIf === "if" ? "if" : "else"}`
    );
    sessionStorage.setItem(
      "focusedCommandIf",
      newFocusedCommandIfArray.join("?")
    );
  }
}
