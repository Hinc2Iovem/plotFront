import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from "@hello-pangea/dnd";
import { useEffect } from "react";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import PlotfieldItem from "./Commands/PlotfieldItem";
import useGetAllPlotFieldCommands from "../hooks/useGetAllPlotFieldCommands";
import useUpdateCommandOrder from "../hooks/useUpdateCommandOrder";
import useHandleAllCommandsCreatedViaKeyCombination from "../../../../hooks/helpers/Plotfield/CreatingViaKeyCombination/useHandleAllCommandsCreatedViaKeyCombination";
import useHandleDuplicationOfAllCommands from "../../../../hooks/helpers/Plotfield/Duplication/useHandleDuplicationOfAllCommands";
import useHandleNavigationThroughCommands from "../../../../hooks/helpers/Plotfield/navigationHelpers/hooks/useHandleNavigationThroughCommands";
import useHandleDeletionOfCommand from "../hooks/helpers/useHandleDeletionOfCommand";
import useNavigation from "../../Context/Navigation/NavigationContext";

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
  const { currentTopologyBlock } = useNavigation();

  const {
    getCommandsByTopologyBlockId,
    setAllCommands,
    updateCommandOrder: updateCommandOrderOptimistic,
  } = usePlotfieldCommands();

  const { data: plotfieldCommands } = useGetAllPlotFieldCommands({
    topologyBlockId: renderedAsSubPlotfield ? topologyBlockId : currentTopologyBlock._id,
  });

  useEffect(() => {
    if (plotfieldCommands) {
      setAllCommands({
        commands: plotfieldCommands,
        topologyBlockId: renderedAsSubPlotfield ? topologyBlockId : currentTopologyBlock._id,
      });
    }
  }, [plotfieldCommands]);

  const updateCommandOrder = useUpdateCommandOrder();

  const handleOnDragEnd = (result: DropResult) => {
    if (!result?.destination) return;

    const orderedCommands = [...(getCommandsByTopologyBlockId({ topologyBlockId }) || [])];
    const [reorderedItem] = orderedCommands.splice(result.source.index, 1);
    orderedCommands.splice(result.destination.index, 0, reorderedItem);
    updateCommandOrder.mutate({
      newOrder: result.destination.index,
      plotFieldCommandId: result.draggableId,
    });
    updateCommandOrderOptimistic({
      commandOrder: result.destination.index,
      id: result.draggableId,
      topologyBlockId: renderedAsSubPlotfield ? topologyBlockId : currentTopologyBlock._id,
    });

    setAllCommands({ commands: orderedCommands, topologyBlockId });
  };

  useHandleAllCommandsCreatedViaKeyCombination({
    topologyBlockId: currentTopologyBlock._id,
  });
  useHandleDuplicationOfAllCommands();
  // {
  //   topologyBlockId: currentTopologyBlock._id,
  // }
  useHandleNavigationThroughCommands();
  useHandleDeletionOfCommand();

  return (
    <main
      className={`${showAllCommands ? "hidden" : ""} ${
        renderedAsSubPlotfield
          ? "h-fit max-h-[calc(100vh-80px)] border-border border-[3px] rounded-md p-[5px]"
          : "h-[calc(100vh-80px)]"
      } mt-[5px] overflow-y-auto | containerScroll px-[5px]`}
    >
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="plotFieldCommands">
          {(provided: DroppableProvided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-[1rem] w-full">
              {getCommandsByTopologyBlockId({ topologyBlockId })?.map((p, i) => {
                return (
                  <Draggable key={p._id} draggableId={p._id} index={i}>
                    {(provided) => (
                      <PlotfieldItem
                        provided={provided}
                        currentTopologyBlockId={renderedAsSubPlotfield ? topologyBlockId : p.topologyBlockId}
                        {...p}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <div className={`h-[30rem] w-full bg-background`}></div>
    </main>
  );
}
