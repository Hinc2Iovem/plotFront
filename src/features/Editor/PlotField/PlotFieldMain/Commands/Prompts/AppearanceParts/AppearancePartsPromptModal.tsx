import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useGetTranslationAppearancePartsByStoryId from "@/hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type AppearancePartsPromptModalTypes = {
  currentAppearancePartName: string;
  initialValue: string;
  appearancePartId: string;
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId: React.Dispatch<React.SetStateAction<string>>;
  setInitialValue: React.Dispatch<React.SetStateAction<string>>;
  onValueUpdating?: ({ appearancePartId }: { appearancePartId: string }) => void;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onBlur?: () => void;
};

export default function AppearancePartsPromptModal({
  appearancePartId,
  currentAppearancePartName,
  initialValue,
  setAppearancePartId,
  setCurrentAppearancePartName,
  setInitialValue,
  onValueUpdating,
  onChange,
  onClick,
  onBlur,
}: AppearancePartsPromptModalTypes) {
  const { storyId } = useParams();
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const { data: appearanceParts } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedAppearanceParts = useMemo(() => {
    if (!appearanceParts) return [];

    if (currentAppearancePartName) {
      return appearanceParts?.filter((p) =>
        p?.translations[0].text?.toLowerCase().includes(currentAppearancePartName?.toLowerCase())
      );
    } else {
      return appearanceParts;
    }
  }, [currentAppearancePartName, appearanceParts]);

  const updateAppearancePartOnBlur = () => {
    if (initialValue === currentAppearancePartName) {
      return;
    }

    const existingPart = memoizedAppearanceParts?.find((p) =>
      p?.translations?.find((pt) => pt.text?.toLowerCase() === currentAppearancePartName.toLowerCase())
    );

    if (existingPart) {
      setInitialValue((existingPart.translations || [])[0]?.text || "");
      handleUpdatingValues({
        id: existingPart?.appearancePartId || "",
        name: (existingPart.translations || [])[0]?.text || "",
      });
    }
    // suggest to create
  };

  const handleUpdatingValues = ({ id, name }: { id: string; name: string }) => {
    if (appearancePartId !== id) {
      if (onValueUpdating) {
        onValueUpdating({ appearancePartId: id });
      }
    }
    setAppearancePartId(id);
    setCurrentAppearancePartName(name);
    setShowAppearanceModal(false);
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: memoizedAppearanceParts.length });

  return (
    <Popover open={showAppearanceModal} onOpenChange={setShowAppearanceModal}>
      <PopoverTrigger asChild>
        <div>
          <PlotfieldInput
            ref={currentInput}
            value={currentAppearancePartName}
            onChange={(e) => {
              setShowAppearanceModal(true);
              setCurrentAppearancePartName(e.target.value);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onClick={() => {
              if (onClick) {
                onClick();
              }
            }}
            onBlur={() => {
              updateAppearancePartOnBlur();
              if (onBlur) {
                onBlur();
              }
            }}
            className={`w-full text-text md:text-[17px] border-border border-[3px]`}
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
                setInitialValue((c.translations || [])[0]?.text || "");
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
