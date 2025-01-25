import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import React, { useEffect, useMemo, useState } from "react";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import "../../../../../../Flowchart/FlowchartStyles.css";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/useUpdateNameOrEmotion";
import { EmotionTypes } from "./CommandSayCharacterFieldItem";

type FormEmotionTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  emotions: EmotionsTypes[];
  emotionValue: EmotionTypes;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
};

export default function FormEmotion({
  plotFieldCommandId,
  plotFieldCommandSayId,
  emotionValue,
  emotions,
  setEmotionValue,
}: FormEmotionTypes) {
  const { updateEmotionName, updateEmotionProperties } = usePlotfieldCommands();
  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const handleOnBlur = (value: EmotionTypes) => {
    updateEmotionName({
      emotionName: value?.emotionName || "",
      id: plotFieldCommandId,
    });

    updateEmotionProperties({
      emotionId: value?._id || "",
      emotionImg: value?.imgUrl || "",
      emotionName: value?.emotionName || "",
      id: plotFieldCommandId,
    });

    setEmotionValue(value);
    updateNameOrEmotion.mutate({ emotionBodyId: value._id || "" });
  };

  return (
    <>
      <div className={`bg-secondary w-full relative`}>
        <AllEmotionsModal onBlur={(value) => handleOnBlur(value)} emotions={emotions} initEmotionValue={emotionValue} />
      </div>
      {/* <CommandSayCreateEmotionFieldModal
        characterId={characterId}
        emotionName={emotionValue?.emotionName || ""}
        setShowModal={setShowCreateEmotionModal}
        showModal={showCreateEmotionModal}
        plotFieldCommandId={plotFieldCommandId}
        plotFieldCommandSayId={plotFieldCommandSayId}
        setEmotionValue={setEmotionValue}
      /> */}
    </>
  );
}

type AllEmotionsModalTypes = {
  emotions: EmotionsTypes[];
  initEmotionValue: EmotionTypes;
  onBlur: (value: EmotionTypes) => void;
  inputClasses?: string;
  imgClasses?: string;
  containerClasses?: string;
};

export function AllEmotionsModal({
  emotions,
  initEmotionValue,
  containerClasses,
  imgClasses,
  inputClasses,
  onBlur,
}: AllEmotionsModalTypes) {
  const [showAllEmotions, setShowAllEmotions] = useState(false);
  const [emotionValue, setEmotionValue] = useState<EmotionTypes>(initEmotionValue);
  const [initValue, setInitValue] = useState(initEmotionValue.emotionName);

  useEffect(() => {
    if (initEmotionValue) {
      setEmotionValue(initEmotionValue);
      setInitValue(initEmotionValue.emotionName);
    }
  }, [initEmotionValue]);

  const allEmotions = useMemo(() => {
    const res = [...emotions];
    if (emotionValue?.emotionName) {
      return res.filter((r) => r.emotionName.toLowerCase().includes(emotionValue?.emotionName?.toLowerCase() || ""));
    } else {
      return res;
    }
  }, [emotions, emotionValue]);

  const updateEmotionNameOnBlur = (value?: EmotionTypes) => {
    const localEmotionValue = value?._id ? value : emotionValue;
    if (!localEmotionValue.emotionName?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initValue === localEmotionValue.emotionName) {
      return;
    }

    if (
      allEmotions.map((e) =>
        e.emotionName?.toLowerCase().includes(localEmotionValue.emotionName?.trim()?.toLowerCase() || "")
      )
    ) {
      const currentEmotion = emotions.find(
        (e) => e.emotionName?.trim().toLowerCase() === localEmotionValue.emotionName?.trim()?.toLowerCase()
      );

      if (!currentEmotion) {
        return;
      }
      const emotionObj = {
        _id: currentEmotion?._id || null,
        emotionName: currentEmotion?.emotionName || null,
        imgUrl: currentEmotion?.imgUrl || null,
      };

      setEmotionValue(emotionObj);
      onBlur(emotionObj);
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: allEmotions.length });

  return (
    <Popover open={showAllEmotions} onOpenChange={setShowAllEmotions}>
      <PopoverTrigger asChild>
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`${containerClasses ? containerClasses : "w-full flex justify-between items-center"}`}
        >
          <PlotfieldInput
            value={emotionValue?.emotionName || ""}
            placeholder="Эмоция"
            onChange={(e) => {
              setShowAllEmotions(true);
              setEmotionValue((prev) => ({
                ...prev,
                emotionName: e.target.value,
              }));
            }}
            className={`${inputClasses ? inputClasses : "h-[50px] pr-[50px] text-text md:text-[17px]"}`}
            onBlur={() => updateEmotionNameOnBlur()}
          />

          {emotionValue?.imgUrl ? (
            <img
              src={emotionValue.imgUrl || ""}
              alt={"EmotionImg"}
              className={`${
                imgClasses ? imgClasses : "w-[40px] object-cover top-[5px] right-[3px] rounded-md absolute"
              }`}
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
                onClick={() => {
                  setEmotionValue({
                    _id: em._id,
                    emotionName: em.emotionName,
                    imgUrl: em.imgUrl || "",
                  });

                  updateEmotionNameOnBlur({
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
        ) : (
          <Button
            type="button"
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
