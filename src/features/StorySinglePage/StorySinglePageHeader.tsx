import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import characteristics from "../../assets/images/Story/characteristic.png";
import characters from "../../assets/images/Story/characters.png";
import emotion from "../../assets/images/Story/emotion.png";
import wardrobe from "../../assets/images/Story/wardrobe.png";
import arrowBack from "../../assets/images/shared/prev.png";
import { MATCHMEDIA } from "../../const/MATCHMEDIA";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import useGetTranslationStoryById from "../../hooks/Fetching/Story/useGetTranslationStoryById";
import useMatchMedia from "../../hooks/UI/useMatchMedia";
import ButtonHoverPromptModal from "../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import LightBox from "../shared/utilities/LightBox";
import StoryInfoModal from "./StoryInfoModal";
import StorySinglePageHeaderCharacteristicModal from "./StorySinglePageHeaderCharacteristicModal";

export default function StorySinglePageHeader() {
  const isMobile = useMatchMedia(MATCHMEDIA.Mobile);
  const [showCharacteristicsModal, setShowCharacteristicsModal] =
    useState(false);
  const { userId } = useGetDecodedJWTValues();
  const { storyId } = useParams();
  const [infoModal, setInfoModal] = useState(false);
  const { data: translationStory } = useGetTranslationStoryById({
    storyId: storyId || "",
    language: "russian",
  });
  const [storyName, setStoryName] = useState<string>("");

  useEffect(() => {
    if (translationStory) {
      setStoryName(
        translationStory.translations.find(
          (t) => t.textFieldName === "storyName"
        )?.text || ""
      );
    }
  }, [translationStory]);

  return (
    <>
      <header className="flex flex-col gap-[2rem]">
        <div className="flex justify-between flex-wrap">
          <Link to={`/profile/${userId}`} className="w-fit outline-none">
            <img
              src={arrowBack}
              alt="GoBack"
              className="w-[3.5rem] hover:scale-[1.01]"
            />
          </Link>
          <div className="flex gap-[.5rem]">
            <ButtonHoverPromptModal
              contentName="Эмоции"
              positionByAbscissa="right"
              asideClasses="text-[1.3rem] top-[4.5rem] bottom-[-3.2rem]"
              variant="rectangle"
            >
              <Link to={`/stories/${storyId}/emotions`}>
                <img
                  src={emotion}
                  className="w-[4rem] bg-secondary rounded-md shadow-sm shadow-gray-400"
                  alt="Emotion"
                />
              </Link>
            </ButtonHoverPromptModal>

            <ButtonHoverPromptModal
              contentName="Гардероб"
              positionByAbscissa="right"
              asideClasses="text-[1.3rem] top-[4.5rem] bottom-[-3.2rem]"
              variant="rectangle"
            >
              <Link to={`/stories/${storyId}/wardrobes`}>
                <img
                  src={wardrobe}
                  className="w-[4rem] bg-secondary rounded-md shadow-sm shadow-gray-400"
                  alt="Wardrobe"
                />
              </Link>
            </ButtonHoverPromptModal>
            <div className="relative">
              <ButtonHoverPromptModal
                contentName="Характеристики"
                positionByAbscissa="right"
                asideClasses="text-[1.3rem] top-[4.5rem] bottom-[-3.2rem]"
                variant="rectangle"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCharacteristicsModal((prev) => !prev);
                }}
              >
                <img
                  src={characteristics}
                  className="w-[4rem] p-[.3rem] bg-secondary rounded-md shadow-sm shadow-gray-400"
                  alt="Characteristics"
                />
              </ButtonHoverPromptModal>
              <StorySinglePageHeaderCharacteristicModal
                showCharacteristicsModal={showCharacteristicsModal}
                setShowCharacteristicsModal={setShowCharacteristicsModal}
              />
            </div>

            <ButtonHoverPromptModal
              contentName="Персонажи"
              positionByAbscissa="right"
              asideClasses="text-[1.3rem] top-[4.5rem] bottom-[-3.2rem]"
              variant="rectangle"
            >
              <Link to={`/stories/${storyId}/characters`}>
                <img
                  src={characters}
                  className="w-[4rem] bg-secondary rounded-md shadow-sm shadow-gray-400"
                  alt="Characters"
                />
              </Link>
            </ButtonHoverPromptModal>
          </div>
        </div>

        <div className="flex w-full justify-between flex-wrap items-center">
          <h1 className="text-[3.5rem] bg-secondary text-gray-700 rounded-md shadow-md w-fit px-[1rem]">
            {storyName}
          </h1>
          <div className="relative">
            <button
              onClick={() => {
                setInfoModal((prev) => !prev);
              }}
              className="text-[2rem] bg-secondary text-gray-700 rounded-md shadow-md w-fit px-[1rem] py-[.5rem]"
            >
              Информация по истории
            </button>
            {infoModal && !isMobile ? (
              <StoryInfoModal
                infoModal={infoModal}
                setInfoModal={setInfoModal}
                className="w-[30rem] min-h-[30rem] right-[0rem] absolute"
              />
            ) : null}
          </div>
        </div>
      </header>

      {infoModal && isMobile ? (
        <StoryInfoModal
          infoModal={infoModal}
          setInfoModal={setInfoModal}
          className={`fixed w-[30rem] min-h-[30rem] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`}
        />
      ) : null}
      {isMobile && (
        <LightBox isLightBox={infoModal} setIsLightBox={setInfoModal} />
      )}
    </>
  );
}
