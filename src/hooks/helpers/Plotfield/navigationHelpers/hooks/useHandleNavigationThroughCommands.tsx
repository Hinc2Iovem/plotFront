import { useEffect } from "react";
import useNavigation from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useChoiceOptions from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import useConditionBlocks from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../shared/useTypedSessionStorage";
import { preventCreatingCommandsWhenFocus } from "../../preventCreatingCommandsWhenFocus";
import dashInsideCommandIf from "../functions/dashInsideCommandIf";
import navigationBackAndForth from "../functions/navigationBackAndForth";
import setFocusedCommandInsideType from "../functions/sessionStorage/FocusedCommandInsideType/setFocusedCommandInsideType";
import getPrevPlotfieldCommandIdInsideTypes from "../functions/sessionStorage/FocusedCommandInsideType/getPrevPlotfieldCommandIdInsideType";
import getCurrentPlotfieldCommandIdInsideTypes from "../functions/sessionStorage/FocusedCommandInsideType/getCurrentPlotfieldCommandIdInsideType";

// - focuse inside commands such as condition and choice happens in 2 levels, when shift + arrowDown pressed first time, focus will be directed
// - on the according block(which means, now creating of commands will work as creating commands on primary field, they will be created at the end of the plot)
// - on the second click focus will be directed on the first command of that block/option and now he can freely move
// - when focused on block/option using arrowDown and arrowUp navigation between blocks/options will happen!!!!
// - the same when going up, will happen in 2 steps
// - for commandIf the same key combination will cause a dash to happen(basically navigation from if to else)

// 1)navigation back and forth
// 2)navigation inside and outside
// 2.1)navigation inside commandIf - happens naturally(as back and forth), will need to add a check if focuseded command is inside ifCommand or not,
// 2.2)commandIf should have a dash ability, which basically teleports user to the commandElse and vice versa only difference is in pressedKeys
// 2.3)navigation inside condition, should be able to navigate inside condition(if) and condition(else) using arrowUp and arrowDown,
// ----- in order to go inside conditionBlock need to use arrowDown + shift, if currently focused on else, will focus on else block,
// ----- otherwise will focus on first block with topologyBlockId and which is not else
// 2.4)navigation inside choice, the same as with condition but without commandElse

// Focus changes when:
// ---using arrowDown or arrowUp
// ---on input focus(default focus not this one)
// ---and on contextMenu when chosen

