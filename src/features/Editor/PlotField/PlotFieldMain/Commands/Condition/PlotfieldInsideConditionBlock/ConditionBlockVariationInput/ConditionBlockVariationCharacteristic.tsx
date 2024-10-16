import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import useCreateCharacteristicOptimistic from "../../../../../../../../hooks/Posting/Characteristic/useCreateCharacteristicOptimistic";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";

type ConditionBlockVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  conditionName: string;
  conditionValue: string;
};

export default function ConditionBlockVariationCharacteristic({
  plotfieldCommandId,
  conditionBlockId,
  conditionName,
  conditionValue,
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
    <div className="w-[calc(100%-2.5rem)] flex gap-[1rem] flex-shrink">
      <CharacteristicInputField
        key={"characteristic-1"}
        conditionBlockId={conditionBlockId}
        plotfieldCommandId={plotfieldCommandId}
        conditionName={conditionName}
        setShowCharacteristicPromptModal={setShowFirstCharacteristicPromptModal}
        showCharacteristicPromptModal={showFirstCharacteristicPromptModal}
        fieldType="conditionName"
      />
      <CharacteristicInputField
        key={"characteristic-2"}
        conditionBlockId={conditionBlockId}
        conditionName={conditionValue}
        setShowCharacteristicPromptModal={
          setShowSecondCharacteristicPromptModal
        }
        showCharacteristicPromptModal={showSecondCharacteristicPromptModal}
        plotfieldCommandId={plotfieldCommandId}
        fieldType="conditionValue"
      />
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
  conditionName: string;
  fieldType: "conditionName" | "conditionValue";
};

function CharacteristicInputField({
  setShowCharacteristicPromptModal,
  showCharacteristicPromptModal,
  plotfieldCommandId,
  conditionBlockId,
  conditionName,
  fieldType,
}: CharacteristicInputFieldTypes) {
  const { storyId } = useParams();
  const {
    getCurrentlyOpenConditionBlock,
    updateConditionBlockName,
    updateConditionBlockValueId,
    updateConditionBlockValue,
  } = useConditionBlocks();
  const theme = localStorage.getItem("theme");
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);

  const [currentConditionName, setCurrentConditionName] = useState(
    fieldType === "conditionName"
      ? getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionName ||
          ""
      : getCurrentlyOpenConditionBlock({ plotfieldCommandId })
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
        ? getCurrentlyOpenConditionBlock({ plotfieldCommandId })
            ?.conditionName || ""
        : getCurrentlyOpenConditionBlock({ plotfieldCommandId })
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
      conditionName?.trim() !== debouncedConditionName.trim()
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
    <div className="w-[calc(50%-.5rem)] min-w-[15rem]">
      <input
        type="text"
        placeholder="Характеристика"
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
        }}
        value={
          fieldType === "conditionName"
            ? getCurrentlyOpenConditionBlock({
                plotfieldCommandId,
              })?.conditionName || ""
            : getCurrentlyOpenConditionBlock({ plotfieldCommandId })
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
                getCurrentlyOpenConditionBlock({
                  plotfieldCommandId,
                })?.conditionBlockId || "",
              conditionName: e.target.value,
              plotfieldCommandId,
            });
          } else {
            updateConditionBlockValue({
              conditionBlockId:
                getCurrentlyOpenConditionBlock({
                  plotfieldCommandId,
                })?.conditionBlockId || "",
              conditionValue: e.target.value,
              plotfieldCommandId,
            });
          }
        }}
        className={`${
          highlightRedOnValueNonExisting ? " border-red-300 border-[2px]" : ""
        }  ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-[1.5rem] text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`}
      />
      <aside
        ref={modalRef}
        className={`${
          showCharacteristicPromptModal ? "" : "hidden"
        } absolute rounded-md shadow-sm p-[1rem] z-[2] bg-secondary flex flex-col gap-[.5rem] w-full max-h-[20rem] overflow-y-auto | containerScroll`}
      >
        {(memoizedCharacteristics || [])?.map((mk, i) => (
          <button
            key={mk + "-" + i}
            onClick={() => {
              setShowCharacteristicPromptModal(false);
              setCurrentConditionName(mk || "");
              updateConditionBlockName({
                conditionBlockId:
                  getCurrentlyOpenConditionBlock({
                    plotfieldCommandId,
                  })?.conditionBlockId || "",
                conditionName: mk || "",
                plotfieldCommandId,
              });
            }}
            className="capitalize text-[1.5rem] text-text-dark hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker bg-secondary px-[1rem] py-[.5rem] rounded-md hover:bg-primary transition-all focus-within:border-[2px] focus-within:border-white"
          >
            {mk}
          </button>
        ))}
      </aside>
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
  const theme = localStorage.getItem("theme");
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
    <aside
      ref={createNewCharacteristicModalRef}
      className={`${
        showCreateNewValueModal ? "" : "hidden"
      } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full`}
    >
      <p className="text-[1.5rem] text-text-light">
        Такой Характеристики не существует, хотите создать?
      </p>
      <button
        ref={focusOnBtnRef}
        onClick={handleCreatingNewCharacteristic}
        className={`self-end text-[1.6rem] w-fit rounded-md bg-secondary shadow-sm ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } focus-within:border-black focus-within:border-[2px] focus-within:text-black`}
      >
        Создать
      </button>
    </aside>
  );
}
