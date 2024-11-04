import { useEffect, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import PlotfieldHeader from "./PlotFieldHeader/PlotfieldHeader";
import useGetTopologyBlockById from "./hooks/TopologyBlock/useGetTopologyBlockById";
import PlotFieldMain from "./PlotFieldMain/PlotFieldMain";
import ShowAllCommandsPlotfield from "./ShowAllCommands/ShowAllCommandsPlotfield";
import usePlotfieldCommands from "./Context/PlotFieldContext";
import useTopologyBlocks from "../Flowchart/Context/TopologyBlockContext";

type PlotFieldProps = {
  topologyBlockId: string;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  hideFlowchartFromScriptwriter: boolean;
  expansionDivDirection: "right" | "left";
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
  setExpansionDivDirection: React.Dispatch<
    React.SetStateAction<"right" | "left">
  >;
};

export default function PlotField({
  topologyBlockId,
  command,
  hideFlowchartFromScriptwriter,
  expansionDivDirection,
  setShowHeader,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
}: PlotFieldProps) {
  const { setCurrentAmountOfCommands } = usePlotfieldCommands();
  const { updateTopologyBlock } = useTopologyBlocks();
  const { data: rootTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId,
  });

  useEffect(() => {
    if (rootTopologyBlock) {
      setCurrentAmountOfCommands({
        topologyBlockId,
        amountOfCommands: rootTopologyBlock.topologyBlockInfo.amountOfCommands,
      });

      updateTopologyBlock({ newTopologyBlock: rootTopologyBlock });
    }
  }, [rootTopologyBlock, topologyBlockId, updateTopologyBlock]);

  const [currentTopologyBlockId, setCurrentTopologyBlockId] = useState("");

  const { data: currentTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: currentTopologyBlockId,
  });

  useEffect(() => {
    const handleUpdatingCommandsInfo = () => {
      const currentTopologyBlockId = sessionStorage.getItem(
        "focusedTopologyBlock"
      );
      if (
        currentTopologyBlockId?.trim().length &&
        currentTopologyBlockId !== topologyBlockId
      ) {
        setCurrentTopologyBlockId(currentTopologyBlockId);
      }
    };

    window.addEventListener("storage", handleUpdatingCommandsInfo);
    return () => {
      window.removeEventListener("storage", handleUpdatingCommandsInfo);
    };
  }, [topologyBlockId]);

  useEffect(() => {
    if (currentTopologyBlock) {
      setCurrentAmountOfCommands({
        topologyBlockId,
        amountOfCommands:
          currentTopologyBlock.topologyBlockInfo.amountOfCommands,
      });

      updateTopologyBlock({ newTopologyBlock: currentTopologyBlock });
    }
  }, [currentTopologyBlock, topologyBlockId, updateTopologyBlock]);

  const [showAllCommands, setShowAllCommands] = useState<boolean>(false);
  return (
    <section
      className={`${
        command === "expandPlotField" || expansionDivDirection === "right"
          ? "w-full"
          : " w-1/2"
      } ${
        command === "expandPlotField" || !command ? "" : "hidden"
      } flex-grow flex-shrink-0 bg-secondary rounded-md shadow-md min-h-[20rem] h-full relative p-[1rem]`}
    >
      <ShowAllCommandsPlotfield
        command={command}
        topologyBlockId={topologyBlockId}
        showAllCommands={showAllCommands}
        plotfieldExpanded={command === "expandPlotField"}
        setShowAllCommands={setShowAllCommands}
      />
      {rootTopologyBlock ? (
        <PlotfieldHeader
          setShowAllCommands={setShowAllCommands}
          showAllCommands={showAllCommands}
          hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
          setExpansionDivDirection={setExpansionDivDirection}
          setShowHeader={setShowHeader}
          topologyBlockId={topologyBlockId}
          setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
        />
      ) : null}
      <PlotFieldMain
        showAllCommands={showAllCommands}
        topologyBlockId={topologyBlockId}
      />
    </section>
  );
}
