import { useEffect, useState } from "react";
import useGetTranslationCharacteristic from "../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import useUpdateChoiceOption from "../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetCharacteristicOption from "../../../hooks/Choice/ChoiceOptionVariation/useGetCharacteristicOption";
import PlotfieldCharacteristicPromptMain from "../../../Prompts/Characteristics/PlotfieldCharacteristicPromptMain";

type OptionCharacteristicBlockTypes = {
  choiceOptionId: string;
};

export default function OptionCharacteristicBlock({
  choiceOptionId,
}: OptionCharacteristicBlockTypes) {
  const { data: optionCharacteristic } = useGetCharacteristicOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [characteristicId, setCharacteristicId] = useState("");
  const theme = localStorage.getItem("theme");
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
  const [showAllCharacteristics, setShowAllCharacteristics] = useState(false);

  useEffect(() => {
    if (translatedCharacteristic) {
      translatedCharacteristic.translations.map((tc) => {
        if (tc.textFieldName === "characterCharacteristic") {
          setCharacteristicName(tc.text);
        }
      });
    }
  }, [translatedCharacteristic]);

  const [amountOfPoints, setAmountOfPoints] = useState(
    optionCharacteristic?.amountOfPoints || ""
  );

  useEffect(() => {
    if (optionCharacteristic) {
      setAmountOfPoints(optionCharacteristic.amountOfPoints);
    }
  }, [optionCharacteristic]);

  const updateOptionCharacteristic = useUpdateChoiceOption({
    choiceOptionId,
  });

  useEffect(() => {
    if (amountOfPoints) {
      updateOptionCharacteristic.mutate({ amountOfPoints: +amountOfPoints });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfPoints]);

  useEffect(() => {
    if (characteristicId?.trim().length) {
      updateOptionCharacteristic.mutate({
        characterCharacteristicId: characteristicId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characteristicId]);

  return (
    <div className="self-end sm:w-fit w-full px-[.5rem] flex gap-[1rem] flex-grow flex-wrap">
      <div className="relative flex-grow">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAllCharacteristics((prev) => !prev);
          }}
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.3rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
          type="button"
        >
          {characteristicName || "Характеристики"}
        </button>
        <PlotfieldCharacteristicPromptMain
          setCharacteristicId={setCharacteristicId}
          setCharacteristicName={setCharacteristicName}
          setShowCharacteristicModal={setShowAllCharacteristics}
          showCharacteristicModal={showAllCharacteristics}
        />
      </div>
      <input
        type="text"
        placeholder="Очки характеристики"
        className={`flex-grow text-[1.3rem] px-[1rem] py-[.5rem] text-text-light ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } rounded-md shadow-md`}
        value={amountOfPoints || ""}
        onChange={(e) => setAmountOfPoints(+e.target.value)}
      />
    </div>
  );
}
