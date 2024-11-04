import { useEffect, useState } from "react";
import { TopologyBlockConnectionTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";
import useGetTopologyBlockById from "../PlotField/hooks/TopologyBlock/useGetTopologyBlockById";
import { FlowchartArrow } from "./FlowchartArrow";
import useCoordinates from "./Context/useCoordinates";

export default function FlowchartArrowList({
  sourceBlockId,
  targetBlockId,
}: TopologyBlockConnectionTypes) {
  const { coordinates } = useCoordinates();

  const { data: sourceBlock } = useGetTopologyBlockById({
    topologyBlockId: sourceBlockId,
  });
  const { data: targetBlock } = useGetTopologyBlockById({
    topologyBlockId: targetBlockId,
  });

  const [sourceCoordinates, setSourceCoordinates] = useState<{
    coordinatesX: number;
    coordinatesY: number;
  } | null>(null);
  const [targetCoordinates, setTargetCoordinates] = useState<{
    coordinatesX: number;
    coordinatesY: number;
  } | null>(null);

  useEffect(() => {
    if (sourceBlock) {
      setSourceCoordinates({
        coordinatesX: sourceBlock.coordinatesX,
        coordinatesY: sourceBlock.coordinatesY,
      });
    }
    if (coordinates._id === sourceBlockId) {
      setSourceCoordinates({
        coordinatesX: coordinates.coordinatesX,
        coordinatesY: coordinates.coordinatesY,
      });
    }
  }, [sourceBlock, coordinates, sourceBlockId]);

  useEffect(() => {
    if (targetBlock) {
      setTargetCoordinates({
        coordinatesX: targetBlock.coordinatesX,
        coordinatesY: targetBlock.coordinatesY,
      });
    }
    if (coordinates._id === targetBlockId) {
      setTargetCoordinates({
        coordinatesX: coordinates.coordinatesX,
        coordinatesY: coordinates.coordinatesY,
      });
    }
  }, [targetBlock, coordinates, targetBlockId]);

  return (
    <>
      {targetCoordinates && sourceCoordinates ? (
        <FlowchartArrow
          endPoint={{
            x: targetCoordinates.coordinatesX,
            y: targetCoordinates.coordinatesY,
          }}
          startPoint={{
            x: sourceCoordinates.coordinatesX,
            y: sourceCoordinates.coordinatesY,
          }}
          config={{
            arrowColor: "white",
            strokeWidth: 2,
            dotEndingBackground: "black",
            dotEndingRadius: 3,
            arrowHeadEndingSize: 10,
          }}
        />
      ) : null}
    </>
  );
}
