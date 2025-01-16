import command from "@/assets/images/Editor/command.png";
import plus from "@/assets/images/shared/add.png";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useCreateBlankCommand from "../../../hooks/useCreateBlankCommand";

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
    <div
      className={`${
        isCommandFocused ? "bg-brand-gradient" : "bg-secondary"
      } min-w-[10rem] w-full rounded-md relative flex items-center gap-[1rem] p-[.5rem]`}
    >
      <PlotfieldCommandNameField className={`shadow-none`}>Else</PlotfieldCommandNameField>
      <Button
        className="self-end bg-brand-gradient px-[5px] hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all relative"
        onClick={handleCreateCommand}
      >
        <img src={plus} alt="+" className="w-[15px] absolute translate-y-1/2 translate-x-1/2 right-[0rem] bottom-0" />
        <img src={command} alt="Commands" className="w-[30px]" />
      </Button>
    </div>
  );
}
