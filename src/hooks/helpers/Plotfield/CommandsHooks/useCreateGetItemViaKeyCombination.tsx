import { useEffect } from "react";
import useCreateGetItem from "../../../../features/Editor/PlotField/hooks/GetItem/useCreateGetItem";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import { preventCreatingCommandsWhenFocus } from "../preventCreatingCommandsWhenFocus";
import { useParams } from "react-router-dom";
import usePlotfieldCommands from "../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useCreateBlankCommandInsideIf from "../../../../features/Editor/PlotField/hooks/If/useCreateBlankCommandInsideIf";

type CreateGetItemViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateGetItemViaKeyCombination({ topologyBlockId }: CreateGetItemViaKeyCombinationTypes) {
  const { episodeId } = useParams();
  const createPlotfield = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });
  const createGetItem = useCreateGetItem({ topologyBlockId });

  const { getCurrentAmountOfIfCommands, getCommandIfByPlotfieldCommandId } = usePlotfieldCommands();

  const createPlotfieldInsideIf = useCreateBlankCommandInsideIf({
    topologyBlockId,
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

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("g") && pressedKeys.has("e")) || (pressedKeys.has("п") && pressedKeys.has("у")))
      ) {
        const _id = generateMongoObjectId();
        createGetItem.mutate({ plotfieldCommandId: _id });

        const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");
        const commandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

        const deepLevelCommandIf = commandIf?.includes("none")
          ? null
          : (commandIf?.length || 0) > 0
          ? (commandIf?.length || 0) - 1
          : null;
        let isElse;
        let commandIfId;
        let plotfieldCommandId;
        if (typeof deepLevelCommandIf === "number") {
          const currentCommandIf = (commandIf || [])[deepLevelCommandIf];
          isElse = currentCommandIf?.split("-")[0] === "else";
          plotfieldCommandId = currentCommandIf?.split("-")[1];
          commandIfId = currentCommandIf?.split("-")[3];
        }

        const focusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");
        let commandOrder;
        if ((focusedCommand || [])[1] !== plotfieldCommandId) {
          commandOrder =
            (getCommandIfByPlotfieldCommandId({
              plotfieldCommandId: (focusedCommand || [])[1] || "",
              commandIfId: commandIfId || "",
              isElse: isElse || false,
            })?.commandOrder || 0) + 1;
        }

        if (commandIfId?.trim().length) {
          createPlotfieldInsideIf.mutate({
            _id,
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            commandIfId,
            isElse: isElse || false,
            command: "getitem",
            commandOrder:
              typeof commandOrder === "number"
                ? commandOrder
                : getCurrentAmountOfIfCommands({
                    commandIfId,
                    isElse: isElse || false,
                  }),
          });
        } else {
          createPlotfield.mutate({
            _id,
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            commandIfId,
            isElse,
            commandName: "getitem",
          });
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
