import { useEffect, useState } from "react";
import useUpdateChoiceOption from "../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetPremiumOption from "../../../hooks/Choice/ChoiceOptionVariation/useGetPremiumOption";

type OptionPremiumBlockTypes = {
  choiceOptionId: string;
};

export default function OptionPremiumBlock({
  choiceOptionId,
}: OptionPremiumBlockTypes) {
  const { data: optionPremium } = useGetPremiumOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [priceAmethysts, setPriceAmethysts] = useState(
    optionPremium?.priceAmethysts || ""
  );

  useEffect(() => {
    if (optionPremium) {
      setPriceAmethysts(optionPremium.priceAmethysts);
    }
  }, [optionPremium]);

  const updateOptionPremium = useUpdateChoiceOption({
    choiceOptionId,
  });

  useEffect(() => {
    if (priceAmethysts) {
      updateOptionPremium.mutate({ priceAmethysts: +priceAmethysts });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceAmethysts]);

  return (
    <div className="self-end flex-grow w-full px-[.5rem]">
      <input
        type="text"
        placeholder="Аметисты"
        className="w-full text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-gray-300 rounded-md shadow-md"
        value={priceAmethysts || ""}
        onChange={(e) => setPriceAmethysts(+e.target.value)}
      />
    </div>
  );
}
