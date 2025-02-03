import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacteristic from "../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useUpdateChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetCharacteristicOption from "../../../../../hooks/Choice/ChoiceOptionVariation/useGetCharacteristicOption";
import ConditionVariationCharacteristicModal from "../../../Condition/PlotfieldInsideConditionBlock/ConditionBlockVariationInput/Characteristic/ConditionVariationCharacteristicModal";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";

type OptionCharacteristicBlockTypes = {
  choiceOptionId: string;
  debouncedValue: string;
};

export default function OptionCharacteristicBlock({ choiceOptionId, debouncedValue }: OptionCharacteristicBlockTypes) {
  const { episodeId } = useParams();
  const { data: optionCharacteristic } = useGetCharacteristicOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [characteristicId, setCharacteristicId] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (optionCharacteristic) {
      setCharacteristicId(optionCharacteristic.characterCharacteristicId);
    }
  }, [optionCharacteristic]);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId,
    language: "russian",
  });

  const [characteristicName, setCharacteristicName] = useState("");
  const [initValue, setInitValue] = useState("");

  useEffect(() => {
    if (translatedCharacteristic) {
      translatedCharacteristic.translations.map((tc) => {
        if (tc.textFieldName === "characterCharacteristic") {
          setCharacteristicName(tc.text);
          setInitValue(tc.text);
        }
      });
    }
  }, [translatedCharacteristic]);

  const [amountOfPoints, setAmountOfPoints] = useState(optionCharacteristic?.amountOfPoints || "");

  useEffect(() => {
    if (optionCharacteristic) {
      setAmountOfPoints(optionCharacteristic.amountOfPoints);
    }
  }, [optionCharacteristic]);

  const updateOptionCharacteristic = useUpdateChoiceOption({
    choiceOptionId,
  });

  const { updateValue } = useSearch();

  const debouncedCharacteristic = useDebounce({ value: characteristicName, delay: 600 });

  const updateValues = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: `Choice - Premium`,
        id: choiceOptionId,
        value: `${debouncedValue} ${debouncedCharacteristic} ${amountOfPoints}`,
        type: "choiceOption",
      });
    }
  };

  const onBlur = () => {
    updateValues();
    if (amountOfPoints) {
      updateOptionCharacteristic.mutate({ amountOfPoints: +amountOfPoints });
    }
  };

  useEffect(() => {
    if (update) {
      updateValues();
      if (characteristicId?.trim().length) {
        updateOptionCharacteristic.mutate({
          characterCharacteristicId: characteristicId,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    if (episodeId) {
      updateValues();
    }
  }, [episodeId]);

  return (
    <div className="w-full flex gap-[5px] flex-grow flex-wrap">
      <div className="relative flex-grow">
        <ConditionVariationCharacteristicModal<string>
          currentCharacteristic={characteristicName}
          initValue={initValue}
          setCharacteristicId={setCharacteristicId}
          setCurrentCharacteristic={setCharacteristicName}
          setInitValue={setInitValue}
          setUpdate={setUpdate}
          inputClasses="w-full text-text md:text-[17px] border-border border-[1px]"
        />
      </div>
      <PlotfieldInput
        type="text"
        placeholder="Очки характеристики"
        className={`flex-grow text-[13px] px-[10px] py-[5px] text-text rounded-md shadow-md`}
        value={amountOfPoints || ""}
        onBlur={onBlur}
        onChange={(e) => setAmountOfPoints(+e.target.value)}
      />
    </div>
  );
}
