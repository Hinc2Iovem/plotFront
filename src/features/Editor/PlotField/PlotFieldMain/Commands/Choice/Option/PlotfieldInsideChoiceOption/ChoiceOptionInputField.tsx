import { useEffect } from "react";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { ChoiceOptionVariationsTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useUpdateChoiceOptionTranslationText from "../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import useGetTopologyBlockById from "../../../hooks/TopologyBlock/useGetTopologyBlockById";
import useChoiceOptions from "../../Context/ChoiceContext";

type ChoiceOptionInputFieldTypes = {
  topologyBlockId: string;
  choiceOptionId: string;
  choiceId: string;
  option: string;
  type: ChoiceOptionVariationsTypes;
};

export default function ChoiceOptionInputField({
  topologyBlockId,
  type,
  option,
  choiceId,
  choiceOptionId,
}: ChoiceOptionInputFieldTypes) {
  const {
    updateChoiceOptionText,
    getChoiceOptionText,
    getCurrentlyOpenChoiceOptionPlotId,
  } = useChoiceOptions();

  const debouncedValue = useDebounce({
    delay: 700,
    value: getChoiceOptionText({ choiceId, choiceOptionId }),
  });
  const { data: topologyBlock } = useGetTopologyBlockById({ topologyBlockId });
  const updateChoiceOption = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: debouncedValue,
    type,
    choiceId,
    language: "russian",
  });

  useEffect(() => {
    if (
      debouncedValue?.trim().length &&
      option?.trim() !== debouncedValue.trim()
    ) {
      updateChoiceOption.mutate();
    }
  }, [debouncedValue]);

  return (
    <div
      className={`${
        choiceOptionId === getCurrentlyOpenChoiceOptionPlotId({ choiceId })
          ? ""
          : "hidden"
      }  flex flex-col gap-[.5rem]`}
    >
      <input
        type="text"
        placeholder="Ответ"
        value={getChoiceOptionText({ choiceId, choiceOptionId })}
        onChange={(e) => {
          updateChoiceOptionText({
            choiceId,
            id: choiceOptionId,
            optionText: e.target.value,
          });
        }}
        className={`outline-none text-[1.5rem] text-gray-600 bg-white rounded-md shadow-sm px-[1rem] py-[.5rem] w-[calc(100%-2.5rem)] focus-within:shadow-inner transition-shadow`}
      />
      <p className="bg-white rounded-md shadow-sm text-[1.3rem] text-gray-600 px-[1rem] py-[.5rem]">
        {topologyBlock?.name}
      </p>
    </div>
  );
}
