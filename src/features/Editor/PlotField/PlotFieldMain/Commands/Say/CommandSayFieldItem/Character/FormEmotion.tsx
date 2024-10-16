import { useEffect, useMemo, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import "../../../../../../Flowchart/FlowchartStyles.css";
import useUpdateNameOrEmotion from "../../../hooks/Say/useUpdateNameOrEmotion";
import CommandSayCreateEmotionFieldModal from "./ModalCreateEmotion/CommandSayCreateEmotionFieldModal";

type FormEmotionTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  setShowCreateEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  characterId: string;
  showCreateEmotionModal: boolean;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionsTypes | null>>;
  emotionValue: EmotionsTypes | null;
  emotions: EmotionsTypes[];
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  showAllEmotions: boolean;
};

export default function FormEmotion({
  plotFieldCommandId,
  plotFieldCommandSayId,
  characterId,
  setShowCreateEmotionModal,
  showCreateEmotionModal,
  emotionValue,
  setEmotionValue,
  setShowCharacters,
  setShowAllEmotions,
  showAllEmotions,
  emotions,
}: FormEmotionTypes) {
  const [newEmotionId, setNewEmotionId] = useState("");
  const emotionsRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
  const allEmotions = useMemo(() => {
    const res = [...emotions];
    if (emotionValue?.emotionName) {
      const ems = res.filter((r) =>
        r.emotionName
          .toLowerCase()
          .includes(emotionValue?.emotionName.toLowerCase() || "")
      );
      return ems.map((e) => e.emotionName.toLowerCase());
    } else {
      return res.map((r) => r.emotionName.toLowerCase());
    }
  }, [emotions, emotionValue?.emotionName]);

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    characterEmotionId: newEmotionId,
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  useEffect(() => {
    if (newEmotionId?.trim().length) {
      updateNameOrEmotion.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEmotionId]);

  const handleEmotionFormSubmit = (e: React.FormEvent, em?: string) => {
    e.preventDefault();
    if (!emotionValue?.emotionName?.trim().length && !em?.trim().length) {
      console.log("Заполните поле");
      return;
    }
    if (
      allEmotions.includes(emotionValue?.emotionName.toLowerCase() || "") ||
      (em && allEmotions.includes(em.toLowerCase()))
    ) {
      const currentEmotion = emotions.find(
        (e) =>
          e.emotionName.toLowerCase() ===
            emotionValue?.emotionName.toLowerCase() ||
          (em && e.emotionName.toLowerCase() === em.toLowerCase())
      );

      setNewEmotionId(currentEmotion?._id || "");
      setEmotionValue({
        emotionName: currentEmotion?.emotionName || "",
        _id: currentEmotion?._id || "",
        imgUrl: currentEmotion?.imgUrl || "",
      });
    } else {
      setShowCreateEmotionModal(true);
      return;
    }
  };

  useOutOfModal({
    modalRef: emotionsRef,
    setShowModal: setShowAllEmotions,
    showModal: showAllEmotions,
  });

  return (
    <>
      <form
        onSubmit={handleEmotionFormSubmit}
        className={`${showAllEmotions ? "z-[10]" : ""} w-full`}
      >
        <div className="w-full relative">
          <input
            type="text"
            value={emotionValue?.emotionName || ""}
            placeholder="Эмоция"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllEmotions((prev) => !prev);
              setShowCharacters(false);
            }}
            className={`text-[1.3rem] w-full ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-text-light px-[1rem] py-[.5rem] rounded-md shadow-md`}
            onChange={(e) => {
              setEmotionValue({
                emotionName: e.target.value,
                _id: "",
                imgUrl: "",
              });
              setShowAllEmotions(true);
            }}
          />

          <aside
            ref={emotionsRef}
            className={`absolute ${
              showAllEmotions ? "" : "hidden"
            } bg-secondary rounded-md shadow-md translate-y-[.5rem] w-full max-h-[15rem] overflow-y-auto | containerScroll `}
          >
            <ul className="flex flex-col gap-[1rem] p-[.2rem]">
              {allEmotions.length ? (
                allEmotions.map((em, i) => {
                  return (
                    <li key={em + "-" + i} className="flex justify-between">
                      <button
                        onClick={(event) => {
                          setEmotionValue({
                            emotionName: em,
                            _id: "",
                            imgUrl: "",
                          });
                          handleEmotionFormSubmit(event, em);
                          setShowAllEmotions(false);
                        }}
                        className={`w-full text-start text-[1.4rem] px-[1rem] py-[.5rem] bg-secondary ${
                          theme === "light"
                            ? "outline-gray-300"
                            : "outline-gray-600"
                        } hover:bg-primary-darker focus-within:bg-primary-darker focus-within:text-text-light hover:text-text-light text-text-dark transition-all`}
                      >
                        {em}
                      </button>
                      {emotionValue?.imgUrl ? (
                        <img
                          src={emotionValue?.imgUrl || ""}
                          alt={"EmotionImg"}
                          className="w-[3rem] rounded-md object-cover"
                        />
                      ) : null}
                    </li>
                  );
                })
              ) : !emotionValue?.emotionName?.trim().length ? (
                <li>
                  <button
                    className={`w-full text-start text-[1.4rem] px-[1rem] py-[.5rem] bg-secondary ${
                      theme === "light"
                        ? "outline-gray-300"
                        : "outline-gray-600"
                    } hover:bg-primary-darker focus-within:bg-primary-darker focus-within:text-text-light hover:text-text-light text-text-dark transition-all`}
                  >
                    Пусто
                  </button>
                </li>
              ) : null}
            </ul>
          </aside>
        </div>
      </form>
      <CommandSayCreateEmotionFieldModal
        characterId={characterId}
        emotionName={emotionValue}
        setShowModal={setShowCreateEmotionModal}
        showModal={showCreateEmotionModal}
        plotFieldCommandId={plotFieldCommandId}
        plotFieldCommandSayId={plotFieldCommandSayId}
      />
    </>
  );
}
