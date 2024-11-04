import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import useUpdateConditionValue from "../../../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";
import ConditionSignField from "./ConditionSignField";

type ConditionBlockVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockVariationCharacteristic({
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockVariationCharacteristicTypes) {
  const [
    showFirstCharacteristicPromptModal,
    setShowFirstCharacteristicPromptModal,
  ] = useState(false);
  const [
    showSecondCharacteristicPromptModal,
    setShowSecondCharacteristicPromptModal,
  ] = useState(false);

  useEffect(() => {
    if (showFirstCharacteristicPromptModal) {
      setShowSecondCharacteristicPromptModal(false);
    } else if (showSecondCharacteristicPromptModal) {
      setShowFirstCharacteristicPromptModal(false);
    }
  }, [showFirstCharacteristicPromptModal, showSecondCharacteristicPromptModal]);

  return (
    <div className="flex flex-col gap-[1rem] mt-[1.5rem]">
      <div className="w-full flex gap-[1rem] flex-shrink flex-wrap">
        <CharacteristicInputField
          key={"characteristic-1"}
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacteristicPromptModal={
            setShowFirstCharacteristicPromptModal
          }
          showCharacteristicPromptModal={showFirstCharacteristicPromptModal}
          fieldType="conditionName"
        />
        <ConditionSignField
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />
        <CharacteristicInputField
          key={"characteristic-2"}
          conditionBlockId={conditionBlockId}
          setShowCharacteristicPromptModal={
            setShowSecondCharacteristicPromptModal
          }
          showCharacteristicPromptModal={showSecondCharacteristicPromptModal}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="conditionValue"
        />
      </div>
    </div>
  );
}

type CharacteristicInputFieldTypes = {
  setShowCharacteristicPromptModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showCharacteristicPromptModal: boolean;
  plotfieldCommandId: string;
  conditionBlockId: string;
  fieldType: "conditionName" | "conditionValue";
};

function CharacteristicInputField({
  setShowCharacteristicPromptModal,
  showCharacteristicPromptModal,
  plotfieldCommandId,
  conditionBlockId,
  fieldType,
}: CharacteristicInputFieldTypes) {
  const {
    getConditionBlockById,
    updateConditionBlockName,
    updateConditionBlockValueId,
    updateConditionBlockValue,
    conditions,
  } = useConditionBlocks();

  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);

  const [currentConditionName, setCurrentConditionName] = useState(
    fieldType === "conditionName"
      ? getConditionBlockById({ conditionBlockId, plotfieldCommandId })
          ?.conditionName || ""
      : getConditionBlockById({ conditionBlockId, plotfieldCommandId })
          ?.conditionValue || ""
  );

  const [characteristicId, setCharacteristicId] = useState("");
  const [debouncedCharacteristic, setDebouncedCharacteristic] =
    useState<DebouncedCheckCharacteristicTypes | null>(null);
  useEffect(() => {
    const conditionBlock = getConditionBlockById({
      conditionBlockId,
      plotfieldCommandId,
    });
    if (fieldType === "conditionName") {
      if (conditionBlock?.conditionName !== currentConditionName) {
        setCurrentConditionName(conditionBlock?.conditionName || "");
      }
    } else {
      if (conditionBlock?.conditionValue !== currentConditionName) {
        setCurrentConditionName(conditionBlock?.conditionValue || "");
      }
    }
  }, [conditions, conditionBlockId, plotfieldCommandId]);

  // const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  const debouncedConditionName = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  useEffect(() => {
    if (characteristicId && currentConditionName) {
      updateConditionBlockName({
        conditionBlockId:
          getConditionBlockById({
            conditionBlockId,
            plotfieldCommandId,
          })?.conditionBlockId || "",
        conditionName: currentConditionName,
        plotfieldCommandId,
      });

      updateConditionBlockValueId({
        blockValueId: characteristicId,
        conditionBlockId,
        conditionType: "characteristic",
        plotfieldCommandId,
      });

      if (fieldType === "conditionName") {
        updateConditionBlock.mutate({
          name: currentConditionName,
          blockValueId: characteristicId,
        });
      } else {
        updateConditionBlock.mutate({
          value: currentConditionName,
          blockValueId: characteristicId,
        });
      }
    }
  }, [characteristicId, currentConditionName]);

  useEffect(() => {
    if (debouncedCharacteristic && !showCharacteristicPromptModal) {
      updateConditionBlockName({
        conditionBlockId:
          getConditionBlockById({
            conditionBlockId,
            plotfieldCommandId,
          })?.conditionBlockId || "",
        conditionName: debouncedCharacteristic.characteristicName || "",
        plotfieldCommandId,
      });

      setCharacteristicId(debouncedCharacteristic.characteristicId);
      setCurrentConditionName(debouncedCharacteristic.characteristicName);

      updateConditionBlockValueId({
        blockValueId: debouncedCharacteristic.characteristicId,
        conditionBlockId,
        conditionType: "characteristic",
        plotfieldCommandId,
      });

      if (fieldType === "conditionName") {
        updateConditionBlock.mutate({
          name: debouncedCharacteristic.characteristicName,
          blockValueId: debouncedCharacteristic.characteristicId,
        });
      } else {
        updateConditionBlock.mutate({
          value: debouncedCharacteristic.characteristicName,
          blockValueId: debouncedCharacteristic.characteristicId,
        });
      }
    }
  }, [debouncedCharacteristic, showCharacteristicPromptModal]);

  return (
    <div className="w-full min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        placeholder="Характеристика"
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
        }}
        value={currentConditionName}
        onChange={(e) => {
          if (!showCharacteristicPromptModal) {
            setShowCharacteristicPromptModal(true);
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
          if (fieldType === "conditionName") {
            updateConditionBlockName({
              conditionBlockId:
                getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                  ?.conditionBlockId || "",
              conditionName: e.target.value,
              plotfieldCommandId,
            });
          } else {
            updateConditionBlockValue({
              conditionBlockId:
                getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                  ?.conditionBlockId || "",
              conditionValue: e.target.value,
              plotfieldCommandId,
            });
          }
        }}
        className={`${highlightRedOnValueNonExisting ? " " : ""}`}
      />

      <CharacteristicsPromptModal
        currentCharacteristic={currentConditionName}
        setCharacteristicId={setCharacteristicId}
        setCurrentCharacteristic={setCurrentConditionName}
        setShowCharacteristicPromptModal={setShowCharacteristicPromptModal}
        showCharacteristicPromptModal={showCharacteristicPromptModal}
        setDebouncedCharacteristic={setDebouncedCharacteristic}
        debouncedCharacteristic={debouncedConditionName}
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
  setShowCharacteristicPromptModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCurrentCharacteristic: React.Dispatch<React.SetStateAction<string>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedCharacteristic: React.Dispatch<
    React.SetStateAction<DebouncedCheckCharacteristicTypes | null>
  >;
  showCharacteristicPromptModal: boolean;
  currentCharacteristic: string;
  debouncedCharacteristic: string;
};

