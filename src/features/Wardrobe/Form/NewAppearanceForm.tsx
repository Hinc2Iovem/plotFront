import { toastErrorStyles, toastNotificationStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Input } from "@/components/ui/input";
import StoryAttributesCharacterPrompt from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesCharacterPrompt";
import StoryAttributesClearButton from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesClearButton";
import StoryAttributesCreateButton from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesCreateButton";
import StoryAttributesImgBlock from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesImgBlock";
import StoryAttributesSelectAppearanceType from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesSelectAppearanceType";
import useUpdateFullAppearancePartTranslation from "@/hooks/Patching/Translation/useUpdateFullAppearancePartTranslation";
import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import useCreateAppearancePartOptimistic from "@/hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartValueTypes } from "@/types/StoryData/AppearancePart/AppearancePartTypes";
import { checkObjectsIdenticalShallow } from "@/utils/checkObjectsIdenticalShallow";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import usePrepareCharacterState from "./usePrepareCharacterState";

type NewAppearanceFormTypes = {
  initAppearanceValue: AppearancePartValueTypes;
  appearanceValue: AppearancePartValueTypes;
  characterId: string;
  filteredAppearanceType: TranslationTextFieldNameAppearancePartsTypes | "temp";
  setAppearanceValue: React.Dispatch<React.SetStateAction<AppearancePartValueTypes>>;
  setInitAppearanceValue: React.Dispatch<React.SetStateAction<AppearancePartValueTypes>>;
  setCreated: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export default function NewAppearanceForm({
  appearanceValue,
  characterId,
  initAppearanceValue,
  filteredAppearanceType,
  setAppearanceValue,
  setInitAppearanceValue,
  setCreated,
}: NewAppearanceFormTypes) {
  const { storyId } = useParams();
  const queryClient = useQueryClient();

  const { characterValue, setCharacterValue } = usePrepareCharacterState({ characterId });

  const createOrSave = !appearanceValue?.appearanceId?.trim().length ? "create" : "save";

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(appearanceValue.appearanceImg || "");
  const [currentAppearanceType, setCurrentAppearanceType] = useState(appearanceValue.appearanceType);

  useEffect(() => {
    setPreview(appearanceValue.appearanceImg || "");
  }, [appearanceValue.appearanceImg]);

  const uploadImgMutation = useUpdateImg({
    path: "/appearanceParts",
    preview: imagePreview,
  });

  const { mutateAsync: createAppearance, isPending: creating } = useCreateAppearancePartOptimistic({
    appearancePartName: appearanceValue.appearanceName,
    storyId: storyId || "",
  });

  const { mutateAsync: updateAppearance, isPending: updating } = useUpdateFullAppearancePartTranslation({
    appearancePartId: appearanceValue.appearanceId || "",
    language: "russian",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appearanceValue?.appearanceName?.trim().length) {
      toast("Название Обязательно", toastErrorStyles);
      return;
    }

    if (!appearanceValue?.appearanceType?.trim().length) {
      toast("Тип Обязательный", toastErrorStyles);
      return;
    }

    if (!characterValue?._id?.trim().length) {
      toast("Персонаж Обязательный", toastErrorStyles);
      return;
    }

    if (createOrSave === "create") {
      const appearanceId = generateMongoObjectId();

      await createAppearance({
        appearancePartId: appearanceId,
        currentLanguage: "russian",
        characterId: characterValue._id,
        img: typeof imagePreview === "string" ? imagePreview : "",
        type: appearanceValue.appearanceType,
      });

      if (imagePreview) {
        await uploadImgMutation.mutateAsync({ bodyId: appearanceId || "" });
      }

      queryClient.invalidateQueries({
        queryKey: ["appearancePart", filteredAppearanceType, "character", characterValue._id],
      });
    } else {
      if (checkObjectsIdenticalShallow(appearanceValue, initAppearanceValue)) {
        toast("Значения не были обновлены!", toastNotificationStyles);
        return;
      }
      if (imagePreview !== appearanceValue.appearanceImg) {
        await uploadImgMutation.mutateAsync({ bodyId: appearanceValue.appearanceId || "" });
      }
      await updateAppearance({
        appearancePartImg: appearanceValue.appearanceImg || "",
        appearancePartName: appearanceValue.appearanceName,
        storyId: storyId || "",
        appearancePartType: appearanceValue.appearanceType,
      });

      queryClient.invalidateQueries({
        queryKey: ["appearancePart", filteredAppearanceType, "character", characterValue._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["appearancePart", appearanceValue.appearanceId],
      });
    }

    toast(`Эмоция была ${createOrSave === "create" ? "создана" : "обновлена"}`, toastSuccessStyles);
    setInitAppearanceValue(appearanceValue);
    setCreated((prev) => (typeof prev === "boolean" ? !prev : true));
  };

  useEffect(() => {
    setAppearanceValue((prev) => ({
      ...prev,
      appearanceType: currentAppearanceType,
    }));
  }, [currentAppearanceType]);

  return (
    <form onSubmit={handleSubmit} className="md:max-w-[355px] w-full flex h-fit flex-col gap-[5px]">
      <StoryAttributesImgBlock setPreview={setPreview} imagePreview={imagePreview} />
      <StoryAttributesSelectAppearanceType
        triggerClasses={`md:text-[20px]`}
        filterOrForm="form"
        currentAppearanceType={appearanceValue.appearanceType}
        setCurrentAppearanceType={setCurrentAppearanceType}
      />

      <Input
        value={appearanceValue.appearanceName || ""}
        onChange={(e) =>
          setAppearanceValue((prev) => ({
            ...prev,
            appearanceName: e.target.value,
          }))
        }
        placeholder="Название"
        className="w-full border-border border-[1px] rounded-md px-[10px] py-[5px] text-text md:text-[20px]"
      />

      <StoryAttributesCharacterPrompt
        characterValue={characterValue}
        setCharacterValue={setCharacterValue}
        imgClasses=""
        inputClasses=""
      />
      <StoryAttributesCreateButton
        disabled={checkObjectsIdenticalShallow(appearanceValue, initAppearanceValue) || creating || updating}
        createOrSave={createOrSave}
      />
      <StoryAttributesClearButton
        disabled={creating || updating}
        clear={() => {
          const defaultObj: AppearancePartValueTypes = {
            appearanceId: "",
            appearanceImg: "",
            appearanceName: "",
            appearanceType: "" as TranslationTextFieldNameAppearancePartsTypes | "temp",
          };
          setAppearanceValue(defaultObj);
          setInitAppearanceValue(defaultObj);
        }}
      />
    </form>
  );
}
