import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from "@hello-pangea/dnd";
import PlotfieldItemInsideIf from "../PlotfieldItemInsideIf";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import { useEffect, useRef, useState } from "react";
import useGetCurrentCommandOrderCommandIf from "../../../hooks/If/useGetCurrentCommandOrderCommandIf";
import useReorderElseCommands from "./useReorderElseCommands";
import useReorderIfCommands from "./useReorderIfCommands";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../Context/PlotfieldCommandIfSlice";
import useUpdateOrderInsideCommandIf from "../../../hooks/If/useUpdateOrderInsideCommandIf";

type PlotfieldIfItemsTypes = {
  hideCommands: boolean;
  isBackgroundFocused: boolean;
  isFocusedIf: boolean;
  commandIfId: string;
  droppableId: "commandIf" | "commandIfElse";
  isElse: boolean;
};

const delay = 5000;

export default function PlotfieldIfItems({
  commandIfId,
  droppableId,
  hideCommands,
  isBackgroundFocused,
  isElse,
  isFocusedIf,
}: PlotfieldIfItemsTypes) {
  const { getCommandsByCommandIfId, setAllIfCommands, updateCommandIfOrder } = usePlotfieldCommands();

  const updateCommandOrder = useUpdateOrderInsideCommandIf({ commandIfId });

  // If commands

  const [newlyFetchedIfCommands, setNewlyFetchedIfCommands] = useState(false);
  const { data: currentCommandOrdersIf, refetch } = useGetCurrentCommandOrderCommandIf({
    commandIfId,
    isElse: false,
  });

  const timerRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      refetch().then(() => {
        setNewlyFetchedIfCommands(true);
      });
    }, delay);
  };

  const handleDragStart = () => {
    setNewlyFetchedIfCommands(false);
    resetTimer();
  };

  const handleDragEnd = () => {
    setNewlyFetchedIfCommands(false);
    resetTimer();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useReorderIfCommands({
    currentCommandOrdersIf,
    commandIfId,
    currentCommandsState: getCommandsByCommandIfId({
      commandIfId,
      isElse: false,
    }),
    newlyFetchedIfCommands,
  });

  const handleOnDragEndInsideIf = (result: DropResult) => {
    if (!result?.destination) return;
    handleDragEnd();

    const orderedCommandsInsideIf = [...(getCommandsByCommandIfId({ commandIfId, isElse: false }) || [])];
    const [reorderedItem] = orderedCommandsInsideIf.splice(result.source.index, 1);

    orderedCommandsInsideIf.splice(result.destination.index, 0, reorderedItem);

    setAllIfCommands({
      commandIfId,
      commandsInsideIf: orderedCommandsInsideIf as PlotfieldOptimisticCommandInsideIfTypes[],
      commandsInsideElse: getCommandsByCommandIfId({
        commandIfId,
        isElse: true,
      }),
    });
    updateCommandIfOrder({
      commandOrder: result.destination.index,
      id: result.draggableId,
      isElse: false,
    });
    updateCommandOrder.mutate({
      newOrder: result.destination.index,
      plotFieldCommandId: result.draggableId,
    });
  };

  // Else commands

  const handleOnDragEndInsideElse = (result: DropResult) => {
    if (!result?.destination) return;
    handleDragEndElse();

    const orderedCommandsInsideElse = [...(getCommandsByCommandIfId({ commandIfId, isElse: true }) || [])];

    const [reorderedItem] = orderedCommandsInsideElse.splice(result.source.index, 1);
    orderedCommandsInsideElse.splice(result.destination.index, 0, reorderedItem);
    setAllIfCommands({
      commandIfId,
      commandsInsideIf: getCommandsByCommandIfId({
        commandIfId,
        isElse: false,
      }),
      commandsInsideElse: orderedCommandsInsideElse,
    });
    updateCommandIfOrder({
      commandOrder: result.destination.index,
      id: result.draggableId,
      isElse: true,
    });
    updateCommandOrder.mutate({
      newOrder: result.destination.index,
      plotFieldCommandId: result.draggableId,
    });
  };

  // Reordering Else

  const [newlyFetchedElseCommands, setNewlyFetchedElseCommands] = useState(false);
  const { data: currentCommandOrdersElse, refetch: refetchElse } = useGetCurrentCommandOrderCommandIf({
    commandIfId,
    isElse: true,
  });
  const timerElseRef = useRef<number | null>(null);

  const resetElseTimer = () => {
    if (timerElseRef.current) {
      clearTimeout(timerElseRef.current);
    }

    timerElseRef.current = setTimeout(() => {
      refetchElse().then(() => {
        setNewlyFetchedElseCommands(true);
      });
    }, delay);
  };

  const handleDragStartElse = () => {
    setNewlyFetchedElseCommands(false);
    resetElseTimer();
  };

  const handleDragEndElse = () => {
    setNewlyFetchedElseCommands(false);
    resetElseTimer();
  };

  useEffect(() => {
    return () => {
      if (timerElseRef.current) {
        clearTimeout(timerElseRef.current);
      }
    };
  }, []);

  useReorderElseCommands({
    currentCommandOrdersIf: currentCommandOrdersElse,
    commandIfId,
    currentCommandsState: getCommandsByCommandIfId({
      commandIfId,
      isElse: true,
    }),
    newlyFetchedIfCommands: newlyFetchedElseCommands,
  });

  return (
    <div
      className={`${hideCommands ? "hidden" : ""} flex ${
        droppableId === "commandIf" && isBackgroundFocused && isFocusedIf
          ? "bg-primary border-secondary border-dashed border-[3px]"
          : ""
      } ${
        droppableId === "commandIfElse" && isBackgroundFocused && isFocusedIf
          ? "bg-secondary border-dark-mid-gray border-dashed border-[3px]"
          : ""
      } ${droppableId === "commandIf" ? "bg-primary" : "bg-secondary"} flex-col rounded-md w-full`}
    >
      <DragDropContext
        onDragStart={isElse ? handleDragStartElse : handleDragStart}
        onDragEnd={isElse ? handleOnDragEndInsideElse : handleOnDragEndInsideIf}
      >
        <Droppable droppableId={droppableId}>
          {(provided: DroppableProvided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`flex flex-col gap-[.5rem] py-[.5rem] w-full`}
            >
              {getCommandsByCommandIfId({ commandIfId, isElse })?.map((p, i) => {
                return (
                  <Draggable key={p._id} draggableId={p._id} index={i}>
                    {(provided) => <PlotfieldItemInsideIf provided={provided} {...p} />}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className={`h-[10rem] w-full`}></div>
    </div>
  );
}
