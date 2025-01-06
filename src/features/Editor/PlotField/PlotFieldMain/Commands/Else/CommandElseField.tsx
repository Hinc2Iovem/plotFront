import { useParams } from "react-router-dom";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useCreateBlankCommand from "../../../hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import ButtonHoverPromptModal from "../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import commandImg from "../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../assets/images/shared/add.png";

type CommandElseFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  plotfieldCommandIfId: string;
};

export default function CommandElseField({
  plotFieldCommandId,
  topologyBlockId,
  plotfieldCommandIfId,
}: CommandElseFieldTypes) {
  const { episodeId } = useParams();
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();

  const createBlankCommand = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();

    const commandOrder = getCurrentAmountOfCommands({
      topologyBlockId,
    });

    createBlankCommand.mutate({
      commandOrder: commandOrder,
      _id,
      commandName: "" as AllPossiblePlotFieldComamndsTypes,
      isElse: true,
      topologyBlockId,
      plotfieldCommandIfId: plotfieldCommandIfId,
    });
  };

  return (
    <div className="min-w-[10rem] w-full rounded-md relative flex items-center gap-[1rem] p-[.5rem] bg-primary">
      <PlotfieldCommandNameField
        className={`${
          isCommandFocused
            ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
            : "bg-secondary"
        }`}
      >
        Else
      </PlotfieldCommandNameField>
      <ButtonHoverPromptModal
        contentName="Создать строку"
        positionByAbscissa="right"
        className="shadow-sm shadow-gray-400 active:scale-[.99] relative bg-secondary"
        asideClasses="text-[1.3rem] -translate-y-1/4 text-text-light"
        onClick={handleCreateCommand}
        variant="rectangle"
      >
        <img
          src={plus}
          alt="+"
          className="w-[1.5rem] absolute translate-y-1/2 -translate-x-1/2 left-[0rem] bottom-0 z-[2]"
        />
        <img src={commandImg} alt="Commands" className="w-[3rem]" />
      </ButtonHoverPromptModal>
    </div>
  );
}
