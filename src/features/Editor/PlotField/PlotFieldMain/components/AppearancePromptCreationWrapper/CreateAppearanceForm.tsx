import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter } from "@/components/ui/sheet";

import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import useCreateAppearancePartOptimistic from "@/hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import PreviewImage from "@/ui/shared/PreviewImage";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import SelectAppearanceType from "./SelectAppearanceType";

type CreateAppearanceFormTypes = {
  setStartCreatingAppearance: React.Dispatch<React.SetStateAction<boolean>>;
  onValueUpdating?: ({ appearancePartId }: { appearancePartId: string }) => void;
  startCreatingAppearance: boolean;
  creatingAppearanceName: string;
  characterId: string;
};

export default function CreateAppearanceForm({
  setStartCreatingAppearance,
  onValueUpdating,
  characterId,
  startCreatingAppearance,
  creatingAppearanceName,
}: CreateAppearanceFormTypes) {
  const { storyId } = useParams();
  const [appearanceName, setAppearanceName] = useState(creatingAppearanceName || "");
  const [appearanceType, setAppearanceType] = useState<TranslationTextFieldNameAppearancePartsTypes | "temp">("temp");

  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  useEffect(() => {
    if (creatingAppearanceName) {
      setAppearanceName(creatingAppearanceName);
    }
  }, [creatingAppearanceName]);

  const uploadImgMutation = useUpdateImg({
    path: "/appearanceParts",
    preview: imagePreview,
  });

  const { mutateAsync: createAppearance } = useCreateAppearancePartOptimistic({
    appearancePartName: appearanceName,
    storyId: storyId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appearanceName.trim().length) {
      toast("Название обязательно", toastErrorStyles);
      return;
    }

    const appearanceId = generateMongoObjectId();
    setStartCreatingAppearance(false);
    toast("Внешний вид создан", toastSuccessStyles);
    if (onValueUpdating) {
      onValueUpdating({ appearancePartId: appearanceId });
    }
    await createAppearance({
      appearancePartId: appearanceId,
      currentLanguage: "russian",
      characterId,
      type: appearanceType,
    });
    if (imagePreview) {
      await uploadImgMutation.mutateAsync({ bodyId: appearanceId });
    }
  };

  return (
    <Sheet onOpenChange={setStartCreatingAppearance} open={startCreatingAppearance}>
      <SheetContent onSubmit={handleSubmit} side={"top"}>
        <div className="flex md:flex-row flex-col gap-[10px]">
          <div className="flex flex-col gap-[10px] md:w-[200px] flex-grow">
            <div className="w-full h-[150px] rounded-md relative bg-secondary">
              <PreviewImage
                imagePreview={imagePreview}
                imgClasses="absolute w-[150px] -translate-x-1/2 left-1/2 object-cover"
                setPreview={setImagePreview}
              />
            </div>
            <SelectAppearanceType setAppearanceType={setAppearanceType} />
          </div>

          <PlotfieldInput
            placeholder="Название"
            value={appearanceName}
            onChange={(e) => setAppearanceName(e.target.value)}
            className="text-text opacity-90 flex-grow"
          />
        </div>
        <SheetFooter className="mt-[10px]">
          <SheetClose asChild>
            <Button
              onClick={handleSubmit}
              className="text-text bg-brand-gradient-left hover:opacity-90 active:scale-[.99] transition-all"
              type="submit"
            >
              Создать
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
