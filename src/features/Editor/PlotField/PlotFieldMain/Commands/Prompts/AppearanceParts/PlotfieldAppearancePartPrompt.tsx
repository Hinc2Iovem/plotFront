import { useState } from "react";
import useGetAppearancePartById from "../../../../../../../hooks/Fetching/AppearancePart/useGetAppearancePartById";
import { TranslationAppearancePartTypes } from "../../../../../../../types/Additional/TranslationTypes";

type EmotionAppearancePartNameTypes = {
  setAppearancePartName?: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId?: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartImg?: React.Dispatch<React.SetStateAction<string>>;
  setShowAppearancePartModal: React.Dispatch<React.SetStateAction<boolean>>;
} & TranslationAppearancePartTypes;

export default function PlotfieldAppearancePartsPrompt({
  appearancePartId,
  translations,
  setAppearancePartName,
  setAppearancePartId,
  setShowAppearancePartModal,
  setAppearancePartImg,
}: EmotionAppearancePartNameTypes) {
  const { data: appearancePart } = useGetAppearancePartById({
    appearancePartId,
  });
  const [currentAppearancePartName] = useState(
    (translations || [])[0]?.text || ""
  );
  const theme = localStorage.getItem("theme");

  return (
    <>
      {appearancePart?.img ? (
        <button
          type="button"
          onClick={() => {
            if (setAppearancePartName) {
              setAppearancePartName(currentAppearancePartName);
            }
            if (setAppearancePartId) {
              setAppearancePartId(appearancePartId);
            }
            setShowAppearancePartModal(false);
            if (setAppearancePartImg) {
              setAppearancePartImg(appearancePart?.img || "");
            }
          }}
          className={`rounded-md ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:text-text-light focus-within:bg-primary-darker flex px-[1rem] py-[.5rem] items-center justify-between hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          <p className="text-[1.3rem] rounded-md">
            {currentAppearancePartName.length > 20
              ? currentAppearancePartName.substring(0, 20) + "..."
              : currentAppearancePartName}
          </p>
          <img
            src={appearancePart?.img || ""}
            alt="AppearancePartImg"
            className="w-[3rem] rounded-md"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (setAppearancePartName) {
              setAppearancePartName(currentAppearancePartName);
            }
            if (setAppearancePartId) {
              setAppearancePartId(appearancePartId);
            }
            setShowAppearancePartModal(false);
            if (setAppearancePartImg) {
              setAppearancePartImg("");
            }
          }}
          className={`text-start ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:text-text-light focus-within:bg-primary-darker text-[1.3rem] px-[1rem] py-[.5rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all rounded-md`}
        >
          {currentAppearancePartName.length > 20
            ? currentAppearancePartName.substring(0, 20) + "..."
            : currentAppearancePartName}
        </button>
      )}
    </>
  );
}
