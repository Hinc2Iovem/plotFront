import useNavigation from "@/features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "@/features/Editor/PlotField/Context/PlotFieldContext";
import useCreateBlankCommand from "@/features/Editor/PlotField/hooks/useCreateBlankCommand";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "@/hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import { addItemInUndoSessionStorage } from "@/hooks/helpers/UndoRedo/addItemInUndoSessionStorage";
import { AllPossiblePlotFieldComamndsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { preventCreatingCommandsWhenFocus } from "../../preventCreatingCommandsWhenFocus";

type CreateBlankViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateBlankViaKeyCombination({ topologyBlockId }: CreateBlankViaKeyCombinationTypes) {
  const { episodeId } = useParams();
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();

  const { getCurrentAmountOfCommands } = usePlotfieldCommands();
  const { currentlyFocusedCommandId } = useNavigation();
  const createPlotfield = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) {
        // console.log("You are inside input element");
        return;
      }
      pressedKeys.add(event.key?.toLowerCase());

      if (pressedKeys.has("shift") && (pressedKeys.has("n") || pressedKeys.has("т"))) {
        console.log("here");

        const _id = generateMongoObjectId();
        const focusedTopologyBlockId = getItem("focusedTopologyBlock");
        const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

        addItemInUndoSessionStorage({
          _id,
          episodeId: episodeId || "",
          topologyBlockId: currentTopologyBlockId,
          type: "created",
        });

        // TODO I think it's not the brightest idea to check if current command inside if using isElse because command condition has isElse too
        // TODO better to check by current parentType

        createPlotfield.mutate({
          _id,
          topologyBlockId: currentTopologyBlockId,
          isElse: currentlyFocusedCommandId?.isElse,
          plotfieldCommandIfId:
            currentlyFocusedCommandId.commandName === "if" ||
            (currentlyFocusedCommandId.commandName as AllPossiblePlotFieldComamndsTypes) === "else" ||
            (typeof currentlyFocusedCommandId.isElse === "boolean" && currentlyFocusedCommandId.parentId)
              ? currentlyFocusedCommandId?.parentId
              : "",
          commandOrder:
            typeof currentlyFocusedCommandId.commandOrder === "number"
              ? currentlyFocusedCommandId?.commandOrder + 1
              : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId }),
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [topologyBlockId, createPlotfield, getItem, currentlyFocusedCommandId, getCurrentAmountOfCommands, episodeId]);
}
