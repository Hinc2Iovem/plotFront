import { appearancePartColors } from "@/const/APPEARACE_PARTS";
import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartVariationRusTypes } from "@/types/StoryData/AppearancePart/AppearancePartTypes";
import PreviewImage from "@/ui/shared/PreviewImage";
import React, { useEffect, useState } from "react";
import { TempAppearancePartTypes } from "./AllMightySearchMainContentAppearance";

type AppearanceItemTypes = {
  appearanceImg?: string;
  appearanceText?: string;
  appearanceId: string;
  characterName: string;
  updatedAppearancePart: TempAppearancePartTypes | null;

  type: TranslationTextFieldNameAppearancePartsTypes | "temp";
  setAppearanceType: React.Dispatch<React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes | "temp">>;
};

export default function AppearanceItem({
  appearanceText,
  characterName,
  appearanceImg,
  appearanceId,
  type,
  updatedAppearancePart,
  setAppearanceType,
}: AppearanceItemTypes) {
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  const [isMounted, setIsMounted] = useState(false);

  const uploadImg = useUpdateImg({
    path: "/appearanceParts",
    preview: imagePreview,
    id: appearanceId,
  });

  useEffect(() => {
    if (imagePreview && isMounted) {
      uploadImg.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [typeToRus, setTypeToRus] = useState<AppearancePartVariationRusTypes>(
    type === "accessory"
      ? "украшение"
      : type === "art"
      ? "татуировка"
      : type === "body"
      ? "тело"
      : type === "dress"
      ? "внешний вид"
      : type === "hair"
      ? "волосы"
      : type === "temp"
      ? "остальное"
      : "кожа"
  );

  useEffect(() => {
    if (type) {
      setAppearanceType(type);
      setTypeToRus(
        type === "accessory"
          ? "украшение"
          : type === "art"
          ? "татуировка"
          : type === "body"
          ? "тело"
          : type === "dress"
          ? "внешний вид"
          : type === "hair"
          ? "волосы"
          : type === "temp"
          ? "остальное"
          : "кожа"
      );
    }
  }, [type]);

  useEffect(() => {
    if (
      updatedAppearancePart &&
      updatedAppearancePart.appearancePartId === appearanceId &&
      updatedAppearancePart.type !== type
    ) {
      setAppearanceType(updatedAppearancePart.type);
      setTypeToRus(
        updatedAppearancePart.type === "accessory"
          ? "украшение"
          : updatedAppearancePart.type === "art"
          ? "татуировка"
          : updatedAppearancePart.type === "body"
          ? "тело"
          : updatedAppearancePart.type === "dress"
          ? "внешний вид"
          : updatedAppearancePart.type === "hair"
          ? "волосы"
          : updatedAppearancePart.type === "temp"
          ? "остальное"
          : "кожа"
      );
    }
  }, [updatedAppearancePart, appearanceId, type]);

  return (
    <>
      <div className="h-full">
        {appearanceImg ? (
          <img
            src={appearanceImg}
            alt={appearanceText}
            className="w-[80%] h-[50%] absolute object-contain left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"
          />
        ) : (
          <PreviewImage
            imagePreview={imagePreview}
            setPreview={setImagePreview}
            imgClasses="w-[80%] h-[50%] object-contain left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 absolute"
          />
        )}
      </div>

      <div className="absolute top-[5px] right-[0px] flex flex-col gap-[5px] p-[5px] text-right w-[calc(100%-10px)]">
        <h3 className="text-[20px] text-heading bg-cyan rounded-md px-[5px] py-[5px]">{characterName}</h3>
        <p
          className={`text-[15px] text-white ${appearancePartColors[typeToRus]} rounded-md w-fit ml-auto px-[10px] py-[5px]`}
        >
          {typeToRus}
        </p>
      </div>
    </>
  );
}
