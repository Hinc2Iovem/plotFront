import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import useIfVariations from "../../Context/IfContext";
import useGetTranslationCharacteristic from "../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import { isNumeric } from "../../../../../../../../utils/regExpIsNumeric";
import useSearch from "../../../../../../Context/Search/SearchContext";
import IfSignField from "../IfSignField";
import useUpdateIfCharacteristic from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";

type IfVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  value: number | null;
  ifVariationId: string;
  firstCharacteristicId: string;
  topologyBlockId: string;
  secondCharacteristicId: string;
};

export default function IfVariationCharacteristic({
  plotfieldCommandId,
  value,
  ifVariationId,
  topologyBlockId,
  secondCharacteristicId,
  firstCharacteristicId,
}: IfVariationCharacteristicTypes) {
  const [showFirstCharacteristicPromptModal, setShowFirstCharacteristicPromptModal] = useState(false);
  const [showSecondCharacteristicPromptModal, setShowSecondCharacteristicPromptModal] = useState(false);
  const [hideModal, setHideModal] = useState<"first" | "second" | null>(null);

  useEffect(() => {
    if (hideModal === "second") {
      setShowSecondCharacteristicPromptModal(false);
    } else if (hideModal === "first") {
      setShowFirstCharacteristicPromptModal(false);
    }
  }, [hideModal]);

  return (
    <div className="flex flex-col gap-[1rem] w-full">
      <div className="w-full flex gap-[.5rem] flex-shrink flex-wrap">
        <CharacteristicInputField
          key={"characteristic-1"}
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacteristicPromptModal={setShowFirstCharacteristicPromptModal}
          showCharacteristicPromptModal={showFirstCharacteristicPromptModal}
          fieldType="ifName"
          ifVariationId={ifVariationId}
          currentCharacteristicId={firstCharacteristicId}
          setHideModal={setHideModal}
          topologyBlockId={topologyBlockId}
        />
        <div className="h-full">
          <IfSignField ifVariationId={ifVariationId} plotfieldCommandId={plotfieldCommandId} type="characteristic" />
        </div>
        <CharacteristicInputField
          key={"characteristic-2"}
          setShowCharacteristicPromptModal={setShowSecondCharacteristicPromptModal}
          showCharacteristicPromptModal={showSecondCharacteristicPromptModal}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="ifValue"
          ifVariationId={ifVariationId}
          currentCharacteristicId={secondCharacteristicId}
          value={value}
          setHideModal={setHideModal}
          topologyBlockId={topologyBlockId}
        />
      </div>
    </div>
  );
}

type CharacteristicInputFieldTypes = {
  setShowCharacteristicPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHideModal: React.Dispatch<React.SetStateAction<"first" | "second" | null>>;
  showCharacteristicPromptModal: boolean;
  plotfieldCommandId: string;
  ifVariationId: string;
  currentCharacteristicId: string;
  topologyBlockId: string;
  value?: number | null;
  fieldType: "ifName" | "ifValue";
};

