import { useMemo, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
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
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  emotionValue: EmotionTypes;
  showAllEmotions: boolean;
  initialEmotionId: string;

  commandIfId: string;
  isElse: boolean;
};

export default function FormEmotion({
  plotFieldCommandId,
  plotFieldCommandSayId,
  characterId,
  setShowCreateEmotionModal,
  showCreateEmotionModal,
  setShowCharacters,
  setShowAllEmotions,
  setEmotionValue,
  emotionValue,
  showAllEmotions,
  emotions,

  commandIfId,
  isElse,
}: FormEmotionTypes) {
  const {
    updateEmotionProperties,
    updateEmotionName,

    updateEmotionPropertiesIf,
    updateEmotionNameIf,
  } = usePlotfieldCommands();

  // const debouncedValue = useDebounce({
  //   delay: 700,
  //   value: emotionValue?.emotionName || "",
  // });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const emotionsRef = useRef<HTMLDivElement>(null);

  const allEmotions = useMemo(() => {
    const res = [...emotions];
    if (emotionValue?.emotionName) {
      return res.filter((r) => r.emotionName.toLowerCase().includes(emotionValue?.emotionName?.toLowerCase() || ""));
    } else {
      return res;
    }
  }, [emotions, emotionValue]);

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const handleEmotionFormSubmit = (e: React.FormEvent, em?: string) => {
    e.preventDefault();
    if (!emotionValue?.emotionName?.trim().length && !em?.trim().length) {
      console.log("Заполните поле");
      return;
    }
    if (
      allEmotions.map((e) => e.emotionName?.toLowerCase().includes(emotionValue?.emotionName?.toLowerCase() || "")) ||
      (em && allEmotions.map((e) => e.emotionName?.toLowerCase().includes(em?.toLowerCase())))
    ) {
      const currentEmotion = emotions.find(
        (e) =>
          e.emotionName.toLowerCase() === emotionValue?.emotionName?.toLowerCase() ||
          (em && e.emotionName.toLowerCase() === em.toLowerCase())
      );

      updateNameOrEmotion.mutate({ emotionBodyId: currentEmotion?._id });
      setEmotionValue({
        _id: currentEmotion?._id || null,
        emotionName: currentEmotion?.emotionName || null,
        imgUrl: currentEmotion?.imgUrl || null,
      });

      if (commandIfId?.trim().length) {
        updateEmotionPropertiesIf({
          emotionId: currentEmotion?._id || "",
          emotionImg: currentEmotion?.imgUrl || "",
          emotionName: currentEmotion?.emotionName || "",
          id: plotFieldCommandId,
          isElse,
        });
      } else {
        updateEmotionProperties({
          emotionId: currentEmotion?._id || "",
          emotionImg: currentEmotion?.imgUrl || "",
          emotionName: currentEmotion?.emotionName || "",
          id: plotFieldCommandId,
        });
      }
    } else {
      setShowCreateEmotionModal(true);
      return;
    }
  };

  // useEffect(() => {
  //   if (debouncedValue?.trim().length && !showAllEmotions) {
  //     const existingEmotion = emotions.find(
  //       (e) =>
  //         e.emotionName?.trim()?.toLowerCase() ===
  //         emotionValue?.emotionName?.trim()?.toLowerCase()
  //     );

  //     if (existingEmotion) {
  //       setEmotionValue({
  //         _id: existingEmotion?._id || null,
  //         emotionName: existingEmotion?.emotionName || null,
  //         imgUrl: existingEmotion?.imgUrl || null,
  //       });
  //       updateEmotionProperties({
  //         emotionId: existingEmotion?._id || "",
  //         emotionImg: existingEmotion?.imgUrl || "",
  //         emotionName: existingEmotion?.emotionName || "",
  //         id: plotFieldCommandId,
  //       });
  //       updateNameOrEmotion.mutate({ emotionBodyId: existingEmotion?._id });
  //     } else {
  //       console.log("Such emotion wasn't found, on debounce");
  //       setShowCreateEmotionModal(true);
  //       return;
  //     }
  //   }
  // }, [debouncedValue]);

  useOutOfModal({
    modalRef: emotionsRef,
    setShowModal: setShowAllEmotions,
    showModal: showAllEmotions,
  });

  return (
    <>
      <form onSubmit={handleEmotionFormSubmit} className={`${showAllEmotions ? "z-[10]" : ""} w-full`}>
        <div className="w-full relative">
          <PlotfieldInput
            type="text"
            onBlur={() => {}}
            value={emotionValue?.emotionName || ""}
            placeholder="Эмоция"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllEmotions((prev) => !prev);
              setShowCharacters(false);
            }}
            onChange={(e) => {
              setEmotionValue((prev) => ({
                ...prev,
                emotionName: e.target.value,
              }));

              if (commandIfId?.trim().length) {
                updateEmotionNameIf({
                  emotionName: e.target.value,
                  id: plotFieldCommandId,
                  isElse,
                });
              } else {
                updateEmotionName({
                  emotionName: e.target.value,
                  id: plotFieldCommandId,
                });
              }
              setShowAllEmotions(true);
            }}
          />

          {emotionValue?.imgUrl ? (
            <img
              src={emotionValue.imgUrl || ""}
              alt={"EmotionImg"}
              className="w-[3rem] rounded-md object-cover absolute right-0 top-[1.5px]"
            />
          ) : null}

          <AsideScrollable ref={emotionsRef} className={`${showAllEmotions ? "" : "hidden"} translate-y-[.5rem]`}>
            <ul className="flex flex-col gap-[1rem] p-[.2rem]">
              {allEmotions.length ? (
                allEmotions.map((em, i) => {
                  return (
                    <li key={em + "-" + i} className="flex justify-between">
                      <AsideScrollableButton
                        className="relative"
                        onClick={(event) => {
                          handleEmotionFormSubmit(event, em?.emotionName);
                          setShowAllEmotions(false);
                        }}
                      >
                        {em.emotionName}
                        {em?.imgUrl ? (
                          <img
                            src={em.imgUrl || ""}
                            alt={"EmotionImg"}
                            className="w-[3rem] rounded-md object-cover absolute right-0 top-[1.5px]"
                          />
                        ) : null}
                      </AsideScrollableButton>
                    </li>
                  );
                })
              ) : !allEmotions.length && emotionValue?.emotionName?.trim().length ? (
                <li>
                  <AsideScrollableButton onClick={() => setShowAllEmotions(false)}>Пусто</AsideScrollableButton>
                </li>
              ) : null}
            </ul>
          </AsideScrollable>
        </div>
      </form>
      <CommandSayCreateEmotionFieldModal
        characterId={characterId}
        emotionName={emotionValue?.emotionName || ""}
        setShowModal={setShowCreateEmotionModal}
        showModal={showCreateEmotionModal}
        plotFieldCommandId={plotFieldCommandId}
        plotFieldCommandSayId={plotFieldCommandSayId}
        setEmotionValue={setEmotionValue}
        commandIfId={commandIfId}
        isElse={isElse}
      />
    </>
  );
}
