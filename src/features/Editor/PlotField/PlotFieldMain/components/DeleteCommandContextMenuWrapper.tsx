import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import useDeletePlotfieldCommand from "../../hooks/useDeletePlotfieldCommand";

type DeleteCommandContextMenuWrapperTypes = {
  children: React.ReactNode;
  plotfieldCommandId: string;
  topologyBlockId: string;
  className?: string;
};

export default function DeleteCommandContextMenuWrapper({
  children,
  plotfieldCommandId,
  topologyBlockId,
  className,
}: DeleteCommandContextMenuWrapperTypes) {
  const currentPlotfieldCommand = usePlotfieldCommands((state) => state.getCommandByPlotfieldCommandId);
  const getElseOrEnd = usePlotfieldCommands((state) => state.getCommandByPlotfieldCommandIfId);
  const removeCommandItem = usePlotfieldCommands((state) => state.removeCommandItem);
  const updateCommandInfo = usePlotfieldCommands((state) => state.updateCommandInfo);

  const deletePlotfieldCommand = useDeletePlotfieldCommand({ plotfieldCommandId });

  const handleDelete = () => {
    const currentCommand = currentPlotfieldCommand({ plotfieldCommandId, topologyBlockId });
    console.log("currentCommand: ", currentCommand);

    if (currentCommand && currentCommand.command === "if") {
      console.log(
        `getElseOrEnd({ elseOrEnd: "else", plotfieldCommandIfId: currentCommand.plotfieldCommandIfId || "" }) : `,
        getElseOrEnd({ elseOrEnd: "else", plotfieldCommandIfId: currentCommand.plotfieldCommandIfId || "" })
      );

      removeCommandItem({
        id:
          getElseOrEnd({ elseOrEnd: "else", plotfieldCommandIfId: currentCommand.plotfieldCommandIfId || "" })?._id ||
          "",
        topologyBlockId,
      });
      updateCommandInfo({ addOrMinus: "minus", topologyBlockId });
      removeCommandItem({
        id:
          getElseOrEnd({ elseOrEnd: "end", plotfieldCommandIfId: currentCommand.plotfieldCommandIfId || "" })?._id ||
          "",
        topologyBlockId,
      });
      updateCommandInfo({ addOrMinus: "minus", topologyBlockId });
    }

    removeCommandItem({ topologyBlockId, id: plotfieldCommandId });
    updateCommandInfo({ addOrMinus: "minus", topologyBlockId });

    deletePlotfieldCommand.mutate({});
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleDelete}>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
