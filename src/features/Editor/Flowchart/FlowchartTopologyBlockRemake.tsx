import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";
import useUpdateTopologyBlockCoordinates from "../PlotField/PlotFieldMain/Commands/hooks/TopologyBlock/useUpdateTopologyBlockCoordinates";
import useCoordinates from "./Context/useCoordinates";
import "./FlowchartStyles.css";
import { useQueryClient } from "@tanstack/react-query";
import { getAllPlotfieldCommands } from "../PlotField/PlotFieldMain/Commands/hooks/useGetAllPlotFieldCommands";

type FlowchartTopologyBlockTypes = {
  setCurrentTopologyBlockId: React.Dispatch<React.SetStateAction<string>>;
  currentTopologyBlockId: string;
} & TopologyBlockTypes;

export default function FlowchartTopologyBlock({
  _id,
  coordinatesX,
  coordinatesY,
  episodeId,
  name,
  setCurrentTopologyBlockId,
  currentTopologyBlockId,
}: FlowchartTopologyBlockTypes) {
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
                localStorage.setItem(`${episodeId}-topologyBlockId`, _id);
                setCurrentTopologyBlockId(_id);
                setClicked(false);
              } else {
                setClicked(true);
                setTimeout(() => {
                  setClicked(false);
                }, 300);
              }
            }}
            ref={topologyBlockRef}
            className={` ${
              currentTopologyBlockId === _id
                ? "bg-green-300 text-white"
                : "bg-white "
            } z-[10] w-[10rem] text-[2rem] rounded-md shadow-md absolute px-[1rem] py-[.5rem] active:cursor-move cursor-default whitespace-nowrap min-w-fit`}
          >
            {name}
          </div>
        </Draggable>
      ) : null}
    </>
  );
}
