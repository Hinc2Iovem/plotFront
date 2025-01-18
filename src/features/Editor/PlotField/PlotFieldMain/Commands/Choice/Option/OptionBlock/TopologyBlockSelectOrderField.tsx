import useChoiceOptions from "../../Context/ChoiceContext";
import OptionSelectOrder from "./OptionSelectOrder";
import OptionSelectTopologyBlock from "./OptionSelectTopologyBlock";

type ChoiceOptionBlockTypes = {
  choiceId: string;
  amountOfOptions: number;
  plotFieldCommandChoiceId: string;
  choiceOptionId: string;
};

export default function TopologyBlockSelectOrderField({
  choiceId,
  choiceOptionId,
  amountOfOptions,
  plotFieldCommandChoiceId,
}: ChoiceOptionBlockTypes) {
  const { getChoiceOptionById } = useChoiceOptions();
  return (
    <div className={`flex-grow flex gap-[5px] flex-col`}>
      <OptionSelectTopologyBlock
        choiceId={choiceId}
        choiceOptionId={choiceOptionId}
        topologyBlockId={getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockId || ""}
        topologyBlockName={getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockName || ""}
      />
      <OptionSelectOrder
        amountOfOptions={amountOfOptions}
        choiceId={plotFieldCommandChoiceId || ""}
        choiceOptionId={choiceOptionId}
      />
    </div>
  );
}
