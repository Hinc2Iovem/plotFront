import { useEffect, useState } from "react";
import useGetAllChoiceOptionsByChoiceId from "../../hooks/Choice/ChoiceOption/useGetChoiceAllChoiceOptionsByChoiceId";
import ChoiceOptionBlock from "./ChoiceOptionBlock";
import { useQueryClient } from "@tanstack/react-query";
import PlotfieldInsideChoiceOption from "./PlotfieldInsideChoiceOption/PlotfieldInsideChoiceOption";
import { ChoiceOptionVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type ChoiceOptionBlockTypes = {
  currentTopologyBlockId: string;
  plotFieldCommandId: string;
  amountOfOptions: number;
  choiceId: string;
};

export type ChoiceOptionTypesAndTopologyBlockIdsTypes = {
  topologyBlockId?: string;
  type: ChoiceOptionVariationsTypes;
  option?: string;
  choiceOptionId: string;
};

export default function ChoiceOptionBlocksList({
  currentTopologyBlockId,
  plotFieldCommandId,
  amountOfOptions,
  choiceId,
}: ChoiceOptionBlockTypes) {
  const queryClient = useQueryClient();
  const [
    allChoiceOptionTypesAndTopologyBlockIds,
    setAllChoiceOptionTypesAndTopologyBlockIds,
  ] = useState<ChoiceOptionTypesAndTopologyBlockIdsTypes[]>([]);
  const [showOptionPlot, setShowOptionPlot] = useState(false);
  const [showedOptionPlotTopologyBlockId, setShowedOptionPlotTopologyBlockId] =
    useState("");

  const [optionOrderToRevalidate, setOptionOrderToRevalidate] = useState<
    number | undefined
  >();
  const [optionOrderIdNotToRevalidate, setOptionOrderIdNotToRevalidate] =
    useState("");
  const [optionOrderIdToRevalidate, setOptionOrderIdToRevalidate] =
    useState("");

  const { data: allChoiceOptionBlocks } = useGetAllChoiceOptionsByChoiceId({
    plotFieldCommandChoiceId: plotFieldCommandId,
    language: "russian",
  });

  useEffect(() => {
    if (
      optionOrderIdNotToRevalidate?.trim().length &&
      typeof optionOrderToRevalidate === "number"
    ) {
      queryClient.invalidateQueries({
        queryKey: ["choiceOption", optionOrderIdToRevalidate],
        exact: true,
        type: "active",
      });
    }
  }, [
    optionOrderIdNotToRevalidate,
    optionOrderToRevalidate,
    optionOrderIdToRevalidate,
  ]);

  return (
    <section
      className={`${allChoiceOptionBlocks?.length ? "" : "hidden"} w-full ${
        showOptionPlot
          ? ""
          : "grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[1rem] items-center"
      } bg-neutral-magnolia rounded-md shadow-md p-[.5rem]`}
    >
      <PlotfieldInsideChoiceOption
        choiceId={choiceId}
        showOptionPlot={showOptionPlot}
        showedOptionPlotTopologyBlockId={showedOptionPlotTopologyBlockId}
        allChoiceOptionTypesAndTopologyBlockIds={
          allChoiceOptionTypesAndTopologyBlockIds
        }
        plotFieldCommandId={plotFieldCommandId}
        setShowOptionPlot={setShowOptionPlot}
        setShowedOptionPlotTopologyBlockId={setShowedOptionPlotTopologyBlockId}
        setAllChoiceOptionTypesAndTopologyBlockIds={
          setAllChoiceOptionTypesAndTopologyBlockIds
        }
      />

      {allChoiceOptionBlocks?.map((co) => (
        <ChoiceOptionBlock
          showOptionPlot={showOptionPlot}
          plotFieldCommandId={plotFieldCommandId}
          currentTopologyBlockId={currentTopologyBlockId}
          amountOfOptions={amountOfOptions}
          setShowOptionPlot={setShowOptionPlot}
          setShowedOptionPlotTopologyBlockId={
            setShowedOptionPlotTopologyBlockId
          }
          setAllChoiceOptionTypesAndTopologyBlockIds={
            setAllChoiceOptionTypesAndTopologyBlockIds
          }
          setOptionOrderToRevalidate={setOptionOrderToRevalidate}
          setOptionOrderIdNotToRevalidate={setOptionOrderIdNotToRevalidate}
          setOptionOrderIdToRevalidate={setOptionOrderIdToRevalidate}
          optionOrderIdNotToRevalidate={optionOrderIdNotToRevalidate}
          optionOrderToRevalidate={optionOrderToRevalidate}
          key={co._id}
          {...co}
        />
      ))}
    </section>
  );
}
