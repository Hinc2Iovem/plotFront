import { useEffect, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useNavigation from "../Context/Navigation/NavigationContext";
import usePlotfieldCommands from "./Context/PlotFieldContext";
import useGetTopologyBlockById from "./hooks/TopologyBlock/useGetTopologyBlockById";
import PlotfieldHeader from "./PlotFieldHeader/PlotfieldHeader";
import PlotFieldMain from "./PlotFieldMain/PlotFieldMain";

type PlotFieldProps = {
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  hideFlowchartFromScriptwriter: boolean;
  expansionDivDirection: "right" | "left";
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<React.SetStateAction<boolean | null>>;
  setExpansionDivDirection: React.Dispatch<React.SetStateAction<"right" | "left">>;
};

export default function PlotField({
  command,
  hideFlowchartFromScriptwriter,
  expansionDivDirection,
  setShowHeader,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
}: PlotFieldProps) {
  const { currentTopologyBlock, setCurrentTopologyBlock } = useNavigation();
  const { setCurrentAmountOfCommands } = usePlotfieldCommands();
  const { data: rootTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: currentTopologyBlock._id,
  });

  useEffect(() => {
    if (rootTopologyBlock) {
      setCurrentAmountOfCommands({
        topologyBlockId: currentTopologyBlock._id,
        amountOfCommands: rootTopologyBlock.topologyBlockInfo.amountOfCommands,
      });
    }
  }, [rootTopologyBlock, currentTopologyBlock]);

  const { data: topologyBlockData } = useGetTopologyBlockById({
    topologyBlockId: currentTopologyBlock._id,
  });

  // TODO this zalupa dolshna bit somewhere else
  // useEffect(() => {
  //   const handleUpdatingCommandsInfo = () => {
  //     const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");
  //     if (currentTopologyBlockId?.trim().length && currentTopologyBlockId !== currentTopologyBlock._id) {

  //     }
  //   };

  //   window.addEventListener("storage", handleUpdatingCommandsInfo);
  //   return () => {
  //     window.removeEventListener("storage", handleUpdatingCommandsInfo);
  //   };
  // }, [currentTopologyBlock]);

  useEffect(() => {
    if (topologyBlockData) {
      setCurrentAmountOfCommands({
        topologyBlockId: currentTopologyBlock._id,
        amountOfCommands: topologyBlockData.topologyBlockInfo.amountOfCommands,
      });
      setCurrentTopologyBlock({ ...topologyBlockData });
    }
  }, [topologyBlockData, currentTopologyBlock._id]);

  const [showAllCommands, setShowAllCommands] = useState<boolean>(false);
  return (
    <section
      className={`${command === "expandPlotField" || expansionDivDirection === "right" ? "w-full" : " w-1/2"} ${
        command === "expandPlotField" || !command ? "" : "hidden"
      } flex-grow flex-shrink-0 bg-secondary rounded-md shadow-md min-h-[20rem] h-full relative p-[1rem]`}
    >
      {/* <ShowAllCommandsPlotfield
        command={command}
        topologyBlockId={currentTopologyBlock._id}
        showAllCommands={showAllCommands}
        plotfieldExpanded={command === "expandPlotField"}
        setShowAllCommands={setShowAllCommands}
      /> */}
      {rootTopologyBlock ? (
        <PlotfieldHeader
          setShowAllCommands={setShowAllCommands}
          showAllCommands={showAllCommands}
          hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
          setExpansionDivDirection={setExpansionDivDirection}
          setShowHeader={setShowHeader}
          topologyBlockId={currentTopologyBlock._id}
          setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
        />
      ) : null}
      <PlotFieldMain showAllCommands={showAllCommands} topologyBlockId={currentTopologyBlock._id} />
    </section>
  );
}
