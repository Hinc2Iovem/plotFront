import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useUpdateChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetPremiumOption from "../../../../../hooks/Choice/ChoiceOptionVariation/useGetPremiumOption";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";

type OptionPremiumBlockTypes = {
  choiceOptionId: string;
  debouncedValue: string;
};

export default function OptionPremiumBlock({ choiceOptionId, debouncedValue }: OptionPremiumBlockTypes) {
  const { episodeId } = useParams();
  const { data: optionPremium } = useGetPremiumOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [priceAmethysts, setPriceAmethysts] = useState(optionPremium?.priceAmethysts || "");

  useEffect(() => {
    if (optionPremium) {
      setPriceAmethysts(optionPremium.priceAmethysts);
    }
  }, [optionPremium]);

  const updateOptionPremium = useUpdateChoiceOption({
    choiceOptionId,
  });

  const { updateValue } = useSearch();

  const updateValues = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: `Choice - Premium`,
        id: choiceOptionId,
        value: `${debouncedValue} ${priceAmethysts}`,
        type: "choiceOption",
      });
    }
  };

  const onBlur = () => {
    updateValues();
    if (priceAmethysts) {
      updateOptionPremium.mutate({ priceAmethysts: +priceAmethysts });
    }
  };

  useEffect(() => {
    if (episodeId) {
      updateValues();
    }
  }, [episodeId]);

  return (
    <div className="self-end flex-grow w-full">
      <PlotfieldInput
        type="text"
        placeholder="Аметисты"
        className={`w-full px-[10px] py-[5px] text-text rounded-md shadow-md`}
        value={priceAmethysts || ""}
        onBlur={onBlur}
        onChange={(e) => setPriceAmethysts(+e.target.value)}
      />
    </div>
  );
}
