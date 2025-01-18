import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { useEffect, useState } from "react";
import {
  AllSexualOrientations,
  SexualOrientationTypes,
} from "../../../../../../../../types/StoryEditor/PlotField/Choice/SEXUAL_ORIENTATION_TYPES";
import useUpdateChoiceOptionSexualOrientation from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionSexualOrientation";
import "../OptionRaibowBtnStyles.css";

type OptionSelectSexualOrientationBlockTypes = {
  sexualOrientation: string;
  choiceOptionId: string;
  showAllSexualOrientationBlocks: boolean;
  setShowAllSexualOrientationBlocks: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OptionSelectSexualOrientationBlock({
  sexualOrientation,
  choiceOptionId,
  setShowAllSexualOrientationBlocks,
  showAllSexualOrientationBlocks,
}: OptionSelectSexualOrientationBlockTypes) {
  const [currentSexualOrientationBlockName, setCurrentSexualOrientationBlockName] = useState(
    sexualOrientation || "combined"
  );
  const [showCurrentBlock, setShowCurrentBlock] = useState(false);

  useEffect(() => {
    if (sexualOrientation) {
      setCurrentSexualOrientationBlockName(sexualOrientation);
    }
  }, [sexualOrientation]);

  const updateOptionSexualOrientationBlock = useUpdateChoiceOptionSexualOrientation({
    choiceOptionId,
  });

  return (
    <SelectWithBlur
      open={showAllSexualOrientationBlocks}
      onOpenChange={setShowAllSexualOrientationBlocks}
      onValueChange={(v: SexualOrientationTypes) => {
        setCurrentSexualOrientationBlockName(v);
        updateOptionSexualOrientationBlock.mutate({
          sexualOrientationType: v,
        });
        setShowAllSexualOrientationBlocks(false);
        setShowCurrentBlock(false);
      }}
    >
      <SelectTrigger
        onMouseLeave={() => setShowCurrentBlock(false)}
        onMouseOver={() => setShowCurrentBlock(true)}
        className={`relative w-fit translate-y-[30px] ${
          showCurrentBlock ? "translate-y-[0]" : ""
        } transition-all z-[10] text-[15px] text-white shadow-md rounded-md px-[10px] py-[5px] | rainbowBtn`}
      >
        <SelectValue placeholder={currentSexualOrientationBlockName} onBlur={(v) => v.currentTarget.blur()} />
      </SelectTrigger>
      <SelectContent>
        {AllSexualOrientations.map((pv) => {
          return (
            <SelectItem
              key={pv}
              value={pv}
              className={`${pv === currentSexualOrientationBlockName ? "hidden" : ""} capitalize w-full`}
            >
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
