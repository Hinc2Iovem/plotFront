import { Button } from "@/components/ui/button";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "@/hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import { AllPossiblePlotFieldComamndsSaySubVariationsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useNavigation from "../../Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../PlotField/Context/PlotFieldContext";
import useCreateBlankCommand from "../../PlotField/hooks/useCreateBlankCommand";
import {
  UtilsCommandDescriptionTypes,
  UtilsSidebarAllPlotfieldCommandsTypes,
} from "./consts/UtilsSidebarAllPlotfieldCommands";
import useCreateCommandByClick from "./useCreateCommandByClick";
import useUtils from "./UtilsCommandsContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type AllCommmandButtonsTypes = {
  pair: UtilsSidebarAllPlotfieldCommandsTypes[];
};

export default function AllCommmandButtons({ pair }: AllCommmandButtonsTypes) {
  const hoveredRowNumber = useUtils((state) => state.hoveredRowNumber);

  return (
    <div
      className={`${
        hoveredRowNumber === pair[0]?.rowNumber ? "z-[100]" : "z-[1]"
      } flex mx-auto gap-[5px] items-center mt-[5px] translate-x-[3px]`}
    >
      {pair.map((p) => (
        <div key={p.commandNameFirst.name} className="flex">
          <PairOfCommands {...p} />
        </div>
      ))}
    </div>
  );
}

function PairOfCommands({ commandNameFirst, commandNameSecond, rowNumber }: UtilsSidebarAllPlotfieldCommandsTypes) {
  return (
    <div className={`flex gap-[5px]`}>
      <CommandButton
        buttonName={commandNameFirst.name}
        src={commandNameFirst.src}
        commandDescription={commandNameFirst.commandDescription}
        rowNumber={rowNumber}
      />
      <CommandButton
        buttonName={commandNameSecond.name}
        src={commandNameSecond.src}
        commandDescription={commandNameSecond.commandDescription}
        rowNumber={rowNumber}
      />
    </div>
  );
}

type CommandButtonTypes = {
  buttonName: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
  commandDescription: UtilsCommandDescriptionTypes;
  src: string;
  rowNumber: string;
};

function CommandButton({ buttonName, src, commandDescription, rowNumber }: CommandButtonTypes) {
  const { episodeId } = useParams();
  const setHoveredRowNumber = useUtils((state) => state.setHoveredRowNumber);
  const clear = useUtils((state) => state.clear);

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
    <HoverCard closeDelay={0}>
      <HoverCardTrigger
        onMouseOver={() => setHoveredRowNumber({ rowNumber })}
        onMouseLeave={() => clear()}
        className="relative cursor-pointer"
      >
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
      </HoverCardTrigger>
      <HoverCardContent className="bg-secondary text-paragraph text-[14px] w-fit">
        <h4 className="text-center bg-white rounded-md p-[.2px] px-[.5px] text-text-opposite text-[16px] capitalize">
          {buttonName}
        </h4>
        <p>{commandDescription.keyCombinationEng}</p>
        <p>{commandDescription.keyCombinationRus}</p>
        <p>{commandDescription.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
