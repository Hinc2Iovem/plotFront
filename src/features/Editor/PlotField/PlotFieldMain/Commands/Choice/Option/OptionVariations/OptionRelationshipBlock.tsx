import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useUpdateChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetRelationshipOption from "../../../../../hooks/Choice/ChoiceOptionVariation/useGetRelationshipOption";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import usePrepareCharacterDataOptionRelationship from "./usePrepareCharacterDataOptionRelationship";

type OptionRelationshipBlockTypes = {
  choiceOptionId: string;
  debouncedValue: string;
};

export default function OptionRelationshipBlock({ choiceOptionId, debouncedValue }: OptionRelationshipBlockTypes) {
  const { episodeId } = useParams();
  const { data: optionRelationship } = useGetRelationshipOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: "",
    characterName: "",
    imgUrl: "",
  });

  usePrepareCharacterDataOptionRelationship({ characterValue, setCharacterValue });

  const [amountOfPoints, setAmountOfPoints] = useState(optionRelationship?.amountOfPoints || "");

  useEffect(() => {
    if (optionRelationship) {
      setCharacterValue((prev) => ({
        ...prev,
        _id: optionRelationship.characterId,
      }));
      setAmountOfPoints(optionRelationship.amountOfPoints);
    }
  }, [optionRelationship]);

  const updateOptionRelationship = useUpdateChoiceOption({
    choiceOptionId,
  });

  const onBlur = () => {
    if (amountOfPoints) {
      updateOptionRelationship.mutate({ amountOfPoints: +amountOfPoints });
    }
  };

  const { updateValue } = useSearch();

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: `Choice - Relationship`,
        id: choiceOptionId,
        value: `${debouncedValue} ${value} ${amountOfPoints}`,
        type: "choiceOption",
      });
    }
  };

  useEffect(() => {
    updateValues(characterValue.characterName || "");
  }, [episodeId, characterValue]);

  return (
    <div className="w-full flex flex-col gap-[5px]">
      <div className="w-full relative flex gap-[5px]">
        <PlotfieldCharacterPromptMain
          inputClasses="w-full pr-[35px] text-text md:text-[17px]"
          imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
          initCharacterValue={characterValue}
          onBlur={(value) =>
            updateOptionRelationship.mutate({
              characterId: value._id || "",
            })
          }
        />
      </div>
      <PlotfieldInput
        type="text"
        placeholder="Очки отношений"
        className={`flex-grow px-[10px] py-[5px] text-text rounded-md shadow-md`}
        value={amountOfPoints || ""}
        onBlur={onBlur}
        onChange={(e) => setAmountOfPoints(+e.target.value)}
      />
    </div>
  );
}
