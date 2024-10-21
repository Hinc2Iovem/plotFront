import { useEffect, useState } from "react";
import { ChoiceOptionVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useGetAllChoiceOptionsByChoiceId from "../../hooks/Choice/ChoiceOption/useGetChoiceAllChoiceOptionsByChoiceId";
import useChoiceOptions from "../Context/ChoiceContext";
import ChoiceOptionBlock from "./ChoiceOptionBlock";
import PlotfieldInsideChoiceOption from "./PlotfieldInsideChoiceOption/PlotfieldInsideChoiceOption";

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
  const { setChoiceOptions, getAllChoiceOptionsByChoiceId, choices } =
    useChoiceOptions();
  const [updated, setUpdated] = useState(false);
  const [showOptionPlot, setShowOptionPlot] = useState(false);

  const { data: allChoiceOptionBlocks } = useGetAllChoiceOptionsByChoiceId({
    plotFieldCommandChoiceId: plotFieldCommandId,
    language: "russian",
  });

  useEffect(() => {
    if (allChoiceOptionBlocks) {
      setChoiceOptions({ choiceId, choiceOptions: allChoiceOptionBlocks });

      return () => {
        setUpdated(true);
      };
    }
  }, [allChoiceOptionBlocks]);

  console.log("choices: ", choices);
  console.log("allChoiceOptionBlocks: ", allChoiceOptionBlocks);

  return (
    <section
      className={`w-full ${
        showOptionPlot
          ? ""
          : "grid grid-cols-[repeat(auto-fill,minmax(23rem,1fr))] gap-[1rem] items-center"
      } bg-primary rounded-md shadow-md p-[.5rem]`}
    >
      <PlotfieldInsideChoiceOption
        choiceId={choiceId}
        showOptionPlot={showOptionPlot}
        setShowOptionPlot={setShowOptionPlot}
      />

      {getAllChoiceOptionsByChoiceId({ choiceId })?.map((co) => (
        <ChoiceOptionBlock
          key={co.choiceOptionId}
          showOptionPlot={showOptionPlot}
          choiceId={choiceId}
          plotFieldCommandId={plotFieldCommandId}
          currentTopologyBlockId={currentTopologyBlockId}
          amountOfOptions={amountOfOptions}
          setShowOptionPlot={setShowOptionPlot}
          updated={updated}
          {...co}
        />
      ))}
    </section>
  );
}
