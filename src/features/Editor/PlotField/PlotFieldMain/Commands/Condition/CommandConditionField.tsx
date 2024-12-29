import { useEffect, useState } from "react";
import plus from "../../../../../../assets/images/shared/add.png";
import ButtonHoverPromptModal from "../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useCheckIfShowingPlotfieldInsideConditionOnMount from "../../../hooks/Condition/helpers/useCheckIfShowingPlotfieldInsideConditionOnMount";
import useGetCommandCondition from "../../../hooks/Condition/useGetCommandCondition";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import ConditionBlocksList from "./ConditionBlocksList";
import CreateConditionValueTypeModal from "./CreateConditionValueTypeModal";
import usePopulateStateWithConditionBlocks from "./hooks/usePopulateStateWithConditionBlocks";

type CommandConditionFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandConditionField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandConditionFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Condition");

  const [isFocusedBackground, setIsFocusedBackground] = useState(false);
  const [showConditionBlockPlot, setShowConditionBlockPlot] = useState(false);

  useCheckIfShowingPlotfieldInsideConditionOnMount({
    plotFieldCommandId,
    setIsFocusedBackground,
    setShowConditionBlockPlot,
  });

  const currentlyFocusedCommand = useGetCurrentFocusedElement();
  const isCommandFocused = currentlyFocusedCommand._id === plotFieldCommandId;

  const [commandConditionId, setCommandConditionId] = useState("");

  const [showCreateValueType, setShowCreateValueType] = useState(false);
  const { data: commandCondition } = useGetCommandCondition({
    plotFieldCommandId,
  });

  useEffect(() => {
    if (commandCondition) {
      setCommandConditionId(commandCondition._id);
    }
  }, [commandCondition]);

  usePopulateStateWithConditionBlocks({ commandConditionId, plotFieldCommandId });
  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col relative">
      <div className="min-w-[10rem] flex-grow w-full relative flex items-start gap-[1rem]">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
        <ButtonHoverPromptModal
          contentName="Создать Блок"
          positionByAbscissa="right"
          className="active:scale-[.99] relative bg-secondary z-[2]"
          asideClasses="text-[1.3rem] -translate-y-1/3 text-text-light"
          onClick={(e) => {
            e.stopPropagation();
            setShowCreateValueType((prev) => !prev);
          }}
          variant="rectangle"
        >
          <img src={plus} alt="Commands" className="w-[3.5rem] h-full p-[.2rem]" />
        </ButtonHoverPromptModal>

        <CreateConditionValueTypeModal
          setShowCreateValueType={setShowCreateValueType}
          showCreateValueType={showCreateValueType}
          commandConditionId={commandConditionId}
          plotfieldCommandId={plotFieldCommandId}
        />
      </div>

      <ConditionBlocksList
        commandConditionId={commandConditionId}
        topologyBlockId={topologyBlockId}
        plotFieldCommandId={plotFieldCommandId}
        setIsFocusedBackground={setIsFocusedBackground}
        setShowConditionBlockPlot={setShowConditionBlockPlot}
        showConditionBlockPlot={showConditionBlockPlot}
        isCommandFocused={isCommandFocused}
        isFocusedBackground={isFocusedBackground}
      />
    </div>
  );
}
