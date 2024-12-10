import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import useConditionBlocks from "../../Context/ConditionContext";
import useGetTranslationCharacteristic from "../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import useUpdateConditionCharacteristic from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import ConditionSignField from "./ConditionSignField";
import { isNumeric } from "../../../../../../../../utils/regExpIsNumeric";
import useSearch from "../../../../../../Context/Search/SearchContext";

type ConditionBlockVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  value: number | null;
  conditionBlockVariationId: string;
  firstCharacteristicId: string;
  topologyBlockId: string;
  secondCharacteristicId: string;
};

export default function ConditionBlockVariationCharacteristic({
  plotfieldCommandId,
  conditionBlockId,
  value,
  conditionBlockVariationId,
  topologyBlockId,
  secondCharacteristicId,
  firstCharacteristicId,
}: ConditionBlockVariationCharacteristicTypes) {
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
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacteristicPromptModal={setShowFirstCharacteristicPromptModal}
          showCharacteristicPromptModal={showFirstCharacteristicPromptModal}
          fieldType="conditionName"
          conditionBlockVariationId={conditionBlockVariationId}
          currentCharacteristicId={firstCharacteristicId}
          setHideModal={setHideModal}
          topologyBlockId={topologyBlockId}
        />
        <div className="h-full">
          <ConditionSignField
            conditionBlockId={conditionBlockId}
            conditionBlockVariationId={conditionBlockVariationId}
            plotfieldCommandId={plotfieldCommandId}
            type="characteristic"
          />
        </div>
        <CharacteristicInputField
          key={"characteristic-2"}
          conditionBlockId={conditionBlockId}
          setShowCharacteristicPromptModal={setShowSecondCharacteristicPromptModal}
          showCharacteristicPromptModal={showSecondCharacteristicPromptModal}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="conditionValue"
          conditionBlockVariationId={conditionBlockVariationId}
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
  conditionBlockId: string;
  conditionBlockVariationId: string;
  currentCharacteristicId: string;
  topologyBlockId: string;
  value?: number | null;
  fieldType: "conditionName" | "conditionValue";
};

