import { useEffect } from "react";
import useCreateSayCommandBlank from "../../../../features/Editor/PlotField/hooks/Say/useCreateSayCommandBlank";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import { preventCreatingCommandsWhenFocus } from "../preventCreatingCommandsWhenFocus";
import { useParams } from "react-router-dom";
import usePlotfieldCommands from "../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useCreateBlankCommandInsideIf from "../../../../features/Editor/PlotField/hooks/If/useCreateBlankCommandInsideIf";

type CreateAuthorViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateAuthorViaKeyCombination({
  topologyBlockId,
}: CreateAuthorViaKeyCombinationTypes) {
  const { episodeId } = useParams();
  const createPlotfield = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });
  const createAuthor = useCreateSayCommandBlank({ topologyBlockId });

  const { getCurrentAmountOfIfCommands, getCommandIfByPlotfieldCommandId } =
    usePlotfieldCommands();

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
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("a") && pressedKeys.has("u")) ||
          (pressedKeys.has("ф") && pressedKeys.has("г")))
      ) {
        const _id = generateMongoObjectId();
        createAuthor.mutate({ plotfieldCommandId: _id, type: "author" });

        const currentTopologyBlockId = sessionStorage.getItem(
          "focusedTopologyBlock"
        );
        const commandIf = sessionStorage
          .getItem("focusedCommandIf")
          ?.split("?")
          .filter(Boolean);

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

        const focusedCommand = sessionStorage
          .getItem("focusedCommand")
          ?.split("-");
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
            command: "say",
            commandOrder:
              typeof commandOrder === "number"
                ? commandOrder
                : getCurrentAmountOfIfCommands({
                    commandIfId,
                    isElse: isElse || false,
                  }),
            sayType: "author",
          });
        } else {
          createPlotfield.mutate({
            _id,
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            commandIfId,
            isElse,
            commandName: "say",
            sayType: "author",
          });
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
