import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useCreateTopologyBlock from "../PlotField/hooks/TopologyBlock/useCreateTopologyBlock";
import useGetAllTopologyBlockConnectionsByEpisodeId from "../PlotField/hooks/TopologyBlock/useGetAllTopologyBlockConnectionsByEpisodeId";
import useGetAllTopologyBlocksByEpisodeId from "../PlotField/hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import FlowchartArrowList from "./FlowchartArrowList";
import FlowchartTopologyBlockRemake from "./FlowchartTopologyBlockRemake";
import "./FlowchartStyles.css";
import { Button } from "@/components/ui/button";

type FlowChartTypes = {
  setScale: React.Dispatch<React.SetStateAction<number>>;
  hideFlowchartFromScriptwriter: boolean;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  scale: number;
  expansionDivDirection: "right" | "left";
};

export const SCROLLBAR_WIDTH = 17;

export default function Flowchart({
  scale,
  hideFlowchartFromScriptwriter,
  setScale,
  command,
  expansionDivDirection,
}: FlowChartTypes) {
  const { episodeId } = useParams();
  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId || "",
  });

  const { data: allConnections } = useGetAllTopologyBlockConnectionsByEpisodeId({ episodeId: episodeId || "" });

  const boundsRef = useRef<HTMLDivElement>(null);

  const handleZoom = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      if (delta < 0) {
        setScale((prevScale) => Math.max(prevScale + delta, 0.1));
      } else if (delta > 0 && scale <= 1.0) {
        setScale((prevScale) => Math.min(prevScale + delta, 1.0));
      } else {
        console.log("Cannot zoom more than 100%");
      }
    }
  };

  useEffect(() => {
    const bounds = boundsRef.current;
    if (bounds) {
      bounds.addEventListener("wheel", handleZoom);
      return () => {
        bounds.removeEventListener("wheel", handleZoom);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTopologyBlock = useCreateTopologyBlock({
    episodeId: episodeId || "",
  });

  return (
    <section
      ref={boundsRef}
      className={`${scale >= 0.99 ? "" : "border-secondary border-[4px] border-dashed"}
       ${hideFlowchartFromScriptwriter ? "hidden" : ""}
       ${command === "expandFlowchart" || expansionDivDirection === "left" ? "w-full" : "w-1/2"} ${
        command === "expandFlowchart" || !command ? "" : "hidden"
      } overflow-auto rounded-md shadow-md relative | containerScroll`}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="z-[2] border-secondary border-[4px] border-dashed w-full h-full rounded-md min-w-[500rem] min-h-[500rem] relative bg-primary-darker"
      >
        {allTopologyBlocks
          ? allTopologyBlocks.map((tb) => <FlowchartTopologyBlockRemake key={tb._id} {...tb} />)
          : null}
        {allConnections ? allConnections.map((c) => <FlowchartArrowList key={c._id} {...c} />) : null}
      </div>
      <Button
        onClick={() => createTopologyBlock.mutate()}
        className={`fixed bottom-[15px] ${
          command !== "expandFlowchart" ? "left-[calc(50%+.6rem)]" : "left-[20px]"
        } hover:shadow-md hover:shadow-brand-gradient-left active:scale-[.99] transition-all z-[10] px-[10px] py-[5px] text-text bg-brand-gradient rounded-md shadow-sm text-[14px]`}
      >
        Создать Блок
      </Button>

      <div className="absolute top-0 bottom-0 right-0 left-0 min-w-[500rem] min-h-[500rem] z-[1]">
        <div className="absolute bg-secondary left-[calc(50%-2px)] h-full w-[4px]"></div>
        <div className="absolute bg-secondary left-[calc(50%-2px)] h-full w-[4px] rotate-90"></div>
      </div>
    </section>
  );
}
