import { AllPossibleCommandUndoTypes } from "../../../features/Editor/PlotField/Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";

type AddItemInUndoSessionStorageTypes = {
  _id: string;
  episodeId: string;
  topologyBlockId: string;
  type: AllPossibleCommandUndoTypes;
};

export const addItemInUndoSessionStorage = ({
  _id,
  type,
  episodeId,
  topologyBlockId,
}: AddItemInUndoSessionStorageTypes) => {
  const storageKey = `items-episode-${episodeId}-topologyBlock-${topologyBlockId}`;

  const allPossiblyToBeUndoItems = sessionStorage.getItem(
    `items-episode-${episodeId}-topologyBlock-${topologyBlockId}`
  );

  if (allPossiblyToBeUndoItems) {
    const newAllPossiblyToBeUndoItems = allPossiblyToBeUndoItems
      ? `${allPossiblyToBeUndoItems},${type}-${_id}`
      : `${type}-${_id}`;

    sessionStorage.setItem(storageKey, newAllPossiblyToBeUndoItems);
  } else {
    sessionStorage.setItem(storageKey, `${type}-${_id}`);
  }
};
