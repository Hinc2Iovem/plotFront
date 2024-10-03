import { useEffect, useTransition } from "react";
import { useParams } from "react-router-dom";
import {
  ChoiceOptionVariationsTypes,
  ChoiceVariationsTypes,
} from "../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import SyncLoad from "../../../shared/Loaders/SyncLoader";
import useCreateMultipleCommands from "../PlotFieldMain/Commands/hooks/useCreateMultipleCommands";
import usePlotfieldCommands from "../Context/PlotFieldContext";

type ButtonCreateCommandsTypes = {
  allCommandsToCreate: string[];
  time: string | null;
  topologyBlockId: string;
  halfSizeOfContainer: number;
  plotfieldExpanded: boolean;
  optionVariations: ChoiceOptionVariationsTypes[];
  choiceType: ChoiceVariationsTypes;
  setShowAllCommands: React.Dispatch<React.SetStateAction<boolean>>;
  setAllCommandsToCreate: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ButtonCreateCommands({
  setShowAllCommands,
  setAllCommandsToCreate,
  allCommandsToCreate,
  topologyBlockId,
  choiceType,
  optionVariations,
  time,
  halfSizeOfContainer,
  plotfieldExpanded,
}: ButtonCreateCommandsTypes) {
  const { episodeId } = useParams();
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();
  const { storyId } = useParams();
  const [isPending, setTransition] = useTransition();

  const createMultipleCommands = useCreateMultipleCommands({
    topologyBlockId,
    allCommands: allCommandsToCreate.toString(),
    amountOfOptions: optionVariations.length,
    choiceType,
    waitValue: Number(time),
    optionVariations: optionVariations.toString(),
    storyId,
    episodeId,
    currentAmountOfCommands: getCurrentAmountOfCommands({ topologyBlockId }),
  });

  useEffect(() => {
    if (createMultipleCommands.status === "success") {
      setShowAllCommands(false);
      setAllCommandsToCreate([]);
    } else if (createMultipleCommands.status) {
      console.error(
        "Error during creation of multiple commands: ",
        createMultipleCommands.error
      );
    }
  }, [createMultipleCommands.status]);

  return (
    <button
      onClick={() => {
        setTransition(() => {
          createMultipleCommands.mutate();
        });
      }}
      disabled={isPending}
      style={{
        right:
          halfSizeOfContainer && plotfieldExpanded
            ? `calc(50% - ${halfSizeOfContainer}px)`
            : `-4rem`,
        transform: !plotfieldExpanded ? `translateX(-50%)` : `translateX(0%)`,
      }}
      className={`${allCommandsToCreate.length ? "" : "hidden"} ${
        createMultipleCommands.status === "pending"
          ? "flex gap-[.5rem] items-center bg-blue-300 w-[12rem]"
          : "hover:bg-green-400 bg-green-300"
      } ${
        plotfieldExpanded ? " fixed  bottom-[2rem]" : "absolute  bottom-[0rem]"
      } px-[1rem] py-[.5rem] rounded-md shadow-md text-white transition-all text-[1.5rem]`}
    >
      {createMultipleCommands.status === "pending" ? (
        <>
          <p className="text-[1.5rem]">Создание</p>
          <SyncLoad
            className="right-[.5rem]"
            conditionToLoading={createMultipleCommands.status === "pending"}
            conditionToStart={createMultipleCommands.status === "pending"}
          />
        </>
      ) : (
        "Создать"
      )}
    </button>
  );
}
