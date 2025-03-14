import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";
import useNavigation from "../Context/Navigation/NavigationContext";
import useUpdateTopologyBlockCoordinates from "../PlotField/hooks/TopologyBlock/useUpdateTopologyBlockCoordinates";
import { getAllPlotfieldCommands } from "../PlotField/hooks/useGetAllPlotFieldCommands";
import useCoordinates from "./Context/useCoordinates";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import "./FlowchartStyles.css";

export default function FlowchartTopologyBlock({
  _id,
  coordinatesX,
  coordinatesY,
  episodeId,
  name,
  isStartingTopologyBlock,
  topologyBlockInfo,
}: TopologyBlockTypes) {
  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const setCurrentTopologyBlock = useNavigation((state) => state.setCurrentTopologyBlock);

  const { setItem } = useTypedSessionStorage<SessionStorageKeys>();

  const { coordinates, setCoordinates } = useCoordinates();
  const topologyBlockRef = useRef<HTMLDivElement>(null);
  const [localCoordinates, setLocalCoordinates] = useState<{
    coordinatesX: number;
    coordinatesY: number;
  } | null>({
    coordinatesX,
    coordinatesY,
  });

  useEffect(() => {
    if (coordinatesX && coordinatesY) {
      setLocalCoordinates({ coordinatesX, coordinatesY });
    }
  }, [coordinatesX, coordinatesY]);

  useEffect(() => {
    if (_id === coordinates._id) {
      setLocalCoordinates({
        coordinatesX: coordinates.coordinatesX,
        coordinatesY: coordinates.coordinatesY,
      });
    }
  }, [_id, coordinates]);

  const updateCoordinates = useUpdateTopologyBlockCoordinates({
    topologyBlockId: _id,
  });

  const handleDragOnStop = (_e: DraggableEvent, ui: DraggableData) => {
    setCoordinates({ _id, coordinatesX: ui.x, coordinatesY: ui.y });
    updateCoordinates.mutate({
      coordinatesX: ui.x,
      coordinatesY: ui.y,
    });
  };

  const [clicked, setClicked] = useState(false);

  const queryClient = useQueryClient();
  const prefetchCommands = () => {
    queryClient.prefetchQuery({
      queryKey: ["plotfield", "topologyBlock", _id],
      queryFn: () => getAllPlotfieldCommands({ topologyBlockId: _id }),
    });
  };

  return (
    <>
      {coordinates ? (
        <Draggable
          nodeRef={topologyBlockRef}
          defaultPosition={{
            x: localCoordinates?.coordinatesX || 0,
            y: localCoordinates?.coordinatesY || 0,
          }}
          position={{
            x: localCoordinates?.coordinatesX || 0,
            y: localCoordinates?.coordinatesY || 0,
          }}
          onStop={handleDragOnStop}
          bounds="parent"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              prefetchCommands();
              if (clicked) {
                localStorage.setItem(`${episodeId}-topologyBlockId`, JSON.stringify(_id));
                setItem(`focusedTopologyBlock`, _id);
                setItem(`focusedCommand`, ``);
                setCurrentTopologyBlock({
                  _id,
                  coordinatesX,
                  coordinatesY,
                  episodeId,
                  isStartingTopologyBlock,
                  topologyBlockInfo,
                  name,
                });
                setClicked(false);
                ({ value: true });
              } else {
                setClicked(true);
                setTimeout(() => {
                  setClicked(false);
                }, 300);
              }
            }}
            ref={topologyBlockRef}
            className={` ${
              currentTopologyBlock._id === _id ? `border-border border-[3px]` : "bg-secondary "
            } text-text z-[10] w-[100px] text-[20px] rounded-md shadow-md absolute px-[10px] py-[5px] active:cursor-move cursor-default whitespace-nowrap min-w-fit`}
          >
            {name}
          </div>
        </Draggable>
      ) : null}
    </>
  );
}
