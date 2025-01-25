import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ChoiceOptionVariationsWithIcons,
  ChoiceOptionVariationsWithIconsTypes,
} from "@/const/CHOICE_OPTION_VARIATIONS_WITH_ICONS";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChoiceOptionVariations,
  ChoiceOptionVariationsTypes,
} from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import useNavigation from "../../../../../Context/Navigation/NavigationContext";
import { makeTopologyBlockName } from "../../../../../Flowchart/utils/makeTopologyBlockName";
import useCreateChoiceOption from "../../../../hooks/Choice/ChoiceOption/useCreateChoiceOption";
import useChoiceOptions from "../Context/ChoiceContext";

type CreateChoiceOptionTypeModalTypes = {
  plotFieldCommandId: string;
  plotFieldCommandChoiceId: string;
  topologyBlockId: string;
};

export default function CreateChoiceOptionTypeModal({
  plotFieldCommandChoiceId,
  plotFieldCommandId,
  topologyBlockId,
}: CreateChoiceOptionTypeModalTypes) {
  const { currentTopologyBlock, updateAmountOfChildBlocks } = useNavigation();
  const { addChoiceOption, getAmountOfChoiceOptions } = useChoiceOptions();
  const { episodeId } = useParams();

  const createChoiceOption = useCreateChoiceOption({
    plotFieldCommandChoiceId,
    plotFieldCommandId,
    episodeId: episodeId || "",
    topologyBlockId,
    coordinatesX: currentTopologyBlock?.coordinatesX,
    coordinatesY: currentTopologyBlock?.coordinatesY,
    sourceBlockName: makeTopologyBlockName({
      name: currentTopologyBlock?.name || "",
      amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
    }),
  });

  const handleCreatingChoiceOption = (cov: ChoiceOptionVariationsTypes) => {
    const choiceOptionId = generateMongoObjectId();
    const targetBlockId = generateMongoObjectId();
    updateAmountOfChildBlocks("add");
    const amountOfChoiceOptions = getAmountOfChoiceOptions({
      plotfieldCommandId: plotFieldCommandId,
    });
    addChoiceOption({
      choiceId: plotFieldCommandChoiceId,
      choiceOption: {
        choiceOptionId,
        optionText: "",
        optionType: cov,
        topologyBlockId: targetBlockId,
        optionOrder: amountOfChoiceOptions,
        topologyBlockName: makeTopologyBlockName({
          name: currentTopologyBlock?.name || "",
          amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
        }),
      },
    });
    createChoiceOption.mutate({
      type: cov,
      choiceOptionId,
      targetBlockId,
      optionOrder: amountOfChoiceOptions,
    });
  };

  useEffect(() => {
    if (createChoiceOption.isError) {
      updateAmountOfChildBlocks("minus");
    }
  }, [createChoiceOption]);

  const [showChoiceOptionModal, setShowChoiceOptionModal] = useState(false);
  const buttonsRef = useModalMovemenetsArrowUpDown({ length: ChoiceOptionVariations.length });

  return (
    <Popover open={showChoiceOptionModal} onOpenChange={setShowChoiceOptionModal}>
      <PopoverTrigger asChild>
        <Button
          className={`${
            showChoiceOptionModal
              ? "bg-background text-text"
              : "bg-brand-gradient text-white hover:shadow-md hover:shadow-brand-gradient-left focus-within:shadow-brand-gradient-left focus-within:shadow-md"
          } active:scale-[.99] transition-all`}
        >
          + Ответ
        </Button>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {ChoiceOptionVariationsWithIcons?.map((c: ChoiceOptionVariationsWithIconsTypes, i) => {
          return (
            <Button
              key={`${c.variation}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                const toEng: ChoiceOptionVariationsTypes =
                  c.variation === "обычный"
                    ? "common"
                    : c.variation === "отношения"
                    ? "relationship"
                    : c.variation === "премиум"
                    ? "premium"
                    : "characteristic";

                setShowChoiceOptionModal(false);
                handleCreatingChoiceOption(toEng);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              <p>{c.variation}</p>
              <img
                alt={c.variation}
                src={c.icon}
                className={`${c.variation === "обычный" ? "bg-accent" : ""} rounded-md w-[30px] h-[30px] object-cover`}
              />
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
