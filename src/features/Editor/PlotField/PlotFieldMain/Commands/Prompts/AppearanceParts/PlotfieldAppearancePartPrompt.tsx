import { useState } from "react";
import useGetAppearancePartById from "../../../../../../../hooks/Fetching/AppearancePart/useGetAppearancePartById";
import { TranslationAppearancePartTypes } from "../../../../../../../types/Additional/TranslationTypes";
import AsideScrollableButton from "../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";

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

  return (
    <>
      {appearancePart?.img ? (
        <AsideScrollableButton
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
        >
          {currentAppearancePartName.length > 20
            ? currentAppearancePartName.substring(0, 20) + "..."
            : currentAppearancePartName}
          <img
            src={appearancePart?.img || ""}
            alt="AppearancePartImg"
            className="w-[3rem] rounded-md"
          />
        </AsideScrollableButton>
      ) : (
        <AsideScrollableButton
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
        >
          {currentAppearancePartName.length > 20
            ? currentAppearancePartName.substring(0, 20) + "..."
            : currentAppearancePartName}
        </AsideScrollableButton>
      )}
    </>
  );
}
