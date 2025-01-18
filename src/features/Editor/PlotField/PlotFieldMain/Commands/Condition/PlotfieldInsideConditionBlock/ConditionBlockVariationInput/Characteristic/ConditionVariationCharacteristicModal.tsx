import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";

type CharacteristicsPromptModalTypes<T> = {
  setCurrentCharacteristic: React.Dispatch<React.SetStateAction<T>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  currentCharacteristic: T;
  initValue: T;
  inputClasses?: string;
  setInitValue: React.Dispatch<React.SetStateAction<T>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

function ConditionVariationCharacteristicModal<T>({
  setCurrentCharacteristic,
  setCharacteristicId,
  currentCharacteristic,
  initValue,
  inputClasses,
  setInitValue,
  setUpdate,
}: CharacteristicsPromptModalTypes<T>) {
  const { storyId } = useParams();
  const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedCharacteristics = useMemo(() => {
    if (!characteristics || typeof currentCharacteristic === "number") return [];
    if (typeof currentCharacteristic === "string" && currentCharacteristic?.trim().length) {
      return characteristics.filter((c) =>
        c.translations.filter(
          (ct) =>
            ct.textFieldName === "characterCharacteristic" &&
            ct.text?.toLowerCase().includes(currentCharacteristic?.toLowerCase())
        )
      );
    } else {
      return characteristics;
    }
  }, [currentCharacteristic, characteristics]);

  const updateCharacteristicOnBlur = () => {
    if (initValue === currentCharacteristic) {
      return;
    }

    if (typeof currentCharacteristic === "string") {
      const existingCharacteristic = memoizedCharacteristics.find((mc) =>
        mc.translations.find((mct) => mct.text?.toLowerCase() === currentCharacteristic?.toLowerCase())
      );
      if (existingCharacteristic) {
        handleSubmit({
          characteristicId: existingCharacteristic.characteristicId,
          currentCharacteristic: ((existingCharacteristic.translations || []).find(
            (t) => t.textFieldName === "characterCharacteristic"
          )?.text || "") as T,
        });
      } else {
        // TODO suggest to create
      }
    }
  };

  const handleSubmit = ({
    characteristicId,
    currentCharacteristic,
  }: {
    currentCharacteristic: T;
    characteristicId: string;
  }) => {
    if (initValue === currentCharacteristic) {
      return;
    }

    setCurrentCharacteristic(currentCharacteristic);
    setCharacteristicId(characteristicId);

    setInitValue(currentCharacteristic);

    setUpdate(true);
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: memoizedCharacteristics.length });

  return (
    <Popover open={showCharacteristicModal} onOpenChange={setShowCharacteristicModal}>
      <PopoverTrigger asChild>
        <div>
          <PlotfieldInput
            ref={currentInput}
            value={typeof currentCharacteristic === "string" ? currentCharacteristic : ""}
            onChange={(e) => {
              setCurrentCharacteristic(e.target.value as T);
            }}
            onBlur={updateCharacteristicOnBlur}
            className={`${inputClasses ? inputClasses : " w-full text-text md:text-[17px] border-border border-[3px]"}`}
            placeholder="Характеристика"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {memoizedCharacteristics?.length ? (
          memoizedCharacteristics?.map((c, i) => (
            <Button
              key={`${c.characteristicId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                handleSubmit({
                  currentCharacteristic: c.translations[0]?.text as T,
                  characteristicId: c.characteristicId,
                });
                setShowCharacteristicModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {c.translations[0]?.text.length > 20
                ? c.translations[0]?.text.substring(0, 20) + "..."
                : c.translations[0]?.text}
            </Button>
          ))
        ) : !memoizedCharacteristics?.length ? (
          <Button
            type="button"
            onClick={() => setShowCharacteristicModal(false)}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

export default ConditionVariationCharacteristicModal;