export function CharacteristicsPromptModal({
  setCurrentCharacteristic,
  setCharacteristicId,
  currentCharacteristic,
  setShowCharacteristicPromptModal,
  showCharacteristicPromptModal,
  setDebouncedCharacteristic,
  debouncedCharacteristic,
}: CharacteristicsPromptModalTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedCharacteristics = useMemo(() => {
    if (!characteristics) return [];
    if (currentCharacteristic?.trim().length) {
      return characteristics.filter((c) =>
        c.translations.filter(
          (ct) =>
            ct.textFieldName === "characterCharacteristic" &&
            ct.text
              ?.toLowerCase()
              .includes(currentCharacteristic?.toLowerCase())
        )
      );
    } else {
      return characteristics;
    }
  }, [currentCharacteristic, characteristics]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacteristicPromptModal,
    showModal: showCharacteristicPromptModal,
  });

  useEffect(() => {
    if (debouncedCharacteristic?.trim().length) {
      const existingCharacteristic = memoizedCharacteristics.find((mc) =>
        mc.translations.find(
          (mct) =>
            mct.text?.toLowerCase() === currentCharacteristic?.toLowerCase()
        )
      );

      if (existingCharacteristic) {
        setDebouncedCharacteristic({
          characteristicId: existingCharacteristic.characteristicId,
          characteristicName:
            (existingCharacteristic.translations || [])[0]?.text || "",
        });
      } else {
        console.log("Such characteristic doesn't exist");
        return;
      }
    }
  }, [debouncedCharacteristic]);
  return (
    <AsideScrollable
      ref={modalRef}
      className={`${
        showCharacteristicPromptModal ? "" : "hidden"
      } translate-y-[.5rem]`}
    >
      {(memoizedCharacteristics || [])?.map((mk) => (
        <AsideScrollableButton
          key={mk.characteristicId}
          onClick={() => {
            setShowCharacteristicPromptModal(false);
            setCurrentCharacteristic(mk.translations[0]?.text);
            setCharacteristicId(mk.characteristicId);
          }}
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
