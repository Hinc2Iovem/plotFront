import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import useNavigation from "@/features/Editor/Context/Navigation/NavigationContext";
import useDeleteTopologyBlockById from "@/features/Editor/PlotField/hooks/TopologyBlock/useDeleteTopologyBlock";
import { getAllPlotfieldCommands } from "@/features/Editor/PlotField/hooks/useGetAllPlotFieldCommands";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "@/hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import { TopologyBlockTypes } from "@/types/TopologyBlock/TopologyBlockTypes";
import { useQueryClient } from "@tanstack/react-query";
import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type ToolbarNode = Node<
  {
    label?: number;
  } & TopologyBlockTypes,
  "toolbar"
>;

export default function NodeWithToolbar(props: NodeProps<ToolbarNode>) {
  const { episodeId } = useParams();
  const { setNodes, setEdges } = useReactFlow();
  const [clicked, setClicked] = useState(false);
  const deleteTopologyBlock = useDeleteTopologyBlockById({ topologyBlockId: props.id });

  const handleDelete = () => {
    deleteTopologyBlock.mutate();
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== props.id));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== props.id && edge.target !== props.id));
  };

  //   const handleEdit = () => {
  //     //
  //   };

  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const setCurrentTopologyBlock = useNavigation((state) => state.setCurrentTopologyBlock);

  const { setItem } = useTypedSessionStorage<SessionStorageKeys>();

  const queryClient = useQueryClient();

  const prefetchCommands = () => {
    queryClient.prefetchQuery({
      queryKey: ["plotfield", "topologyBlock", props.id],
      queryFn: () => getAllPlotfieldCommands({ topologyBlockId: props.id }),
    });
  };

  const onClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    prefetchCommands();
    if (clicked) {
      localStorage.setItem(`${episodeId}-topologyBlockId`, JSON.stringify(props.id));
      setItem(`focusedTopologyBlock`, props.id);
      setItem(`focusedCommand`, ``);
      setCurrentTopologyBlock({
        _id: props.id,
        coordinatesX: props.data.coordinatesX,
        coordinatesY: props.data.coordinatesY,
        episodeId,
        isStartingTopologyBlock: props.data.isStartingTopologyBlock,
        topologyBlockInfo: props.data.topologyBlockInfo,
        name: props.data.name,
      });
      setClicked(false);
      ({ value: true });
    } else {
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, 300);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger onClick={(e) => onClick(e)}>
        <div
          className={`${
            currentTopologyBlock._id === props.id
              ? "bg-brand-gradient text-white"
              : "bg-white hover:bg-slate-200 text-black"
          }  w-[100px] text-center rounded-sm`}
        >
          {props.data.label}

          <Handle type="source" position={Position.Right} />
          <Handle type="target" position={Position.Left} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* <ContextMenuItem onClick={handleEdit}>Изменить</ContextMenuItem> */}
        <ContextMenuItem onClick={handleDelete}>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
