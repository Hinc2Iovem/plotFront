import { AllPossiblePlotFieldComamndsSaySubVariationsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import { UtilsSidebarAllPlotfieldCommandsTypes } from "./consts/UtilsSidebarAllPlotfieldCommands";
import { Button } from "@/components/ui/button";
import useCreateBlankCommand from "../../PlotField/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useParams } from "react-router-dom";
import usePlotfieldCommands from "../../PlotField/Context/PlotFieldContext";
import useNavigation from "../../Context/Navigation/NavigationContext";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "@/hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import useCreateCommandByClick from "./useCreateCommandByClick";
import { useState } from "react";

type AllCommmandButtonsTypes = {
  pair: UtilsSidebarAllPlotfieldCommandsTypes[];
};

export default function AllCommmandButtons({ pair }: AllCommmandButtonsTypes) {
  return (
    <div className="flex mx-auto gap-[5px] items-center mt-[5px] translate-x-[3px]">
      {pair.map((p) => (
        <div key={p.commandNameFirst.name} className="flex">
          <PairOfCommands {...p} />
        </div>
      ))}
    </div>
  );
}

type PairOfCommandsTypes = {
  commandNameFirst: {
    name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
    src: string;
  };
  commandNameSecond: {
    name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
    src: string;
  };
};

function PairOfCommands({ commandNameFirst, commandNameSecond }: PairOfCommandsTypes) {
  return (
    <div className="flex gap-[5px]">
      <CommandButton buttonName={commandNameFirst.name} src={commandNameFirst.src} />
      <CommandButton buttonName={commandNameSecond.name} src={commandNameSecond.src} />
    </div>
  );
}

type CommandButtonTypes = {
  buttonName: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
  src: string;
};

function CommandButton({ buttonName, src }: CommandButtonTypes) {
  const { episodeId } = useParams();

  const updateCommandInfo = usePlotfieldCommands((state) => state.updateCommandInfo);
  const getCurrentAmountOfCommands = usePlotfieldCommands((state) => state.getCurrentAmountOfCommands);

  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const currentlyFocusedCommandId = useNavigation((state) => state.currentlyFocusedCommandId);
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();

  const [create, setCreate] = useState(false);
  const [plotfieldCommandId, setPlotfieldCommandId] = useState("");

  const focusedTopologyBlockId = getItem("focusedTopologyBlock");
  const currentTopologyBlockId = focusedTopologyBlockId?.trim().length
    ? focusedTopologyBlockId
    : currentTopologyBlock._id;

  const newPlotFieldCommand = useCreateBlankCommand({
    topologyBlockId: currentTopologyBlockId,
    episodeId: episodeId || "",
  });

  const handleCreatingCommand = async () => {
    const _id = generateMongoObjectId();

    const commandOrder =
      typeof currentlyFocusedCommandId.commandOrder === "number"
        ? currentlyFocusedCommandId?.commandOrder + 1
        : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId });

    const commandName =
      buttonName === "character" || buttonName === "author" || buttonName === "hint" || buttonName === "notify"
        ? "say"
        : buttonName === "blank"
        ? undefined
        : buttonName;
    const sayType =
      buttonName === "character" || buttonName === "author" || buttonName === "hint" || buttonName === "notify"
        ? buttonName
        : undefined;

    await newPlotFieldCommand.mutateAsync({
      _id,
      commandOrder,
      commandName,
      sayType,
      topologyBlockId: currentTopologyBlockId,
    });
    setPlotfieldCommandId(_id);
    setCreate(true);
    updateCommandInfo({ topologyBlockId: currentTopologyBlockId, addOrMinus: "add" });
  };

  useCreateCommandByClick({
    create,
    commandName: buttonName,
    topologyBlockId: currentTopologyBlockId,
    setCreate,
    plotfieldCommandId,
  });

  return (
    <Button
      onClick={handleCreatingCommand}
      className="w-[50px] h-[50px] rounded-md relative bg-border hover:bg-brand-gradient active:scale-[.99] hover:shadow-brand-gradient-left hover:shadow-sm focus-within:bg-brand-gradient transition-all"
    >
      <img
        draggable={false}
        src={src}
        alt={buttonName}
        className="w-[90%] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
      />
    </Button>
  );
}
