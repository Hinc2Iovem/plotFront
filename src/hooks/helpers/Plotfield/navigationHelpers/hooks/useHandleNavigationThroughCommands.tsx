import { useEffect } from "react";
import useNavigation from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useChoiceOptions from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import useConditionBlocks from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";
import { preventCreatingCommandsWhenFocus } from "../../preventCreatingCommandsWhenFocus";
import dashInsideCommandIf from "../functions/dashInsideCommandIf";
import insideAndOutsideChoiceOption from "../functions/insideAndOutsideChoiceOption";
import insideAndOutsideConditionBlock from "../functions/insideAndOutsideConditionBlock";
import movingAmongChoiceOptions from "../functions/movingAmongChoiceOptions";
import movingAmongConditionBlocks from "../functions/movingAmongConditionBlocks";
import navigationBackAndForth from "../functions/navigationBackAndForth";

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
  const { setCurrentlyFocusedCommandId, currentlyFocusedCommandId, currentTopologyBlock } = useNavigation();
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
    getConditionBlockByIndex,
    getAmountOfConditionBlocks,
    getAllConditionBlocksByPlotfieldCommandId,
  } = useConditionBlocks();

  const {
    getFirstChoiceOptionWithTopologyBlockId,
    updateCurrentlyOpenChoiceOption,
    getCurrentlyOpenChoiceOption,
    getAllChoiceOptionsByPlotfieldCommandId,
    getAmountOfChoiceOptions,
    getChoiceOptionByIndex,
  } = useChoiceOptions();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      // TODO because I will need to add ability to move inside modal using arrowUp and arrowDown I need to add similar check for it, like the one below
      // basically will have a sessionStorage with true or false value
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
          topologyBlockId: currentTopologyBlock._id,
        });
      } else if ((key === "arrowup" || key === "arrowdown") && pressedKeys.has("shift")) {
        // going inside and outside such commands as condition/choice, and doing dash for commandIf
        const focusedCommand = getItem("focusedCommand") || "";
        const focusedCommandParentId = getItem("focusedCommandParentId") || "";
        const currentCommand = getCommandOnlyByPlotfieldCommandId({
          plotfieldCommandId: focusedCommandType === "command" ? focusedCommand : focusedCommandParentId,
        }); //this way because when focused on command focusedCommand === plotfieldCommandId, otherwise focusedCommand === choiceOptionId/conditionBlockId

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

        insideAndOutsideConditionBlock({
          currentCommand,
          currentlyFocusedCommandId,
          key,
          getCurrentlyOpenConditionBlock,
          getItem,
          setCurrentlyFocusedCommandId,
          setItem,
          getCommandOnlyByPlotfieldCommandId,
          getCommandsByTopologyBlockId,
          getFirstConditionBlockWithTopologyBlockId,
          updateCurrentlyOpenConditionBlock,
        });

        insideAndOutsideChoiceOption({
          currentlyFocusedCommandId,
          currentCommand,
          key,
          getCommandOnlyByPlotfieldCommandId,
          getCommandsByTopologyBlockId,
          getCurrentlyOpenChoiceOption,
          getFirstChoiceOptionWithTopologyBlockId,
          setCurrentlyFocusedCommandId,
          updateCurrentlyOpenChoiceOption,
          setItem,
          getItem,
        });
      } else if (
        (key === "arrowup" || key === "arrowdown") &&
        !pressedKeys.has("control") &&
        !pressedKeys.has("shift") &&
        focusedCommandType !== "command"
      ) {
        // moving among conditionBlocks/choiceOptions
        movingAmongConditionBlocks({
          currentlyFocusedCommandId,
          key,
          getAllConditionBlocksByPlotfieldCommandId,
          getAmountOfConditionBlocks,
          getConditionBlockByIndex,
          getCurrentlyOpenConditionBlock,
          setCurrentlyFocusedCommandId,
          updateCurrentlyOpenConditionBlock,
          setItem,
        });

        movingAmongChoiceOptions({
          currentlyFocusedCommandId,
          key,
          getAllChoiceOptionsByPlotfieldCommandId,
          getAmountOfChoiceOptions,
          getChoiceOptionByIndex,
          getCurrentlyOpenChoiceOption,
          setCurrentlyFocusedCommandId,
          setItem,
          updateCurrentlyOpenChoiceOption,
        });
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
    getAmountOfConditionBlocks,
    getAllConditionBlocksByPlotfieldCommandId,
    getConditionBlockByIndex,
    getPreviousCommandByPlotfieldId,
    getNextCommandByPlotfieldId,
    getCommandByPlotfieldCommandId,
    getFirstConditionBlockWithTopologyBlockId,
    getCurrentlyOpenConditionBlock,
    updateCurrentlyOpenConditionBlock,
    getAllChoiceOptionsByPlotfieldCommandId,
    getAmountOfChoiceOptions,
    getChoiceOptionByIndex,
    getCommandOnlyByPlotfieldCommandId,
    getFirstChoiceOptionWithTopologyBlockId,
    updateCurrentlyOpenChoiceOption,
    setCurrentlyFocusedCommandId,
    getItem,
    setItem,
    hasItem,
    removeItem,
    getCommandByPlotfieldCommandIfId,
    getCurrentlyOpenChoiceOption,
    currentTopologyBlock,
    currentlyFocusedCommandId,
  ]);
}
