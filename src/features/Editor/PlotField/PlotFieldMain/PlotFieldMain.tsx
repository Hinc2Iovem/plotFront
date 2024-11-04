import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect } from "react";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import PlotfieldItem from "./Commands/PlotfieldItem";
import useGetAllPlotFieldCommands from "../hooks/useGetAllPlotFieldCommands";
import useUpdateCommandOrder from "../hooks/useUpdateCommandOrder";

type PlotFieldMainTypes = {
  topologyBlockId: string;
  showAllCommands: boolean;
  renderedAsSubPlotfield?: boolean;
};

export default function PlotFieldMain({
  topologyBlockId,
  showAllCommands,
  renderedAsSubPlotfield = false,
}: PlotFieldMainTypes) {
  const { getCommandsByTopologyBlockId, setAllCommands } =
    usePlotfieldCommands();
  const { data: plotfieldCommands } = useGetAllPlotFieldCommands({
    topologyBlockId,
  });

  useEffect(() => {
    if (plotfieldCommands) {
      setAllCommands({ commands: plotfieldCommands, topologyBlockId });
    }
  }, [plotfieldCommands]);

  const updateCommandOrder = useUpdateCommandOrder();

  const handleOnDragEnd = (result: DropResult) => {
    if (!result?.destination) return;

    const orderedCommands = [
      ...(getCommandsByTopologyBlockId({ topologyBlockId }) || []),
    ];
    const [reorderedItem] = orderedCommands.splice(result.source.index, 1);
    orderedCommands.splice(result.destination.index, 0, reorderedItem);
    updateCommandOrder.mutate({
      newOrder: result.destination.index,
      plotFieldCommandId: result.draggableId,
    });
    setAllCommands({ commands: orderedCommands, topologyBlockId });
  };

  return (
    <main
      className={`${showAllCommands ? "hidden" : ""} ${
        renderedAsSubPlotfield
          ? "h-fit max-h-[calc(100vh-8rem)] bg-secondary p-[.5rem]"
          : "h-[calc(100vh-8rem)]"
      } mt-[.5rem] overflow-y-auto | containerScroll px-[.5rem]`}
    >
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="plotFieldCommands">
          {(provided: DroppableProvided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-[1rem] w-full"
            >
              {getCommandsByTopologyBlockId({ topologyBlockId })?.map(
                (p, i) => {
                  return (
                    <Draggable key={p._id} draggableId={p._id} index={i}>
                      {(provided) => (
                        <PlotfieldItem provided={provided} {...p} />
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <div className={`h-[30rem] w-full bg-secondary`}></div>
    </main>
  );
}
