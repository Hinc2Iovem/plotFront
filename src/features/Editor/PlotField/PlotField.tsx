import { useEffect, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import useNavigation from "../Context/Navigation/NavigationContext";
import usePlotfieldCommands from "./Context/PlotFieldContext";
import useGetTopologyBlockById from "./hooks/TopologyBlock/useGetTopologyBlockById";
import PlotFieldMain from "./PlotFieldMain/PlotFieldMain";

type PlotFieldProps = {
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  showUtils: boolean;
  expansionDivDirection: "right" | "left";
};

export default function PlotField({ command, showUtils, expansionDivDirection }: PlotFieldProps) {
  const { currentTopologyBlock, setCurrentTopologyBlock } = useNavigation();
  const { setCurrentAmountOfCommands } = usePlotfieldCommands();

  const { data: topologyBlockData } = useGetTopologyBlockById({
    topologyBlockId: currentTopologyBlock._id,
  });

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
      } flex-grow ${
        showUtils ? "" : "flex-shrink-0"
      } border-border border-[1px] rounded-md shadow-md min-h-[200px] h-full relative p-[10px]`}
    >
      {/* {topologyBlockData ? (
        <PlotfieldHeader
          setShowAllCommands={setShowAllCommands}
          showAllCommands={showAllCommands}
          hideFlowchartFromScriptwriter={hideFlowchartFromScriptwriter}
          setExpansionDivDirection={setExpansionDivDirection}
          topologyBlockId={currentTopologyBlock._id}
          setHideFlowchartFromScriptwriter={setHideFlowchartFromScriptwriter}
        />
      ) : null} */}
      <PlotFieldMain showAllCommands={showAllCommands} topologyBlockId={currentTopologyBlock._id} />
    </section>
  );
}
