import command from "@/assets/images/Editor/command.png";
import plus from "@/assets/images/shared/add.png";
import { Button } from "@/components/ui/button";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useParams } from "react-router-dom";
import useCreateBlankCommand from "../../../hooks/useCreateBlankCommand";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import useIfVariations, { IfVariationTypes } from "./Context/IfContext";
import CreateIfVariationButton from "./CreateIfVariationButton";
import { IfVariationInputField } from "./Variations/IfVariationInputField";
import useRefineAndAssignVariations from "./Variations/useRefineAndAssignVariations";

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
  commandIfId,
  plotfieldCommandId,
  nameValue,
  hideCommands,
  createInsideElse,
  setHideCommands,
}: CommandIfNameFieldTypes) {
  const { episodeId } = useParams();

  // const { getCurrentAmountOfCommands } = usePlotfieldCommands();

  // const createBlankCommand = useCreateBlankCommand({
  //   topologyBlockId,
  //   episodeId: episodeId || "",
  // });

  // const handleCreateCommand = (isElse: boolean) => {
  //   const _id = generateMongoObjectId();

  //   const commandOrder = getCurrentAmountOfCommands({
  //     topologyBlockId,
  //   });

  //   createBlankCommand.mutate({
  //     commandOrder: commandOrder,
  //     _id,
  //     commandName: "" as AllPossiblePlotFieldComamndsTypes,
  //     isElse: isElse,
  //     topologyBlockId,
  //     plotfieldCommandIfId: commandIfId,
  //   });
  // };

  useRefineAndAssignVariations({ ifId: commandIfId, plotfieldCommandId });

  const { getAllIfVariationsByPlotfieldCommandId, getAllLogicalOperators } = useIfVariations();

  const createCommand = useCreateBlankCommand({
    topologyBlockId: topologyBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId: topologyBlockId || "",
    });
  };

  return (
    <div className="min-w-[100px] w-full relative flex flex-col items-center gap-[10px]">
      <FocusedPlotfieldCommandNameField nameValue={"if"} plotFieldCommandId={plotfieldCommandId} />

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
