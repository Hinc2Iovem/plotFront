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
  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const setCurrentTopologyBlock = useNavigation((state) => state.setCurrentTopologyBlock);
  const setCurrentAmountOfCommands = usePlotfieldCommands((state) => state.setCurrentAmountOfCommands);

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

  const [showAllCommands] = useState<boolean>(false);
  return (
    <section
      className={`${command === "expandPlotField" || expansionDivDirection === "right" ? "w-full" : " w-1/2"} ${
        command === "expandPlotField" || !command ? "" : "hidden"
      } flex-grow ${
        showUtils ? "" : "flex-shrink-0"
      } border-border mt-[10px] border-[1px] rounded-md shadow-md min-h-[200px] h-full relative p-[10px]`}
    >
      <PlotFieldMain command={command} showAllCommands={showAllCommands} topologyBlockId={currentTopologyBlock._id} />
    </section>
  );
}
