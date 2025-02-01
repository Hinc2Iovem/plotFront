import command from "@/assets/images/Editor/command.png";
import plus from "@/assets/images/shared/add.png";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandElse from "../../../hooks/If/Else/useGetCommandElse";
import useCreateBlankCommand from "../../../hooks/useCreateBlankCommand";
import useCommandIf from "../If/Context/IfContext";

type CommandElseFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  plotfieldCommandIfId: string;
  commandOrder: number;
};

export default function CommandElseField({
  plotFieldCommandId,
  topologyBlockId,
  plotfieldCommandIfId,
  commandOrder,
}: CommandElseFieldTypes) {
  const { episodeId } = useParams();
  const { data: commandElse } = useGetCommandElse({ plotFieldCommandId });
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;
  console.log("plotFieldCommandId: ", plotFieldCommandId);

  const { getCurrentAmountOfIfCommands, setCurrentAmountOfIfCommands } = useCommandIf();

  const createBlankCommand = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    if (commandElse) {
      setCurrentAmountOfIfCommands({
        amountOfCommandsInsideElse: commandElse.amountOfCommandsInsideElse || commandOrder + 1,
        plotfieldCommandIfId: commandElse.plotfieldCommandIfId,
      });
    }
  }, [commandElse]);

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();

    createBlankCommand.mutate({
      commandOrder: getCurrentAmountOfIfCommands({ isElse: true, plotfieldCommandIfId }),
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
