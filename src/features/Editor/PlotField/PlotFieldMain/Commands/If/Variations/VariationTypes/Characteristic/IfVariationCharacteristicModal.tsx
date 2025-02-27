import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useUpdateIfCharacteristic from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";
import useCommandIf from "../../../Context/IfContext";

type CharacteristicsPromptModalTypes = {
  setCurrentCharacteristic: React.Dispatch<React.SetStateAction<string | number>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setInitValue: React.Dispatch<React.SetStateAction<string | number>>;
  currentCharacteristic: string | number;
  plotfieldCommandId: string;
  characteristicId: string;
  initValue: string | number;
  ifVariationId: string;
  fieldType: "ifName" | "ifValue";
};

const IfVariationCharacteristicModal = ({
  setCurrentCharacteristic,
  setCharacteristicId,
  setInitValue,
  currentCharacteristic,
  plotfieldCommandId,
  ifVariationId,
  fieldType,
  initValue,
}: CharacteristicsPromptModalTypes) => {
  const { storyId } = useParams();
  const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);
  const { updateIfVariationValue } = useCommandIf();

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedCharacteristics = useMemo(() => {
    if (!characteristics || typeof currentCharacteristic === "number") return [];
    if (currentCharacteristic?.trim().length) {
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

  const updateIf = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });

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
          currentCharacteristic:
            (existingCharacteristic.translations || []).find((t) => t.textFieldName === "characterCharacteristic")
              ?.text || "",
        });
      }
    }
  };

  const handleSubmit = ({
    characteristicId,
    currentCharacteristic,
  }: {
    currentCharacteristic: string;
    characteristicId: string;
  }) => {
    setCurrentCharacteristic(currentCharacteristic);
    setCharacteristicId(characteristicId);

    setInitValue(currentCharacteristic);
    updateIfVariationValue({
      plotfieldCommandId,
      ifVariationId,
      characteristicId,
    });

    updateIf.mutate({
      characteristicId: fieldType === "ifName" ? characteristicId : null,
      secondCharacteristicId: fieldType === "ifValue" ? characteristicId : null,
    });
  };

  // const handleSelect = (index: number) => {
  //   const value = memoizedCharacteristics[index];
  //   if (value) {
  //     setShowKeyModal(false);
  //     handleSubmit({ characteristicId: value._id, currentCharacteristic: valuetranslations[0].text });
  //   }
  // };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: memoizedCharacteristics.length });

  return (
    <Popover open={showCharacteristicModal} onOpenChange={setShowCharacteristicModal}>
      <PopoverTrigger asChild>
        <div>
          <PlotfieldInput
            ref={currentInput}
            value={currentCharacteristic}
            onChange={(e) => {
              setCurrentCharacteristic(e.target.value);
            }}
            onBlur={updateCharacteristicOnBlur}
            className={`w-full text-text md:text-[17px] border-border border-[3px]`}
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
                handleSubmit({ currentCharacteristic: c.translations[0]?.text, characteristicId: c.characteristicId });
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
};

export default IfVariationCharacteristicModal;
