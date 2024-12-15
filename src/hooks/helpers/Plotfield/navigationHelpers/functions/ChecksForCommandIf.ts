type GoingDownInsideIfTypes = {
  currentCommandId: string | undefined;
  isGoingDown: boolean;
  insideIf: boolean;
};

export function GoingDownInsideIf({ isGoingDown, insideIf }: GoingDownInsideIfTypes) {
  if (isGoingDown) {
    if (insideIf) {
      // TODO firstCommand
      const firstCommand = {
        _id: "",
        sayType: "",
        command: "if",
      };

      if (!firstCommand?._id?.trim().length) {
        console.log("This if doesn't have any commands yet to be focused on.");
        //   ({ value: false });
        // updateFocuseIfReset({ value: false });
        return;
      }

      sessionStorage.setItem(
        `focusedCommand`,
        `${firstCommand.sayType?.trim() ? firstCommand.sayType : firstCommand.command}-${firstCommand._id}${
          firstCommand.command === "if" ? "-if" : ""
        }`
      );
    } else {
      // TODO firstCommand
      const firstCommand = {
        _id: "",
        sayType: "",
        command: "if",
      };
      if (!firstCommand?._id?.trim().length) {
        console.log("This if doesn't have any commands yet to be focused on.");
        //   ({ value: false });
        // updateFocuseIfReset({ value: false });
        return;
      }

      sessionStorage.setItem(
        `focusedCommand`,
        `${firstCommand.sayType?.trim() ? firstCommand.sayType : firstCommand.command}-${firstCommand._id}${
          firstCommand.command === "if" ? "-else" : ""
        }`
      );
    }
  }
}

export function GoingUpFromIf() {
  const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");

  const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

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
    sessionStorage.setItem("focusedCommand", `if-${plotfieldCommandId}-${isCommandIf === "if" ? "if" : "else"}`);
    sessionStorage.setItem("focusedCommandIf", `none`);
  } else {
    const currentFocusedCommandIf = (focusedCommandIf || [])[deepLevel];
    const newFocusedCommandIfArray = (focusedCommandIf || []).slice(0, -1);
    const isCommandIf = currentFocusedCommandIf.split("-")[0];
    const plotfieldCommandId = currentFocusedCommandIf.split("-")[1];

    sessionStorage.setItem("focusedCommand", `if-${plotfieldCommandId}-${isCommandIf === "if" ? "if" : "else"}`);
    sessionStorage.setItem("focusedCommandIf", newFocusedCommandIfArray.join("?"));
  }
}
