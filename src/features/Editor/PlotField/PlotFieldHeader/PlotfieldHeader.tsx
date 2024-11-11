import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import command from "../../../../assets/images/Editor/command.png";
import plus from "../../../../assets/images/shared/add.png";
import useCheckKeysCombinationCreateBlankCommand from "../../../../hooks/helpers/useCheckKeysCombinationCreateBlankCommand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import useCreateBlankCommandInsideIf from "../hooks/If/useCreateBlankCommandInsideIf";
import useCreateBlankCommand from "../hooks/useCreateBlankCommand";

type PlotFieldHeaderTypes = {
  topologyBlockId: string;
  showAllCommands: boolean;
  hideFlowchartFromScriptwriter: boolean;
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
  setExpansionDivDirection: React.Dispatch<
    React.SetStateAction<"right" | "left">
  >;
  setShowAllCommands: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldHeader({
  topologyBlockId,
  setShowHeader,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
  hideFlowchartFromScriptwriter,
  showAllCommands,
  setShowAllCommands,
}: PlotFieldHeaderTypes) {
  const { episodeId } = useParams();
  const {
    updateFocuseReset,
    getCurrentAmountOfIfCommands,
    getCommandIfByPlotfieldCommandId,
  } = usePlotfieldCommands();
  const [increaseFocusModalHeight, setIncreaseFocusModalHeight] =
    useState(false);
  const theme = localStorage.getItem("theme");

  const createCommand = useCreateBlankCommand({
    topologyBlockId:
      sessionStorage.getItem(`focusedTopologyBlock`) || topologyBlockId,
    episodeId: episodeId || "",
  });

  const createCommandInsideIfOrElse = useCreateBlankCommandInsideIf({
    topologyBlockId:
      sessionStorage.getItem(`focusedTopologyBlock`) || topologyBlockId,
  });

  const commandCreatedByKeyCombinationBlankCommand =
    useCheckKeysCombinationCreateBlankCommand();

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    const focusedCommandIf = sessionStorage
      .getItem(`focusedCommandIf`)
      ?.split("?")
      .filter(Boolean);
    const currentFocusedCommand = sessionStorage.getItem("focusedCommand");

    const deepLevelCommandIf = focusedCommandIf?.includes("none")
      ? null
      : (focusedCommandIf?.length || 0) > 0
      ? (focusedCommandIf?.length || 0) - 1
      : null;

    const currentCommandIf =
      typeof deepLevelCommandIf === "number"
        ? (focusedCommandIf || [])[deepLevelCommandIf]
        : null;

    const commandIfId = currentCommandIf?.split("-")[3];
    const focusedCommandIfIsElseOrIf = currentCommandIf?.split("-")[0];
    const currentCommandIfPlotfiledCommandId = currentCommandIf?.split("-")[1];

    const currentTopologyBlockId =
      sessionStorage.getItem(`focusedTopologyBlock`);

    if (typeof deepLevelCommandIf !== "number") {
      console.log("Shouldn't be here");

      createCommand.mutate({
        _id,
        topologyBlockId: currentTopologyBlockId || topologyBlockId,
      });
      return;
    }

    if (
      focusedCommandIfIsElseOrIf === "if" ||
      focusedCommandIfIsElseOrIf === "else"
    ) {
      const currentFocusedCommandId = currentFocusedCommand?.split("-")[1];
      const isCreatedUnderCertainCommand =
        currentFocusedCommandId !== currentCommandIfPlotfiledCommandId;

      const existingCommandIf = isCreatedUnderCertainCommand
        ? getCommandIfByPlotfieldCommandId({
            commandIfId: commandIfId || "",
            isElse: focusedCommandIfIsElseOrIf === "else",
            plotfieldCommandId: currentFocusedCommandId || "",
          })
        : null;
      if (focusedCommandIfIsElseOrIf === "if") {
        createCommandInsideIfOrElse.mutate({
          _id: _id,
          command: "" as AllPossiblePlotFieldComamndsTypes,
          commandOrder: isCreatedUnderCertainCommand
            ? (existingCommandIf?.commandOrder || 0) + 1
            : getCurrentAmountOfIfCommands({
                commandIfId: commandIfId || "",
                isElse: false,
              }),
          isElse: false,
          topologyBlockId: currentTopologyBlockId || topologyBlockId,
          commandIfId: commandIfId,
        });
      } else {
        createCommandInsideIfOrElse.mutate({
          _id: _id,
          command: "" as AllPossiblePlotFieldComamndsTypes,
          commandOrder: isCreatedUnderCertainCommand
            ? (existingCommandIf?.commandOrder || 0) + 1
            : getCurrentAmountOfIfCommands({
                commandIfId: commandIfId || "",
                isElse: true,
              }),
          isElse: true,
          topologyBlockId: currentTopologyBlockId || topologyBlockId,
          commandIfId: commandIfId,
        });
      }
    } else {
      createCommand.mutate({
        _id,
        topologyBlockId: currentTopologyBlockId || topologyBlockId,
      });
    }
  };

  const handleCreateCommandOnClick = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId,
    });
  };

  useEffect(() => {
    if (
      commandCreatedByKeyCombinationBlankCommand === "blankPlotFieldCommand"
    ) {
      handleCreateCommand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandCreatedByKeyCombinationBlankCommand]);

  return (
    <header
      className={`${
        showAllCommands ? "hidden" : ""
      } flex gap-[1rem] justify-between items-center`}
    >
      <button
        onMouseOver={() => setIncreaseFocusModalHeight(true)}
        onMouseLeave={() => setIncreaseFocusModalHeight(false)}
        style={{
          height: increaseFocusModalHeight ? "auto" : ".3rem",
          padding: increaseFocusModalHeight ? "1rem .5rem 1rem .5rem" : "",
        }}
        onClick={() => {
          setIncreaseFocusModalHeight(false);
          sessionStorage.setItem(`focusedTopologyBlock`, `${topologyBlockId}`);
          sessionStorage.setItem(`focusedCommand`, `none-${topologyBlockId}`);
          sessionStorage.setItem("focusedCommandIf", `none`);
          sessionStorage.setItem("focusedCommandChoice", `none`);
          sessionStorage.setItem("focusedCommandCondition", `none`);
          sessionStorage.setItem("focusedConditionBlock", `none`);
          sessionStorage.setItem("focusedCommandInsideType", `default?`);
          sessionStorage.setItem("focusedChoiceOption", `none`);
          updateFocuseReset({ value: true });
        }}
        className={`absolute hover:bg-dark-blue bg-dark-dark-blue text-center w-[15rem] text-text-light text-[1.4rem] overflow-hidden transition-all rounded-md left-1/2 -translate-x-1/2 top-0`}
      >
        Сбросить Фокус
      </button>
      <div className="flex gap-[1rem]">
        <ButtonHoverPromptModal
          onClick={() => setShowAllCommands(true)}
          contentName="Все команды"
          positionByAbscissa="left"
          asideClasses="text-[1.3rem] top-[3.5rem] bottom-[-3.5rem] z-[1000] text-text-light"
          className="bg-primary-darker shadow-sm shadow-gray-400 active:scale-[.99]"
          variant="rectangle"
        >
          <img src={command} alt="Commands" className="w-[3rem]" />
        </ButtonHoverPromptModal>
        <ButtonHoverPromptModal
          contentName="Создать строку"
          positionByAbscissa="left"
          className="bg-primary  shadow-sm shadow-gray-400 active:scale-[.99] relative"
          asideClasses="text-[1.3rem] top-[3.5rem] bottom-[-3.5rem] z-[1000] text-text-light"
          onClick={handleCreateCommandOnClick}
          variant="rectangle"
        >
          <img
            src={plus}
            alt="+"
            className="w-[1.5rem] absolute translate-y-1/2 translate-x-1/2 right-[0rem] bottom-0"
          />
          <img src={command} alt="Commands" className="w-[3rem]" />
        </ButtonHoverPromptModal>
      </div>
      <div className="flex gap-[1rem]">
        <button
          className="text-[1.6rem] px-[1rem] outline-gray-300 rounded-md shadow-md hover:bg-primary hover:text-text-dark text-text-light transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setShowHeader(true);
          }}
        >
          Заголовок
        </button>
        <div
          className={`relative w-[2rem] ${
            hideFlowchartFromScriptwriter ? "" : "hidden"
          } `}
        >
          <button
            onClick={() => {
              setHideFlowchartFromScriptwriter(false);
              setExpansionDivDirection("" as "right" | "left");
            }}
            className={`w-[2.5rem] h-[1rem] shadow-inner ${
              theme === "light"
                ? "shadow-secondary-darker hover:shadow-md"
                : "shadow-gray-700 hover:scale-[1.03]"
            } transition-shadow rounded-md absolute top-[-1rem] right-[-.5rem]`}
          ></button>
        </div>
      </div>
    </header>
  );
}