export default function useHandleNavigationThroughCommands() {
  const { setCurrentlyFocusedCommandId, currentlyFocusedCommandId } = useNavigation();
  const { setItem, getItem, hasItem, removeItem } = useTypedSessionStorage<SessionStorageKeys>();
  const {
    getCommandsByTopologyBlockId,
    getPreviousCommandByPlotfieldId,
    getNextCommandByPlotfieldId,
    getCommandByPlotfieldCommandId,
    getCommandOnlyByPlotfieldCommandId,
    getCommandByPlotfieldCommandIfId,
  } = usePlotfieldCommands();

  const {
    getFirstConditionBlockWithTopologyBlockId,
    updateCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlock,
  } = useConditionBlocks();

  const { getFirstChoiceOptionWithTopologyBlockId, updateCurrentlyOpenChoiceOption } = useChoiceOptions();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (!preventCreatingCommandsWhenFocus()) {
        console.log("Not allowed to move on focus");
        return;
      }

      const focusedCommandType = getItem("focusedCommandType");

      if (
        (key === "arrowup" || key === "arrowdown") &&
        !pressedKeys.has("control") &&
        !pressedKeys.has("shift") &&
        focusedCommandType === "command"
      ) {
        event.preventDefault();

        if (
          (!currentlyFocusedCommandId._id && key === "arrowup") ||
          (currentlyFocusedCommandId.commandOrder === 0 && key === "arrowup")
        ) {
          console.log("IT'S THE FIRST COMMAND DUDE");
          return;
        }

        navigationBackAndForth({
          currentlyFocusedCommandId,
          key,
          getCommandsByTopologyBlockId,
          getItem,
          getNextCommandByPlotfieldId,
          getPreviousCommandByPlotfieldId,
          hasItem,
          removeItem,
          setCurrentlyFocusedCommandId,
          setItem,
          getCommandOnlyByPlotfieldCommandId,
        });
      } else if ((key === "arrowup" || key === "arrowdown") && pressedKeys.has("shift")) {
        // going inside and outside such commands as condition/choice, and doing dash for commandIf
        const focusedCommand = getItem("focusedCommand") || "";
        const focusedCommandParentId = getItem("focusedCommandParentId") || "";
        const currentCommand = getCommandOnlyByPlotfieldCommandId({
          plotfieldCommandId: focusedCommand,
        });

        if (
          currentCommand?.command !== "condition" &&
          currentCommand?.command !== "choice" &&
          currentCommand?.command !== "if" &&
          currentCommand?.command !== "else" &&
          currentCommand?.command !== "end"
        ) {
          console.log("such command doesn't support nestedness or dash");
          return;
        }

        dashInsideCommandIf({
          currentCommand,
          focusedCommand,
          focusedCommandParentId,
          key,
          getCommandByPlotfieldCommandIfId,
          getCommandOnlyByPlotfieldCommandId,
          setCurrentlyFocusedCommandId,
          setItem,
        });

        // TODO when will be updating focused block/option need to make sure to not forget about updateCurrentlyOpen(ConditionBlock)/(ChoiceOption)
        if (currentCommand.command === "condition") {
          const isElse = getItem("focusedConditionIsElse") || false;
          const focusedCommand = getItem("focusedCommand") || "";

          if (key === "arrowdown") {
            const block = getFirstConditionBlockWithTopologyBlockId({
              insideElse: isElse,
              plotfieldCommandId: focusedCommand,
            });

            updateCurrentlyOpenConditionBlock({
              conditionBlockId: block?.conditionBlockId || "",
              plotfieldCommandId: focusedCommand,
            });

            setCurrentlyFocusedCommandId({
              commandName: "condition",
              commandOrder: currentlyFocusedCommandId.commandOrder || 0,
              currentlyFocusedCommandId: block?.conditionBlockId || "",
              parentId: focusedCommand,
              type: "conditionBlock",
              isElse: isElse,
            });

            setItem("focusedCommandParentId", focusedCommand);
            setItem("focusedTopologyBlock", block?.targetBlockId || "");
            setFocusedCommandInsideType({
              getItem,
              newType: "condition",
              parentId: focusedCommand || "",
              setItem,
            });
          } else if (key === "arrowup") {
            if (currentlyFocusedCommandId.type === "conditionBlock") {
              const currentCommandCondition = getCommandOnlyByPlotfieldCommandId({
                plotfieldCommandId: focusedCommand,
              });
              // when focused on some conditionBlock
              setCurrentlyFocusedCommandId({
                commandName: "condition",
                commandOrder: currentCommandCondition?.commandOrder || 0,
                currentlyFocusedCommandId: focusedCommand || "",
                type: "command",
                isElse: isElse,
              });

              getPrevPlotfieldCommandIdInsideTypes({ getItem, setItem }); //removes last element of focusedCommandInsideType(sessionStorage)
              setItem("focusedTopologyBlock", currentCommand?.topologyBlockId || "");
              return;
            } else {
              // when focused on some command inside ConditionBlock and going up to ConditionBlock
              const currentConditionPlotfieldCommandId = getCurrentPlotfieldCommandIdInsideTypes({ getItem });
              const block = getCurrentlyOpenConditionBlock({ plotfieldCommandId: currentConditionPlotfieldCommandId });
              const currentCommandCondition = getCommandOnlyByPlotfieldCommandId({
                plotfieldCommandId: currentConditionPlotfieldCommandId,
              });

              if (!block) {
                console.log("Should have a condition plotfieldCommandId");
                return;
              }

              setCurrentlyFocusedCommandId({
                commandName: "condition",
                commandOrder: currentCommandCondition?.commandOrder || 0,
                currentlyFocusedCommandId: currentConditionPlotfieldCommandId || "",
                type: "conditionBlock",
                isElse: isElse,
                parentId: currentConditionPlotfieldCommandId,
              });
            }
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    getCommandsByTopologyBlockId,
    getPreviousCommandByPlotfieldId,
    getNextCommandByPlotfieldId,
    getCommandByPlotfieldCommandId,
    getFirstConditionBlockWithTopologyBlockId,
    getCurrentlyOpenConditionBlock,
    updateCurrentlyOpenConditionBlock,
    getCommandOnlyByPlotfieldCommandId,
    getFirstChoiceOptionWithTopologyBlockId,
    updateCurrentlyOpenChoiceOption,
    setCurrentlyFocusedCommandId,
    getItem,
    setItem,
    hasItem,
    removeItem,
    getCommandByPlotfieldCommandIfId,
    currentlyFocusedCommandId,
  ]);
}
