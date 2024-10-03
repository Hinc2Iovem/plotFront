import { useEffect, useState } from "react";
import { ChoiceOptionVariationsTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useUpdateChoiceOptionTranslationText from "../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import { useQueryClient } from "@tanstack/react-query";
import useGetTopologyBlockById from "../../../hooks/TopologyBlock/useGetTopologyBlockById";

type ChoiceOptionInputFieldTypes = {
  topologyBlockId: string;
  choiceOptionId: string;
  choiceId: string;
  plotFieldCommandId: string;
  option: string;
  type: ChoiceOptionVariationsTypes;
  currentTopologyBlockId: string;
};

export default function ChoiceOptionInputField({
  topologyBlockId,
  type,
  option,
  choiceId,
  choiceOptionId,
  currentTopologyBlockId,
  plotFieldCommandId,
}: ChoiceOptionInputFieldTypes) {
  const queryClient = useQueryClient();
  const [optionValue, setOptionValue] = useState(option);

  const debouncedValue = useDebounce({ delay: 700, value: optionValue });
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
      queryClient.invalidateQueries({
        queryKey: [
          "choice",
          plotFieldCommandId,
          "translation",
          "russian",
          "option",
        ],
      });
    }
  }, [debouncedValue]);

  return (
    <div
      className={`${
        topologyBlockId === currentTopologyBlockId ? "" : "hidden"
      }  flex flex-col gap-[.5rem]`}
    >
      <input
        type="text"
        placeholder="Ответ"
        value={optionValue}
        onChange={(e) => setOptionValue(e.target.value)}
        className={`outline-none text-[1.5rem] text-gray-600 bg-white rounded-md shadow-sm px-[1rem] py-[.5rem] w-[calc(100%-2.5rem)] focus-within:shadow-inner transition-shadow`}
      />
      <p className="bg-white rounded-md shadow-sm text-[1.3rem] text-gray-600 px-[1rem] py-[.5rem]">
        {topologyBlock?.name}
      </p>
    </div>
  );
}
