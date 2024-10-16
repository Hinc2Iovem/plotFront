import { EmotionsTypes } from "../../../../../../../types/StoryData/Character/CharacterTypes";

type EmotionEmotionNameTypes = {
  setEmotionName: React.Dispatch<React.SetStateAction<string>>;
  setEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setEmotionImg?: React.Dispatch<React.SetStateAction<string>>;
  setShowEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
} & EmotionsTypes;

export default function PlotfieldEmotionsPrompt({
  _id,
  setEmotionName,
  setEmotionId,
  setShowEmotionModal,
  setEmotionImg,
  emotionName,
  imgUrl,
}: EmotionEmotionNameTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <>
      {imgUrl ? (
        <button
          type="button"
          onClick={() => {
            setEmotionName(emotionName);
            setEmotionId(_id);
            setShowEmotionModal(false);
            if (setEmotionImg) {
              setEmotionImg(imgUrl);
            }
          }}
          className={`whitespace-nowrap ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } w-full flex-wrap rounded-md flex px-[.5rem] py-[.2rem] items-center justify-between hover:bg-primary-darker hover:text-text-light text-text-dark focus-within:text-text-light focus-within:bg-primary-darker transition-all `}
        >
          <p className="text-[1.3rem] rounded-md">
            {emotionName.length > 20
              ? emotionName.substring(0, 20) + "..."
              : emotionName}
          </p>
          <img src={imgUrl} alt="EmotionImg" className="w-[3rem] rounded-md" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setEmotionName(emotionName);
            setEmotionId(_id);
            setShowEmotionModal(false);
            if (setEmotionImg) {
              setEmotionImg("");
            }
          }}
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } flex-wrap text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-darker hover:text-text-light text-text-dark focus-within:bg-primary-darker focus-within:text-text-light transition-all rounded-md`}
        >
          {emotionName.length > 20
            ? emotionName.substring(0, 20) + "..."
            : emotionName}
        </button>
      )}
    </>
  );
}
