import { useEffect } from "react";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import {
  AllPossiblePlotFieldComamndsTypes,
  OmittedCommandNames,
} from "../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";
import useNavigation, { SetCurrentlyFocusedCommandTypes } from "../Context/Navigation/NavigationContext";
import { useParams } from "react-router-dom";

type UpdateValuesOnPageEnterTypes = {
  firstTopologyBlock: TopologyBlockTypes | undefined;
  localTopologyBlockId: string | null;
  setCurrentTopologyBlockId: ({ _id }: { _id: string }) => void;
};

export default function useUpdateValuesOnPageEnter({
  firstTopologyBlock,
  localTopologyBlockId,
  setCurrentTopologyBlockId,
}: UpdateValuesOnPageEnterTypes) {
  const { episodeId } = useParams();
  const { setItem, getItem, removeItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { setCurrentlyFocusedCommandId } = useNavigation();

  useEffect(() => {
    if (localTopologyBlockId || firstTopologyBlock) {
      setCurrentTopologyBlockId(
        localTopologyBlockId ? { _id: localTopologyBlockId } : { _id: firstTopologyBlock?._id || "" }
      );
    }
  }, [firstTopologyBlock, localTopologyBlockId]);

  useEffect(() => {
    const storedEpisodeId = getItem("episodeId") || "";
    if (episodeId !== storedEpisodeId) {
      // means, that user probably enter this episode by url change himself
      setItem("altArrowLeft", "");
      setItem("altArrowRight", "");
      setItem("altCurrent", "");

      setItem(`focusedCommand`, "");
      setItem("focusedCommandInsideType", `default?`);
      setItem(`focusedCommandType`, "command");
      setItem(`focusedCommandParentId`, "");
      setItem(`focusedCommandParentType`, "" as "if");
      setItem("focusedCommandOrder", 0);
      setItem("focusedCommandName", "" as AllPossiblePlotFieldComamndsTypes);
      setItem("focusedTopologyBlock", localTopologyBlockId || firstTopologyBlock?._id || "");
      removeItem("focusedConditionIsElse");

      setCurrentlyFocusedCommandId({} as SetCurrentlyFocusedCommandTypes);
      setItem("episodeId", episodeId || "");
      return;
    }
    const altArrowLeft = getItem("altArrowLeft") || "";
    const altArrowRight = getItem("altArrowRight") || "";
    const altCurrent = getItem("altCurrent") || "";

    // for search
    setItem("altArrowLeft", altArrowLeft);
    setItem("altArrowRight", altArrowRight);
    setItem("altCurrent", altCurrent);

    const focusedCommandId = getItem("focusedCommand") || "";
    const focusedCommandName = getItem("focusedCommandName") || ("" as AllPossiblePlotFieldComamndsTypes);
    const focusedCommandOrder = getItem("focusedCommandOrder") || 0;
    const focusedCommandType = getItem("focusedCommandType") || `command`;
    const focusedConditionIsElse = getItem("focusedConditionIsElse") || ``;
    const parentType = getItem("focusedCommandParentType") || (`` as "if");
    const parentId = getItem("focusedCommandParentId") || ``;
    // for focus
    setItem(`focusedCommand`, focusedCommandId);
    setItem(`focusedCommandName`, focusedCommandName);
    setItem(`focusedCommandOrder`, focusedCommandOrder);
    setItem("focusedCommandInsideType", getItem("focusedCommandInsideType") || `default?`);
    setItem(`focusedCommandType`, focusedCommandType);
    setItem(`focusedCommandParentId`, parentId);
    setItem(`focusedCommandParentType`, parentType);
    if (typeof focusedConditionIsElse === "boolean") {
      setItem("focusedConditionIsElse", focusedConditionIsElse);
    }

    if (focusedCommandId) {
      setCurrentlyFocusedCommandId({
        commandName: focusedCommandName as OmittedCommandNames,
        commandOrder: focusedCommandOrder,
        currentlyFocusedCommandId: focusedCommandId,
        type: focusedCommandType,
        isElse:
          parentType === "else"
            ? true
            : parentType === "if"
            ? false
            : typeof focusedConditionIsElse === "boolean"
            ? focusedConditionIsElse
            : undefined,
        parentId: parentId,
      });
    } else {
      setCurrentlyFocusedCommandId({} as SetCurrentlyFocusedCommandTypes);
    }
  }, []);
}
