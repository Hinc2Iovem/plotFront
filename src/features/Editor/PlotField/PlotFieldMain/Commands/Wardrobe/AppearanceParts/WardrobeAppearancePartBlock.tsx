import { useEffect, useState } from "react";
import useGetAppearancePartById from "../../../../../../../hooks/Fetching/AppearancePart/useGetAppearancePartById";
import useGetTranslationAppearancePart from "../../../../../../../hooks/Fetching/Translation/useGetTranslationAppearancePart";
import { CommandWardrobeAppearanceTypeBlockTypes } from "../../../../../../../types/StoryEditor/PlotField/Wardrobe/WardrobeTypes";
import useUpdateImg from "../../../../../../../hooks/Patching/useUpdateImg";
import PreviewImageSmallIcons from "../../../../../../../ui/shared/PreviewImageSmallIcons";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import useDeleteCommandWardrobeAppearancePart from "@/features/Editor/PlotField/hooks/Wardrobe/Command/useDeleteCommandWardrobeAppearancePart";

type WardrobeAppearancePartBlockTypes = {
  setAllAppearanceNames: React.Dispatch<React.SetStateAction<string[]>>;
} & CommandWardrobeAppearanceTypeBlockTypes;

export default function WardrobeAppearancePartBlock({
  appearancePartId,
  commandWardrobeId,
  setAllAppearanceNames,
}: WardrobeAppearancePartBlockTypes) {
  const [showFullName, setShowFullName] = useState(false);
  const [appearancePartImg, setAppearancePartImg] = useState<string | null | ArrayBuffer>("");

  const [appearancePartName, setAppearancePartName] = useState("");
  const { data: appearancePartTranslated } = useGetTranslationAppearancePart({
    appearancePartId,
  });
  const { data: appearancePart } = useGetAppearancePartById({
    appearancePartId,
  });

  useEffect(() => {
    if (appearancePartTranslated) {
      setAppearancePartName(appearancePartTranslated.translations[0]?.text || "");
      setAllAppearanceNames((prev) => {
        if (!prev.includes(appearancePartTranslated.translations[0]?.text)) {
          return [...prev, appearancePartTranslated.translations[0]?.text];
        } else {
          return prev;
        }
      });
    }
  }, [appearancePartTranslated]);

  useEffect(() => {
    if (appearancePart) {
      setAppearancePartImg(appearancePart?.img ?? "");
    }
  }, [appearancePart]);

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>("");

  const updateAppearancePartImg = useUpdateImg({
    id: appearancePartId,
    path: "/appearanceParts",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview && appearancePartImg !== imagePreview) {
      updateAppearancePartImg.mutate({});
      setAppearancePartImg(imagePreview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const removeAppearance = useDeleteCommandWardrobeAppearancePart({ commandWardrobeId, appearancePartId });

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={`${
          showFullName ? "z-10" : ""
        } w-full h-[150px] max-h-[150px] flex flex-col bg-secondary rounded-md gap-[5px] shadow-md hover:scale-[1.01] relative`}
      >
        {appearancePartImg ? (
          <img
            src={(appearancePartImg as string) || ""}
            alt="AppearancePartImg"
            className="w-full object-contain h-[7rem] translate-y-[5px]"
          />
        ) : (
          <PreviewImageSmallIcons
            imagePreview={imagePreview}
            imgClasses="w-full object-contain h-full translate-y-[5px]"
            setPreview={setPreview}
            divClasses="relative w-full h-[7rem]"
            imgNotExistingClasses="w-[50%] translate-x-1/2 translate-y-[5px] top-[5px] rounded-md h-full object-contain"
          />
        )}
        <h4
          onMouseOver={() => {
            if (appearancePartName?.trim().length > 13) {
              setShowFullName(true);
            }
          }}
          className="text-[20px] whitespace-nowrap px-[10px] text-paragraph w-full"
        >
          {appearancePartName?.trim().length > 13 ? appearancePartName.substring(0, 9) + "..." : appearancePartName}
        </h4>
        <aside
          onMouseOut={() => {
            if (appearancePartName?.trim().length > 13) {
              setShowFullName(false);
            }
          }}
          className={`${
            showFullName ? "" : "hidden"
          } absolute bottom-[0rem] text-paragraph bg-secondary w-fit whitespace-nowrap rounded-md text-[17px] p-[5px]`}
        >
          {appearancePartName}
        </aside>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => removeAppearance.mutate({})}>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
