import command from "@/assets/images/Editor/command.png";
import plus from "@/assets/images/shared/add.png";
import { Button } from "@/components/ui/button";
import PlotfieldCommandNameField from "@/ui/Texts/PlotfieldCommandNameField";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useParams } from "react-router-dom";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useCreateBlankCommand from "../../../hooks/useCreateBlankCommand";
import useCommandIf from "./Context/IfContext";
import CreateIfVariationButton from "./CreateIfVariationButton";
import { IfVariationInputField } from "./Variations/IfVariationInputField";
import useRefineAndAssignVariations from "./Variations/useRefineAndAssignVariations";
import { IfVariationTypes } from "./Context/IfVariationSlice";

type CommandIfNameFieldTypes = {
  topologyBlockId: string;
  commandIfId: string;
  plotfieldCommandId: string;
  setHideCommands: React.Dispatch<React.SetStateAction<boolean>>;
  hideCommands: boolean;

  createInsideElse: boolean;
  nameValue: "if" | "else";
};

export default function CommandIfNameField({
  topologyBlockId,
  plotfieldCommandId,
  commandIfId,
}: CommandIfNameFieldTypes) {
  const { episodeId } = useParams();

  const { getCurrentAmountOfIfCommands } = useCommandIf();

  useRefineAndAssignVariations({ ifId: commandIfId, plotfieldCommandId });

  const { getAllIfVariationsByPlotfieldCommandId, getAllLogicalOperators } = useCommandIf();

  const createCommand = useCreateBlankCommand({
    topologyBlockId: topologyBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId: topologyBlockId || "",
      commandOrder: getCurrentAmountOfIfCommands({ isElse: false, plotfieldCommandIfId: commandIfId }),
      plotfieldCommandIfId: commandIfId,
      isElse: false,
    });
  };

  const currentlyFocusedCommand = useGetCurrentFocusedElement();
  const isCommandFocused = currentlyFocusedCommand._id === plotfieldCommandId;

  return (
    <div className="min-w-[100px] w-full relative flex flex-col items-center gap-[10px]">
      <div className="min-w-[100px] flex-grow w-full relative flex items-start gap-[10px]">
        <PlotfieldCommandNameField
          className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"} text-[30px] text-center`}
        >
          If
        </PlotfieldCommandNameField>
      </div>
      <div className="px-[5px] flex gap-[5px] w-full">
        <CreateIfVariationButton ifId={commandIfId} plotfieldCommandId={plotfieldCommandId} />
        <div className={`flex gap-[5px] w-full rounded-md flex-wrap`}>
          {(
            getAllIfVariationsByPlotfieldCommandId({
              plotfieldCommandId,
            }) as IfVariationTypes[]
          )?.map((p, i) => (
            <IfVariationInputField
              key={p.ifVariationId}
              {...p}
              insidePlotfield={false}
              topologyBlockId={topologyBlockId}
              ifId={commandIfId}
              logicalOperators={getAllLogicalOperators({ plotfieldCommandId })}
              plotfieldCommandId={plotfieldCommandId}
              index={i}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full bg-secondary rounded-md shadow-sm items-center px-[5px] py-[5px]">
        <Button
          className="self-end bg-brand-gradient px-[5px] hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all relative"
          onClick={handleCreateCommand}
        >
          <img src={plus} alt="+" className="w-[15px] absolute translate-y-1/2 translate-x-1/2 right-[0rem] bottom-0" />
          <img src={command} alt="Commands" className="w-[30px]" />
        </Button>
      </div>
    </div>
  );
}
