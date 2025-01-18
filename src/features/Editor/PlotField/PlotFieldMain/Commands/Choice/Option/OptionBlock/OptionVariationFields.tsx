import { ChoiceOptionVariationsTypes } from "@/types/StoryEditor/PlotField/Choice/ChoiceTypes";
import OptionCharacteristicBlock from "../OptionVariations/OptionCharacteristicBlock";
import OptionPremiumBlock from "../OptionVariations/OptionPremiumBlock";
import OptionRelationshipBlock from "../OptionVariations/OptionRelationshipBlock";
import useChoiceOptions from "../../Context/ChoiceContext";

type OptionVariationFieldsTypes = {
  optionType: ChoiceOptionVariationsTypes;
  choiceOptionId: string;
  choiceId: string;
};

export default function OptionVariationFields({ choiceId, choiceOptionId, optionType }: OptionVariationFieldsTypes) {
  const { getChoiceOptionText } = useChoiceOptions();
  return (
    <div className={`flex-grow flex gap-[5px] flex-col`}>
      {optionType === "premium" ? (
        <OptionPremiumBlock
          choiceOptionId={choiceOptionId}
          debouncedValue={getChoiceOptionText({ choiceId, choiceOptionId })}
        />
      ) : optionType === "characteristic" ? (
        <OptionCharacteristicBlock
          choiceOptionId={choiceOptionId}
          debouncedValue={getChoiceOptionText({ choiceId, choiceOptionId })}
        />
      ) : optionType === "relationship" ? (
        <OptionRelationshipBlock
          choiceOptionId={choiceOptionId}
          debouncedValue={getChoiceOptionText({ choiceId, choiceOptionId })}
        />
      ) : null}
    </div>
  );
}
