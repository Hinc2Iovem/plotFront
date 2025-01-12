import React, { useEffect, useState } from "react";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { TranslationAppearancePartTypes } from "../../types/Additional/TranslationTypes";
import PreviewImage from "../../ui/shared/PreviewImage";
import useGetAppearancePartById from "../../hooks/Fetching/AppearancePart/useGetAppearancePartById";
import { useQueryClient } from "@tanstack/react-query";
import { AppearancePartValueTypes } from "@/types/StoryData/AppearancePart/AppearancePartTypes";
import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { toast } from "sonner";
import SyncLoad from "@/ui/Loaders/SyncLoader";

type WardrobeItemTypes = {
  characterId: string;
  created: boolean | null;
  appearanceValue: AppearancePartValueTypes;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setInitAppearanceValue: React.Dispatch<React.SetStateAction<AppearancePartValueTypes>>;
  setAppearanceValue: React.Dispatch<React.SetStateAction<AppearancePartValueTypes>>;
} & TranslationAppearancePartTypes;

export default function WardrobeItem({
  appearancePartId,
  translations,
  type,
  appearanceValue,
  characterId,
  created,
  setCharacterId,
  setAppearanceValue,
  setInitAppearanceValue,
}: WardrobeItemTypes) {
  const queryClient = useQueryClient();
  const { data: appearancePart } = useGetAppearancePartById({
    appearancePartId,
  });
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const [currentAppearance, setCurrentAppearance] = useState<AppearancePartValueTypes>({
    appearanceId: appearancePartId,
    appearanceImg: "",
    appearanceName: translations[0]?.text,
    appearanceType: type,
  });

  useEffect(() => {
    if (appearancePart?.img) {
      setCurrentAppearance((prev) => ({
        ...prev,
        appearanceImg: appearancePart.img,
        appearanceType: appearancePart.type,
      }));
    }
  }, [appearancePart]);

  useEffect(() => {
    if (typeof created === "boolean" && appearanceValue.appearanceId === appearancePartId) {
      setCurrentAppearance(appearanceValue);
    }
  }, [created]);

  const { mutateAsync: updateImg, isPending } = useUpdateImg({
    id: appearancePartId,
    path: "/appearanceParts",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const uploadAndInvalidate = async () => {
      if (isMounted && imagePreview) {
        try {
          await updateImg({ bodyId: appearancePartId });
          queryClient.invalidateQueries({
            queryKey: ["appearancePart", appearancePartId],
          });
          toast("Картинка была обновлена", toastSuccessStyles);
        } catch (error) {
          toast("Ой, ой, изображение не было загруженно", toastErrorStyles);
          console.error("Image upload failed:", error);
        }
      }
    };

    uploadAndInvalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <article className={`rounded-md h-[337px] w-full border-border border-[1px] relative`}>
      {currentAppearance?.appearanceImg ? (
        <img
          src={currentAppearance.appearanceImg}
          alt="AppearanceImg"
          className="object-contain w-[80%] h-[80%] cursor-pointer rounded-t-md mx-auto mt-[10px]"
        />
      ) : (
        <PreviewImage
          imgClasses="absolute object-cover rounded-md h-[200px] -translate-y-[137px] -translate-x-1/2 left-1/2"
          divClasses="top-1/2 relative"
          imagePreview={imagePreview}
          setPreview={setPreview}
        />
      )}
      <button
        onClick={() => {
          setCharacterId(characterId);
          setAppearanceValue(currentAppearance);
          setInitAppearanceValue(currentAppearance);
        }}
        className="absolute text-[30px] text-start bottom-0 w-full rounded-b-md text-text bg-background px-[10px] py-[5px]"
      >
        {`${currentAppearance.appearanceName}`.trim().length > 22
          ? `${currentAppearance.appearanceName}...`.substring(0, 22)
          : `${currentAppearance.appearanceName}`}
      </button>
      {isPending && (
        <SyncLoad conditionToLoading={!isPending} conditionToStart={isPending} className="top-[10px] right-[10px] " />
      )}
    </article>
  );
}
