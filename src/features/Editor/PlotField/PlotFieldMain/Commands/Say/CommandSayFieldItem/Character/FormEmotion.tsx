import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import "../../../../../../Flowchart/FlowchartStyles.css";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/useUpdateNameOrEmotion";
import { EmotionTypes } from "./CommandSayCharacterFieldItem";
import CommandSayCreateEmotionFieldModal from "./ModalCreateEmotion/CommandSayCreateEmotionFieldModal";

type FormEmotionTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  setShowCreateEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  characterId: string;
  showCreateEmotionModal: boolean;
  emotions: EmotionsTypes[];
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  emotionValue: EmotionTypes;
};

export default function FormEmotion({
  plotFieldCommandId,
  plotFieldCommandSayId,
  characterId,
  setShowCreateEmotionModal,
  showCreateEmotionModal,
  setEmotionValue,
  emotionValue,
  emotions,
}: FormEmotionTypes) {
  const preventRerender = useRef<boolean>(false);

  const { updateEmotionName } = usePlotfieldCommands();

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  useEffect(() => {
    if (emotionValue._id && preventRerender.current) {
      updateNameOrEmotion.mutate({ emotionBodyId: emotionValue._id });
    }
    return () => {
      preventRerender.current = true;
    };
  }, [emotionValue]);

  return (
    <>
      <div className={`bg-secondary w-full relative`}>
        <AllEmotionsModal
          emotionName={emotionValue.emotionName || ""}
          setEmotionValue={setEmotionValue}
          setShowCreateEmotionModal={setShowCreateEmotionModal}
          onChange={(value) => {
            updateEmotionName({
              emotionName: value,
              id: plotFieldCommandId,
            });
          }}
          emotions={emotions}
          emotionValue={emotionValue}
          plotFieldCommandId={plotFieldCommandId}
        />
      </div>
      <CommandSayCreateEmotionFieldModal
        characterId={characterId}
        emotionName={emotionValue?.emotionName || ""}
        setShowModal={setShowCreateEmotionModal}
        showModal={showCreateEmotionModal}
        plotFieldCommandId={plotFieldCommandId}
        plotFieldCommandSayId={plotFieldCommandSayId}
        setEmotionValue={setEmotionValue}
      />
    </>
  );
}

type AllEmotionsModalTypes = {
  emotions: EmotionsTypes[];
  plotFieldCommandId: string;
  emotionName: string;
  emotionValue: EmotionTypes;
  onChange: (value: string) => void;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  setShowCreateEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AllEmotionsModal({
  emotions,
  emotionValue,
  emotionName,
  setEmotionValue,
  setShowCreateEmotionModal,
  plotFieldCommandId,
  onChange,
}: AllEmotionsModalTypes) {
  {
    const [showAllEmotions, setShowAllEmotions] = useState(false);
    const { updateEmotionProperties } = usePlotfieldCommands();

    const allEmotions = useMemo(() => {
      const res = [...emotions];
      if (emotionValue?.emotionName) {
        return res.filter((r) => r.emotionName.toLowerCase().includes(emotionValue?.emotionName?.toLowerCase() || ""));
      } else {
        return res;
      }
    }, [emotions, emotionValue]);

    const updateEmotionNameOnBlur = () => {
      if (!emotionName?.trim().length) {
        console.log("Заполните поле");
        return;
      }
      if (allEmotions.map((e) => e.emotionName?.toLowerCase().includes(emotionName?.trim()?.toLowerCase() || ""))) {
        const currentEmotion = emotions.find(
          (e) => e.emotionName?.trim().toLowerCase() === emotionName?.trim()?.toLowerCase()
        );

        setEmotionValue({
          _id: currentEmotion?._id || null,
          emotionName: currentEmotion?.emotionName || null,
          imgUrl: currentEmotion?.imgUrl || null,
        });

        updateEmotionProperties({
          emotionId: currentEmotion?._id || "",
          emotionImg: currentEmotion?.imgUrl || "",
          emotionName: currentEmotion?.emotionName || "",
          id: plotFieldCommandId,
        });
      } else {
        setShowCreateEmotionModal(true);
        return;
      }
    };

    const buttonsRef = useModalMovemenetsArrowUpDown({ length: allEmotions.length });

    return (
      <Popover open={showAllEmotions} onOpenChange={setShowAllEmotions}>
        <PopoverTrigger asChild>
          <form onSubmit={(e) => e.preventDefault()} className="w-full flex justify-between items-center">
            <PlotfieldInput
              value={emotionValue?.emotionName || ""}
              placeholder="Эмоция"
              onChange={(e) => {
                setShowAllEmotions(true);
                setEmotionValue((prev) => ({
                  ...prev,
                  emotionName: e.target.value,
                }));
                if (onChange) {
                  onChange(e.target.value);
                }
              }}
              className="h-[50px] pr-[50px] text-text md:text-[17px]"
              onBlur={updateEmotionNameOnBlur}
            />

            {emotionValue?.imgUrl ? (
              <img
                src={emotionValue.imgUrl || ""}
                alt={"EmotionImg"}
                className="w-[40px] object-cover top-[5px] right-[3px] rounded-md absolute"
              />
            ) : null}
          </form>
        </PopoverTrigger>
        <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
          {allEmotions.length ? (
            allEmotions.map((em, i) => {
              return (
                <Button
                  key={em + "-" + i}
                  ref={(el) => (buttonsRef.current[i] = el)}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setEmotionValue({
                      _id: em._id,
                      emotionName: em.emotionName,
                      imgUrl: em.imgUrl || "",
                    });

                    setShowAllEmotions(false);
                  }}
                  className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
                >
                  <p className="text-[16px] rounded-md">
                    {em.emotionName.length > 20 ? em.emotionName.substring(0, 20) + "..." : em.emotionName}
                  </p>
                  {em?.imgUrl ? <img src={em.imgUrl || ""} alt="EmotionImg" className="w-[30px] rounded-md" /> : null}
                </Button>
              );
            })
          ) : !allEmotions.length ? (
            <Button
              type="button"
              className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
            >
              Пусто
            </Button>
          ) : null}
        </PopoverContent>
      </Popover>
    );
  }
}
