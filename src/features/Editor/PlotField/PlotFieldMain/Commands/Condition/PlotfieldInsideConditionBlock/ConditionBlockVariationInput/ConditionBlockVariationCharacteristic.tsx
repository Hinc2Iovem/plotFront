import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useCreateCharacteristicOptimistic from "../../../../../../../../hooks/Posting/Characteristic/useCreateCharacteristicOptimistic";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";
import ConditionSignField from "./ConditionSignField";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";

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
    <div className="flex flex-col gap-[1rem]">
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
  const { storyId } = useParams();
  const {
    getConditionBlockById,
    updateConditionBlockName,
    updateConditionBlockValueId,
    updateConditionBlockValue,
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

  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const { data: characteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedCharacteristics = useMemo(() => {
    const allCharacteristics = characteristics
      ?.flatMap((k) =>
        k.translations
          ?.filter((kt) => kt.textFieldName === "characterCharacteristic")
          ?.map((kt) => kt.text?.toLowerCase())
      )
      ?.filter(Boolean);
    if (currentConditionName) {
      return allCharacteristics?.filter((k) =>
        k?.includes(currentConditionName.toLowerCase())
      );
    }
    return allCharacteristics;
  }, [currentConditionName, characteristics]);

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  const debouncedConditionName = useDebounce({
    delay: 700,
    value:
      fieldType === "conditionName"
        ? getConditionBlockById({ conditionBlockId, plotfieldCommandId })
            ?.conditionName || ""
        : getConditionBlockById({ conditionBlockId, plotfieldCommandId })
            ?.conditionValue || "",
  });

  const handleUpdatingConditionContextValue = ({
    characteristicId,
  }: {
    characteristicId: string;
  }) => {
    updateConditionBlockValueId({
      blockValueId: characteristicId,
      conditionBlockId,
      conditionType: "characteristic",
      plotfieldCommandId,
    });
  };

  const handleCheckValueCorrectnessBeforeUpdating = ({
    onClick,
  }: {
    onClick: boolean;
  }) => {
    const existingCharacteristic = characteristics?.find((mk) =>
      mk.translations?.find(
        (mkt) =>
          mkt.textFieldName === "characterCharacteristic" &&
          mkt.text?.trim()?.toLowerCase() ===
            currentConditionName?.trim().toLowerCase()
      )
    );

    if (existingCharacteristic) {
      setShowCharacteristicPromptModal(false);
      setHighlightRedOnValueOnExisting(false);
      handleUpdatingConditionContextValue({
        characteristicId: existingCharacteristic._id,
      });
      if (fieldType === "conditionName") {
        updateConditionBlock.mutate({
          name: currentConditionName,
          blockValueId: existingCharacteristic._id,
        });
      } else {
        updateConditionBlock.mutate({
          value: currentConditionName,
          blockValueId: existingCharacteristic._id,
        });
      }
    } else {
      if (onClick) {
        setShowCreateNewValueModal(true);
        console.log("Show Modal to create characteristic");
        return;
      } else {
        setHighlightRedOnValueOnExisting(true);
        console.log("Value doesn't exist");
        return;
      }
    }
  };

  useEffect(() => {
    if (
      debouncedConditionName?.trim().length &&
      currentConditionName?.trim() !== debouncedConditionName.trim()
    ) {
      handleCheckValueCorrectnessBeforeUpdating({ onClick: false });
    }
  }, [debouncedConditionName]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacteristicPromptModal,
    showModal: showCharacteristicPromptModal,
  });
  return (
    <div className="w-full min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        placeholder="Характеристика"
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
        }}
        value={
          fieldType === "conditionName"
            ? getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                ?.conditionName || ""
            : getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                ?.conditionValue || ""
        }
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
        className={`${
          highlightRedOnValueNonExisting ? " border-red-300 border-[2px]" : ""
        }`}
      />
      <AsideScrollable
        ref={modalRef}
        className={`${
          showCharacteristicPromptModal ? "" : "hidden"
        } translate-y-[.5rem]`}
      >
        {(memoizedCharacteristics || [])?.map((mk, i) => (
          <AsideScrollableButton
            key={mk + "-" + i}
            onClick={() => {
              setShowCharacteristicPromptModal(false);
              setCurrentConditionName(mk || "");
              updateConditionBlockName({
                conditionBlockId:
                  getConditionBlockById({
                    conditionBlockId,
                    plotfieldCommandId,
                  })?.conditionBlockId || "",
                conditionName: mk || "",
                plotfieldCommandId,
              });
            }}
          >
            {mk}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
      <CreateNewCharacteristicModal
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
        conditionName={currentConditionName}
        conditionBlockId={conditionBlockId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
      />
    </div>
  );
}

type CreateNewCharacteristicModalTypes = {
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockId: string;
};

function CreateNewCharacteristicModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockId,
}: CreateNewCharacteristicModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewCharacteristicModalRef = useRef<HTMLDivElement>(null);

  const createNewCharacteristic = useCreateCharacteristicOptimistic({
    characteristicName: conditionName,
    storyId: storyId || "",
    language: "russian",
  });

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });
  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);

  const handleCreatingNewCharacteristic = () => {
    const characteristicId = generateMongoObjectId();
    createNewCharacteristic.mutate({ characteristicId });

    updateConditionBlock.mutate({
      name: conditionName,
      blockValueId: characteristicId,
    });
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
  };

  useOutOfModal({
    modalRef: createNewCharacteristicModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <AsideInformativeOrSuggestion
      ref={createNewCharacteristicModalRef}
      className={`${showCreateNewValueModal ? "" : "hidden"}`}
    >
      <InformativeOrSuggestionText>
        Такой Характеристики не существует, хотите создать?
      </InformativeOrSuggestionText>
      <InformativeOrSuggestionButton
        ref={focusOnBtnRef}
        onClick={handleCreatingNewCharacteristic}
      >
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