function CharacteristicInputField({
  setShowCharacteristicPromptModal,
  setHideModal,
  showCharacteristicPromptModal,
  plotfieldCommandId,
  fieldType,
  ifVariationId,
  currentCharacteristicId,
  value,
  topologyBlockId,
}: CharacteristicInputFieldTypes) {
  const { episodeId } = useParams();
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [currentIfName, setCurrentIfName] = useState<string | number>(value ? value : "");
  const [backUpIfName, setBackUpIfName] = useState<string | number>(value ? value : "");

  const [characteristicId, setCharacteristicId] = useState(currentCharacteristicId);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: characteristicId,
    language: "russian",
  });

  const { updateIfVariationValue } = useIfVariations();

  const updateIf = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });

  useEffect(() => {
    if (translatedCharacteristic) {
      setCurrentIfName((translatedCharacteristic.translations || [])[0]?.text);
      setBackUpIfName((translatedCharacteristic.translations || [])[0]?.text);
    }
  }, [translatedCharacteristic, characteristicId]);

  const debouncedIfName = useDebounce({
    delay: 700,
    value: typeof currentIfName === "string" ? currentIfName : "",
  });

  useEffect(() => {
    // updates value for the second characteristic when it's a number
    if (isNumeric(currentIfName.toString()) && fieldType === "ifValue") {
      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        ifValue: Number(currentIfName),
      });

      updateIf.mutate({
        value: Number(currentIfName),
      });
    }
  }, [currentIfName, fieldType]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "If - Characteristic",
          id: ifVariationId,
          text: debouncedIfName,
          topologyBlockId,
          type: "ifVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Characteristic",
        id: ifVariationId,
        value: debouncedIfName,
        type: "ifVariation",
      });
    }
  }, [debouncedIfName, episodeId]);

  return (
    <div className="w-[40%] flex-grow min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        focusedSecondTime={focusedSecondTime}
        onBlur={() => {
          setFocusedSecondTime(false);
        }}
        setFocusedSecondTime={setFocusedSecondTime}
        placeholder="Характеристика"
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
          if (fieldType === "ifName") {
            setHideModal("second");
          } else {
            setHideModal("first");
          }
        }}
        value={currentIfName}
        onChange={(e) => {
          if (!showCharacteristicPromptModal) {
            setShowCharacteristicPromptModal(true);
            if (fieldType === "ifName") {
              setHideModal("second");
            } else {
              setHideModal("first");
            }
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentIfName(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? " " : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <CharacteristicsPromptModal
        currentCharacteristic={currentIfName}
        setCharacteristicId={setCharacteristicId}
        setBackUpCharacteristic={setBackUpIfName}
        setCurrentCharacteristic={setCurrentIfName}
        setShowCharacteristicPromptModal={setShowCharacteristicPromptModal}
        showCharacteristicPromptModal={showCharacteristicPromptModal}
        debouncedCharacteristic={debouncedIfName}
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
        fieldType={fieldType}
        backUpCharacteristic={typeof backUpIfName === "string" ? backUpIfName : ""}
        characteristicId={characteristicId}
      />
    </div>
  );
}

export type DebouncedCheckCharacteristicTypes = {
  characteristicId: string;
  characteristicName: string;
};

type CharacteristicsPromptModalTypes = {
  setShowCharacteristicPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCharacteristic: React.Dispatch<React.SetStateAction<string | number>>;
  setBackUpCharacteristic: React.Dispatch<React.SetStateAction<string | number>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  showCharacteristicPromptModal: boolean;
  currentCharacteristic: string | number;
  debouncedCharacteristic: string;
  plotfieldCommandId: string;
  characteristicId: string;
  backUpCharacteristic: string;
  ifVariationId: string;
  fieldType: "ifName" | "ifValue";
};

export function CharacteristicsPromptModal({
  setShowCharacteristicPromptModal,
  setCurrentCharacteristic,
  setBackUpCharacteristic,
  setCharacteristicId,
  currentCharacteristic,
  showCharacteristicPromptModal,
  debouncedCharacteristic,
  plotfieldCommandId,
  ifVariationId,
  fieldType,
  backUpCharacteristic,
  characteristicId,
}: CharacteristicsPromptModalTypes) {
  const { storyId } = useParams();

  const { updateIfVariationValue } = useIfVariations();

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const updateIf = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });

  const handleSubmit = ({
    characteristicId,
    currentCharacteristic,
  }: {
    currentCharacteristic: string;
    characteristicId: string;
  }) => {
    setShowCharacteristicPromptModal(false);
    setCurrentCharacteristic(currentCharacteristic);
    setBackUpCharacteristic(currentCharacteristic);
    setCharacteristicId(characteristicId);

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

  useEffect(() => {
    if (debouncedCharacteristic?.trim().length && typeof currentCharacteristic === "string") {
      const existingCharacteristic = memoizedCharacteristics.find((mc) =>
        mc.translations.find((mct) => mct.text?.toLowerCase() === currentCharacteristic?.toLowerCase())
      );

      if (existingCharacteristic) {
        updateIfVariationValue({
          plotfieldCommandId,
          ifVariationId,
          characteristicId: existingCharacteristic.characteristicId,
        });

        setBackUpCharacteristic((existingCharacteristic.translations || [])[0]?.text);
        setCurrentCharacteristic((existingCharacteristic.translations || [])[0]?.text);

        updateIf.mutate({
          characteristicId: fieldType === "ifName" ? existingCharacteristic.characteristicId : null,
          secondCharacteristicId: fieldType === "ifValue" ? existingCharacteristic.characteristicId : null,
        });
      } else {
        console.log("Such characteristic doesn't exist");
        if (
          !showCharacteristicPromptModal &&
          characteristicId?.trim().length &&
          backUpCharacteristic?.trim().length &&
          !isNumeric(currentCharacteristic)
        ) {
          setCurrentCharacteristic(backUpCharacteristic);
        }
        return;
      }
    }
  }, [debouncedCharacteristic, showCharacteristicPromptModal]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacteristicPromptModal,
    showModal: showCharacteristicPromptModal,
  });
  return (
    <AsideScrollable ref={modalRef} className={`${showCharacteristicPromptModal ? "" : "hidden"} translate-y-[.5rem]`}>
      {(memoizedCharacteristics || [])?.map((mk) => (
        <AsideScrollableButton
          key={mk.characteristicId}
          onClick={() =>
            handleSubmit({ currentCharacteristic: mk.translations[0]?.text, characteristicId: mk.characteristicId })
          }
        >
          {mk.translations[0]?.text}
        </AsideScrollableButton>
      ))}
    </AsideScrollable>
  );
}
