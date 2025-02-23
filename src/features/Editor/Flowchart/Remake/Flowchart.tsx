import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "@/const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import useGetAllTopologyBlockConnectionsByEpisodeId from "../../PlotField/hooks/TopologyBlock/useGetAllTopologyBlockConnectionsByEpisodeId";
import useGetAllTopologyBlocksByEpisodeId from "../../PlotField/hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";

import "@xyflow/react/dist/style.css";
import NodeWithToolbar from "./CustomNodes/NodeWithToolbar";
import { TopologyBlockTypes } from "@/types/TopologyBlock/TopologyBlockTypes";

type FlowchartTypes = {
  keyCombinationToExpandPlotField: PossibleCommandsCreatedByCombinationOfKeysTypes;
  hideFlowchartFromScriptwriter: boolean;
  expansionDivDirection: "right" | "left";
};

const nodeTypes = {
  toolbarNode: NodeWithToolbar,
};

export default function Flowchart({
  keyCombinationToExpandPlotField,
  hideFlowchartFromScriptwriter,
  expansionDivDirection,
}: FlowchartTypes) {
  const { episodeId } = useParams();
  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId || "",
  });

  const { data: allConnections } = useGetAllTopologyBlockConnectionsByEpisodeId({ episodeId: episodeId || "" });

  const memoizedNodes: Node[] = useMemo(() => {
    if (allTopologyBlocks) {
      const nodes: Node[] = [];
      allTopologyBlocks.map((t) => {
        nodes.push({
          id: t._id,
          type: "toolbarNode",
          data: { label: t.name, ...t } as TopologyBlockTypes,
          position: { x: t.coordinatesX, y: t.coordinatesY },
        });
      });

      return nodes;
    }
    return [];
  }, [allTopologyBlocks]);

  const memoizedEdges: Edge[] = useMemo(() => {
    if (allConnections) {
      const edges: Edge[] = [];
      allConnections.map((c) => {
        edges.push({
          id: c._id,
          source: c.sourceBlockId,
          target: c.targetBlockId,
          type: "default",
        });
      });
      return edges;
    }
    return [];
  }, [allConnections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(memoizedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(memoizedEdges);

  useEffect(() => {
    if (allTopologyBlocks) {
      setNodes(memoizedNodes);
    }
  }, [allTopologyBlocks, memoizedNodes]);

  useEffect(() => {
    if (allConnections) {
      setEdges(memoizedEdges);
    }
  }, [allConnections, memoizedEdges]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  //   TODO: make it optimistic
  //   const createTopologyBlock = useCreateTopologyBlock({
  //     episodeId: episodeId || "",
  //   });

  return (
    <div
      className={`
        ${hideFlowchartFromScriptwriter ? "hidden" : ""}
       ${
         keyCombinationToExpandPlotField === "expandFlowchart" || expansionDivDirection === "left"
           ? "h-[100vh] w-[100vw]"
           : "h-[100vh] w-[50vw]"
       } ${keyCombinationToExpandPlotField === "expandFlowchart" || !keyCombinationToExpandPlotField ? "" : "hidden"}`}
    >
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
      >
        <Controls showInteractive={false} />
        <MiniMap bgColor="#1e1e1e" maskColor="#171717" position="top-right" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <div className=" bg-[#0c0c0c] w-[70px] h-[20px] z-[10] absolute bottom-0 right-0"></div>
        {/* <Button
          onClick={() =>
            setNodes((prev) => [
              ...prev,
              {
                data: {
                  label: "gfdgdfg",
                },
                id: "gdfgfdg",
                position: { x: 100, y: 100 },
                type: "toolbarNode",
              },
            ])
          }
          className=" bg-brand-gradient hover:opacity-90 hover:scale-[1.03] transition-all active:scale-[.98] text-white z-[10] absolute bottom-0 right-0"
        >
          + Блок
        </Button> */}
      </ReactFlow>
    </div>
  );
}
