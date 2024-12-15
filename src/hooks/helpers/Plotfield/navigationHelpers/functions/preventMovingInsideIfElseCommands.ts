type PreventMovingInsideIfElseCommandsTypes = {
  deepLevelCommandIf: number | null;
  focusedCommandIf: string[] | undefined;
  currentCommandId: string | undefined;
};

export function preventMovingInsideIfElseCommands({
  currentCommandId,
  deepLevelCommandIf,
  focusedCommandIf,
}: PreventMovingInsideIfElseCommandsTypes) {
  if (typeof deepLevelCommandIf === "number") {
    const currentFocusedCommandIf = (focusedCommandIf || [])[
      deepLevelCommandIf
    ];

    if (currentFocusedCommandIf?.split("-")[1] === currentCommandId) {
      console.log(
        "Firstly, you need to get out of command and only then, you'll be able to navigate freely. Condition"
      );
      return;
    }
  }
}
