import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useGetTranslationAppearancePartsByStoryId from "@/hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type AppearancePartsPromptModalTypes = {
  currentAppearancePartName: string;
  appearancePartId: string;
  characterId?: string;
  inputClasses?: string;
  appearanceType?: TranslationTextFieldNameAppearancePartsTypes | "temp";
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId: React.Dispatch<React.SetStateAction<string>>;
  onValueUpdating?: ({ appearancePartId }: { appearancePartId: string }) => void;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onBlur?: () => void;
  setCreatingAppearanceName?: React.Dispatch<React.SetStateAction<string>>;
  setCreateNewAppearance?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AppearancePartsPromptModal({
  appearancePartId,
  currentAppearancePartName,
  inputClasses,
  appearanceType,
  characterId,
  setAppearancePartId,
  setCurrentAppearancePartName,
  onValueUpdating,
  onChange,
  onClick,
  onBlur,
  setCreateNewAppearance,
  setCreatingAppearanceName,
}: AppearancePartsPromptModalTypes) {
  const { storyId } = useParams();
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [localValue, setLocalValue] = useState("");

  const currentInput = useRef<HTMLInputElement>(null);

  const { data: appearanceParts } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedByCharacterId = useMemo(() => {
    if (characterId) {
      return appearanceParts?.filter((a) => a.characterId === characterId);
    }
    return appearanceParts || [];
  }, [characterId, appearanceParts]);

  const memoizedAppearanceParts = useMemo(() => {
    if (!memoizedByCharacterId) return [];

    return memoizedByCharacterId.filter((p) => {
      const matchesName = !localValue || p.translations[0]?.text?.toLowerCase().includes(localValue.toLowerCase());

      const matchesType = !appearanceType?.trim() || p.type === appearanceType;

      return matchesName && matchesType;
    });
  }, [localValue, appearanceType, memoizedByCharacterId]);

  const updateAppearancePartOnBlur = () => {
    if (localValue === currentAppearancePartName) {
      return;
    }

    const existingPart = memoizedAppearanceParts?.find((p) =>
      p?.translations?.find((pt) => pt.text?.toLowerCase() === currentAppearancePartName.toLowerCase())
    );

    if (existingPart) {
      setCurrentAppearancePartName((existingPart.translations || [])[0]?.text || "");
      handleUpdatingValues({
        id: existingPart?.appearancePartId || "",
        name: (existingPart.translations || [])[0]?.text || "",
      });
    } else {
      // suggest to create
      if (setCreateNewAppearance && setCreatingAppearanceName) {
        setCreatingAppearanceName(localValue || "");
        setCreateNewAppearance(true);
      }
      console.log("Non-existing appearance");
    }
  };

  const handleUpdatingValues = ({ id, name }: { id: string; name: string }) => {
    setAppearancePartId(id);
    setCurrentAppearancePartName(name);
    setShowAppearanceModal(false);

    if (appearancePartId !== id) {
      if (onValueUpdating) {
        onValueUpdating({ appearancePartId: id });
      }
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: memoizedAppearanceParts.length });

  return (
    <Popover open={showAppearanceModal} onOpenChange={setShowAppearanceModal}>
      <PopoverTrigger asChild>
        <div>
          <PlotfieldInput
            ref={currentInput}
            value={localValue}
            onChange={(e) => {
              setShowAppearanceModal(true);
              setLocalValue(e.target.value);
            }}
            onClick={() => {
              if (onClick) {
                onClick();
              }
            }}
            onBlur={() => {
              updateAppearancePartOnBlur();
              if (onChange) {
                onChange(localValue);
              }
              if (onBlur) {
                onBlur();
              }
            }}
            className={`${
              inputClasses?.trim().length ? inputClasses : "w-full text-text md:text-[17px] border-border border-[3px]"
            }`}
            placeholder="Внешний Вид"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {memoizedAppearanceParts?.length ? (
          memoizedAppearanceParts?.map((c, i) => (
            <Button
              key={`${c.appearancePartId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                setLocalValue((c.translations || [])[0]?.text || "");
                handleUpdatingValues({ id: c.appearancePartId, name: (c.translations || [])[0]?.text });
                setShowAppearanceModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {c.translations[0]?.text.length > 20
                ? c.translations[0]?.text.substring(0, 20) + "..."
                : c.translations[0]?.text}
            </Button>
          ))
        ) : !memoizedAppearanceParts?.length ? (
          <Button
            type="button"
            onClick={() => setShowAppearanceModal(false)}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
