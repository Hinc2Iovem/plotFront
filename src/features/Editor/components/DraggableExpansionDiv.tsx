import { useRef, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

type DraggableExpansionDivTypes = {
  setExpansionDivDirection: React.Dispatch<
    React.SetStateAction<"left" | "right">
  >;
  setCommand: (
    value: React.SetStateAction<PossibleCommandsCreatedByCombinationOfKeysTypes>
  ) => void;
  setHideFlowchartFromScriptwriter: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
};

export default function DraggableExpansionDiv({
  setExpansionDivDirection,
  setCommand,
  setHideFlowchartFromScriptwriter,
}: DraggableExpansionDivTypes) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [totalDeltaX, setTotalDeltaX] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const dragThreshold = 5;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setTotalDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const deltaX = currentX - startX;

    setTotalDeltaX((prevDeltaX) => prevDeltaX + deltaX);

    const divElement = divRef.current;
    if (divElement) {
      divElement.style.left = `${divElement.offsetLeft + deltaX}px`;
    }

    // If the accumulated movement exceeds the threshold, update the direction and command
    if (Math.abs(totalDeltaX + deltaX) >= dragThreshold) {
      const movementDirection = totalDeltaX + deltaX > 0 ? "right" : "left";
      setCommand(
        movementDirection === "right" ? "expandPlotField" : "expandFlowchart"
      );
      setHideFlowchartFromScriptwriter(
        movementDirection === "right" ? true : false
      );
      setExpansionDivDirection(movementDirection);
      setIsDragging(false);
    }

    setStartX(currentX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={divRef}
      className={`absolute top-[calc(50%-1.65rem)] -translate-y-1/2 -translate-x-1/2 shadow-md left-1/2 bg-gray-200 w-[1rem] h-[4rem] rounded-md z-[10] cursor-move`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    ></div>
  );
}