function CharacteristicInputField({
  setShowCharacteristicPromptModal,
  setHideModal,
  showCharacteristicPromptModal,
  plotfieldCommandId,
  conditionBlockId,
  fieldType,
  conditionBlockVariationId,
  currentCharacteristicId,
  value,
  topologyBlockId,
}: CharacteristicInputFieldTypes) {
  const { episodeId } = useParams();
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [currentConditionName, setCurrentConditionName] = useState<string | number>(value ? value : "");
  const [backUpConditionName, setBackUpConditionName] = useState<string | number>(value ? value : "");

  const [characteristicId, setCharacteristicId] = useState(currentCharacteristicId);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: characteristicId,
    language: "russian",
  });

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const updateConditionBlock = useUpdateConditionCharacteristic({
    conditionBlockCharacteristicId: conditionBlockVariationId,
  });

  useEffect(() => {
    if (translatedCharacteristic) {
      setCurrentConditionName((translatedCharacteristic.translations || [])[0]?.text);
      setBackUpConditionName((translatedCharacteristic.translations || [])[0]?.text);
    }
  }, [translatedCharacteristic, characteristicId]);

  const debouncedConditionName = useDebounce({
    delay: 700,
    value: typeof currentConditionName === "string" ? currentConditionName : "",
  });

  useEffect(() => {
    // updates value for the second characteristic when it's a number
    if (isNumeric(currentConditionName.toString()) && fieldType === "conditionValue") {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        conditionValue: Number(currentConditionName),
      });

      updateConditionBlock.mutate({
        value: Number(currentConditionName),
      });
    }
  }, [currentConditionName, fieldType]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Condition - Characteristic",
          id: conditionBlockVariationId,
          text: debouncedConditionName,
          topologyBlockId,
          type: "conditionVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Characteristic",
        id: conditionBlockVariationId,
        value: debouncedConditionName,
        type: "conditionVariation",
      });
    }
  }, [debouncedConditionName, episodeId]);

  return (
    <div className="w-[40%] flex-grow min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        placeholder="Характеристика"
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
          if (fieldType === "conditionName") {
            setHideModal("second");
          } else {
            setHideModal("first");
          }
        }}
        value={currentConditionName}
        onChange={(e) => {
          if (!showCharacteristicPromptModal) {
            setShowCharacteristicPromptModal(true);
            if (fieldType === "conditionName") {
              setHideModal("second");
            } else {
              setHideModal("first");
            }
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? " " : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <CharacteristicsPromptModal
        currentCharacteristic={currentConditionName}
        setCharacteristicId={setCharacteristicId}
        setBackUpCharacteristic={setBackUpConditionName}
        setCurrentCharacteristic={setCurrentConditionName}
        setShowCharacteristicPromptModal={setShowCharacteristicPromptModal}
        showCharacteristicPromptModal={showCharacteristicPromptModal}
        debouncedCharacteristic={debouncedConditionName}
        conditionBlockId={conditionBlockId}
        conditionBlockVariationId={conditionBlockVariationId}
        plotfieldCommandId={plotfieldCommandId}
        fieldType={fieldType}
        backUpCharacteristic={typeof backUpConditionName === "string" ? backUpConditionName : ""}
        characteristicId={characteristicId}
      />

      {/* <CreateNewCharacteristicModal
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
        conditionName={currentConditionName}
        conditionBlockId={conditionBlockId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
      /> */}
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
  conditionBlockId: string;
  characteristicId: string;
  backUpCharacteristic: string;
  conditionBlockVariationId: string;
  fieldType: "conditionName" | "conditionValue";
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
  conditionBlockId,
  conditionBlockVariationId,
  fieldType,
  backUpCharacteristic,
  characteristicId,
}: CharacteristicsPromptModalTypes) {
  const { storyId } = useParams();

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const updateConditionBlock = useUpdateConditionCharacteristic({
    conditionBlockCharacteristicId: conditionBlockVariationId,
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

    updateConditionBlockVariationValue({
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId,
      characteristicId,
    });

    updateConditionBlock.mutate({
      characteristicId: fieldType === "conditionName" ? characteristicId : null,
      secondCharacteristicId: fieldType === "conditionValue" ? characteristicId : null,
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
        updateConditionBlockVariationValue({
          conditionBlockId,
          plotfieldCommandId,
          conditionBlockVariationId,
          characteristicId: existingCharacteristic.characteristicId,
        });

        setBackUpCharacteristic((existingCharacteristic.translations || [])[0]?.text);
        setCurrentCharacteristic((existingCharacteristic.translations || [])[0]?.text);

        updateConditionBlock.mutate({
          characteristicId: fieldType === "conditionName" ? existingCharacteristic.characteristicId : null,
          secondCharacteristicId: fieldType === "conditionValue" ? existingCharacteristic.characteristicId : null,
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

// type CreateNewCharacteristicModalTypes = {
//   setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
//   setHighlightRedOnValueOnExisting: React.Dispatch<
//     React.SetStateAction<boolean>
//   >;
//   showCreateNewValueModal: boolean;
//   conditionName: string;
//   conditionBlockId: string;
// };

// function CreateNewCharacteristicModal({
//   setHighlightRedOnValueOnExisting,
//   setShowCreateNewValueModal,
//   showCreateNewValueModal,
//   conditionName,
//   conditionBlockId,
// }: CreateNewCharacteristicModalTypes) {
//   const { storyId } = useParams();
//   const focusOnBtnRef = useRef<HTMLButtonElement>(null);
//   const createNewCharacteristicModalRef = useRef<HTMLDivElement>(null);

//   const createNewCharacteristic = useCreateCharacteristicOptimistic({
//     characteristicName: conditionName,
//     storyId: storyId || "",
//     language: "russian",
//   });

//   const updateConditionBlock = useUpdateConditionValue({
//     conditionBlockId,
//   });
//   useEffect(() => {
//     if (focusOnBtnRef) {
//       focusOnBtnRef.current?.focus();
//     }
//   }, []);

//   const handleCreatingNewCharacteristic = () => {
//     const characteristicId = generateMongoObjectId();
//     createNewCharacteristic.mutate({ characteristicId });

//     updateConditionBlock.mutate({
//       name: conditionName,
//       blockValueId: characteristicId,
//     });
//     setShowCreateNewValueModal(false);
//     setHighlightRedOnValueOnExisting(false);
//   };

//   useOutOfModal({
//     modalRef: createNewCharacteristicModalRef,
//     setShowModal: setShowCreateNewValueModal,
//     showModal: showCreateNewValueModal,
//   });

//   return (
//     <AsideInformativeOrSuggestion
//       ref={createNewCharacteristicModalRef}
//       className={`${showCreateNewValueModal ? "" : "hidden"}`}
//     >
//       <InformativeOrSuggestionText>
//         Такой Характеристики не существует, хотите создать?
//       </InformativeOrSuggestionText>
//       <InformativeOrSuggestionButton
//         ref={focusOnBtnRef}
//         onClick={handleCreatingNewCharacteristic}
//       >
//         Создать
//       </InformativeOrSuggestionButton>
//     </AsideInformativeOrSuggestion>
//   );
// }
