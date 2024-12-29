import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import command from "../../../../assets/images/Editor/command.png";
import plus from "../../../../assets/images/shared/add.png";
import useCheckKeysCombinationCreateBlankCommand from "../../../../hooks/helpers/keyCombinations/useCheckKeysCombinationCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useNavigation from "../../Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import useCreateBlankCommand from "../hooks/useCreateBlankCommand";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";

type PlotFieldHeaderTypes = {
  topologyBlockId: string;
  showAllCommands: boolean;
  hideFlowchartFromScriptwriter: boolean;
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<React.SetStateAction<boolean | null>>;
  setExpansionDivDirection: React.Dispatch<React.SetStateAction<"right" | "left">>;
  setShowAllCommands: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldHeader({
  topologyBlockId,
  setShowHeader,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
  hideFlowchartFromScriptwriter,
  showAllCommands,
}: PlotFieldHeaderTypes) {
  // TODO this is zalupa
  const { episodeId } = useParams();
  const { setItem, getItem, removeItem } = useTypedSessionStorage<SessionStorageKeys>();

  const { currentlyFocusedCommandId } = useNavigation();
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();
  const [increaseFocusModalHeight, setIncreaseFocusModalHeight] = useState(false);
  const theme = localStorage.getItem("theme");

  const currentTopologyBlockId = getItem(`focusedTopologyBlock`) || topologyBlockId;

  const createCommand = useCreateBlankCommand({
    topologyBlockId: currentTopologyBlockId,
    episodeId: episodeId || "",
  });

  const commandCreatedByKeyCombinationBlankCommand = useCheckKeysCombinationCreateBlankCommand();

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId: currentTopologyBlockId || topologyBlockId,
      commandOrder:
        typeof currentlyFocusedCommandId.commandOrder === "number"
          ? currentlyFocusedCommandId.commandOrder + 1
          : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId }),
      plotfieldCommandIfId: currentlyFocusedCommandId.parentId,
      isElse: currentlyFocusedCommandId.isElse,
    });
  };

  const handleCreateCommandOnClick = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId,
      commandOrder: getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId }),
    });
  };

  useEffect(() => {
    if (commandCreatedByKeyCombinationBlankCommand === "blankPlotFieldCommand") {
      handleCreateCommand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandCreatedByKeyCombinationBlankCommand]);

  return (
    <header className={`${showAllCommands ? "hidden" : ""} flex gap-[1rem] justify-between items-center`}>
      <button
        onMouseOver={() => setIncreaseFocusModalHeight(true)}
        onMouseLeave={() => setIncreaseFocusModalHeight(false)}
        style={{
          height: increaseFocusModalHeight ? "auto" : ".3rem",
          padding: increaseFocusModalHeight ? "1rem .5rem 1rem .5rem" : "",
        }}
        onClick={() => {
          setIncreaseFocusModalHeight(false);
          setItem(`focusedTopologyBlock`, topologyBlockId);
          setItem(`focusedCommand`, ``);
          setItem("focusedCommandInsideType", ``);
          setItem("focusedCommandType", "command");
          setItem("focusedCommandParentId", "");
          setItem(`focusedCommandParentType`, `` as "if");
          removeItem("focusedConditionIsElse");
        }}
        className={`absolute hover:bg-dark-blue bg-dark-dark-blue text-center w-[15rem] text-text-light text-[1.4rem] overflow-hidden transition-all rounded-md left-1/2 -translate-x-1/2 top-0`}
      >
        Сбросить Фокус
      </button>
      <div className="flex gap-[1rem]">
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
        <div className={`relative w-[2rem] ${hideFlowchartFromScriptwriter ? "" : "hidden"} `}>
          <button
            onClick={() => {
              setHideFlowchartFromScriptwriter(false);
              setExpansionDivDirection("" as "right" | "left");
            }}
            className={`w-[2.5rem] h-[1rem] shadow-inner ${
              theme === "light" ? "shadow-secondary-darker hover:shadow-md" : "shadow-gray-700 hover:scale-[1.03]"
            } transition-shadow rounded-md absolute top-[-1rem] right-[-.5rem]`}
          ></button>
        </div>
      </div>
    </header>
  );
}
