import { useEffect } from "react";
import command from "../../../../assets/images/Editor/command.png";
import plus from "../../../../assets/images/shared/add.png";
import useCheckKeysCombinationCreateBlankCommand from "../../../../hooks/helpers/useCheckKeysCombinationCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import useCreateBlankCommand from "../PlotFieldMain/Commands/hooks/useCreateBlankCommand";

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
  const { updateCommandInfo, getCurrentAmountOfCommands } =
    usePlotfieldCommands();

  const createCommand = useCreateBlankCommand({ topologyBlockId });

  const commandCreatedByKeyCombinationBlankCommand =
    useCheckKeysCombinationCreateBlankCommand();

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      commandOrder: getCurrentAmountOfCommands({ topologyBlockId }),
      topologyBlockId,
    });
    updateCommandInfo({ topologyBlockId, addOrMinus: "add" });
    if (createCommand.isError) {
      updateCommandInfo({ topologyBlockId, addOrMinus: "minus" });
    }
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
      <div className="flex gap-[1rem]">
        <ButtonHoverPromptModal
          onClick={() => setShowAllCommands(true)}
          contentName="Все команды"
          positionByAbscissa="left"
          asideClasses="text-[1.3rem] top-[3.5rem] bottom-[-3.5rem] z-[1000]"
          className="bg-primary-pastel-blue shadow-sm shadow-gray-400 active:scale-[.99]"
          variant="rectangle"
        >
          <img src={command} alt="Commands" className="w-[3rem]" />
        </ButtonHoverPromptModal>
        <ButtonHoverPromptModal
          contentName="Создать строку"
          positionByAbscissa="left"
          className="bg-primary-light-blue shadow-sm shadow-gray-400 active:scale-[.99] relative "
          asideClasses="text-[1.3rem] top-[3.5rem] bottom-[-3.5rem] z-[1000]"
          onClick={handleCreateCommand}
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
          className="text-[1.6rem] px-[1rem] outline-gray-300 rounded-md shadow-md hover:bg-green-300 hover:text-white transition-all"
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
            className="w-[2.5rem] h-[1rem] shadow-inner shadow-gray-400 hover:shadow-md transition-shadow rounded-md absolute top-[-1rem] right-[-.5rem]"
          ></button>
        </div>
      </div>
    </header>
  );
}
