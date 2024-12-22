import { useMemo, useRef } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import AsideScrollable from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../../ui/Inputs/PlotfieldInput";
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
}: FormEmotionTypes) {
  const { updateEmotionProperties, updateEmotionName } = usePlotfieldCommands();

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

      updateNameOrEmotion.mutate({ emotionBodyId: currentEmotion?._id });
    } else {
      setShowCreateEmotionModal(true);
      return;
    }
  };

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

              updateEmotionName({
                emotionName: e.target.value,
                id: plotFieldCommandId,
              });
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

          <AllEmotionsModal
            allEmotions={allEmotions}
            emotionValue={emotionValue}
            handleEmotionFormSubmit={handleEmotionFormSubmit}
            setShowAllEmotions={setShowAllEmotions}
            showAllEmotions={showAllEmotions}
          />
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
      />
    </>
  );
}

type AllEmotionsModalTypes = {
  showAllEmotions: boolean;
  allEmotions: EmotionsTypes[];
  emotionValue: EmotionTypes;
  handleEmotionFormSubmit: (e: React.FormEvent, em?: string) => void;
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AllEmotionsModal({
  allEmotions,
  emotionValue,
  setShowAllEmotions,
  showAllEmotions,
  handleEmotionFormSubmit,
}: AllEmotionsModalTypes) {
  {
    const emotionsRef = useRef<HTMLDivElement>(null);

    useOutOfModal({
      modalRef: emotionsRef,
      setShowModal: setShowAllEmotions,
      showModal: showAllEmotions,
    });

    return (
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
    );
  }
}
