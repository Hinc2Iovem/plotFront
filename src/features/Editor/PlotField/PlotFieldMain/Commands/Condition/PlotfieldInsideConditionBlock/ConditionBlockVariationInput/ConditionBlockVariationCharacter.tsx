import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";
import useGetTranslationCharacters from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useCreateCharacterBlank from "../../../hooks/Character/useCreateCharacterBlank";

type ConditionBlockVariationCharacterTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  conditionName: string;
  conditionValue: string;
};

export default function ConditionBlockVariationCharacter({
  plotfieldCommandId,
  conditionBlockId,
  conditionName,
  conditionValue,
}: ConditionBlockVariationCharacterTypes) {
  const { storyId } = useParams();
  const [showCharacterPromptModal, setShowCharacterPromptModal] =
    useState(false);
  const {
    getCurrentlyOpenConditionBlock,
    updateConditionBlockName,
    updateConditionBlockValueId,
  } = useConditionBlocks();
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);
  const theme = localStorage.getItem("theme");
  const [currentConditionName, setCurrentConditionName] = useState(
    getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionName || ""
  );

  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const { data: characters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedCharacters = useMemo(() => {
    const allCharacters = characters
      ?.flatMap((k) =>
        k.translations
          ?.filter((kt) => kt.textFieldName === "characterName")
          ?.map((kt) => kt.text?.toLowerCase())
      )
      ?.filter(Boolean);
    if (currentConditionName) {
      return allCharacters?.filter((k) =>
        k?.includes(currentConditionName.toLowerCase())
      );
    }
    return allCharacters;
  }, [currentConditionName, characters]);

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  const debouncedConditionName = useDebounce({
    delay: 700,
    value:
      getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionName ||
      "",
  });

  const handleUpdatingConditionContextValue = ({
    characterId,
  }: {
    characterId: string;
  }) => {
    updateConditionBlockValueId({
      blockValueId: characterId,
      conditionBlockId,
      conditionType: "character",
      plotfieldCommandId,
    });
  };

  const handleCheckValueCorrectnessBeforeUpdating = ({
    onClick,
  }: {
    onClick: boolean;
  }) => {
    const existingCharacter = characters?.find((mk) =>
      mk.translations?.find(
        (mkt) =>
          mkt.textFieldName === "characterName" &&
          mkt.text?.trim()?.toLowerCase() ===
            currentConditionName?.trim().toLowerCase()
      )
    );

    if (existingCharacter) {
      setShowCharacterPromptModal(false);
      setHighlightRedOnValueOnExisting(false);
      handleUpdatingConditionContextValue({
        characterId: existingCharacter._id,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        blockValueId: existingCharacter._id,
      });
    } else {
      if (onClick) {
        setShowCreateNewValueModal(true);
        console.log("Show Modal to create character");
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
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  return (
    <div className="w-[calc(100%-2.5rem)] flex gap-[1rem] flex-shrink">
      <div className="w-[calc(50%-.5rem)] min-w-[15rem]">
        <input
          type="text"
          placeholder="Персонаж"
          onClick={(e) => {
            e.stopPropagation();
            setShowCharacterPromptModal((prev) => !prev);
          }}
          value={
            getCurrentlyOpenConditionBlock({
              plotfieldCommandId,
            })?.conditionName || ""
          }
          onChange={(e) => {
            if (!showCharacterPromptModal) {
              setShowCharacterPromptModal(true);
            }
            setHighlightRedOnValueOnExisting(false);
            setCurrentConditionName(e.target.value);
            updateConditionBlockName({
              conditionBlockId:
                getCurrentlyOpenConditionBlock({
                  plotfieldCommandId,
                })?.conditionBlockId || "",
              conditionName: e.target.value,
              plotfieldCommandId,
            });
          }}
          className={`${
            highlightRedOnValueNonExisting ? " border-red-300 border-[2px]" : ""
          } text-[1.5rem] ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`}
        />
        <aside
          ref={modalRef}
          className={`${
            showCharacterPromptModal ? "" : "hidden"
          } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full max-h-[20rem] z-[1000] translate-y-[1rem] overflow-y-auto | containerScroll`}
        >
          {(memoizedCharacters || [])?.map((mk, i) => (
            <button
              key={mk + "-" + i}
              onClick={() => {
                setShowCharacterPromptModal(false);
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
              className={`capitalize text-[1.5rem] ${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } text-text-dark hover:text-text-light bg-secondary px-[1rem] py-[.5rem] rounded-md hover:bg-primary  focus-within:bg-primary focus-within:text-text-light transition-all focus-within:border-[2px] focus-within:border-white`}
            >
              {mk}
            </button>
          ))}
        </aside>
        <CreateNewCharacterModal
          setShowCreateNewValueModal={setShowCreateNewValueModal}
          showCreateNewValueModal={showCreateNewValueModal}
          conditionName={currentConditionName}
          conditionBlockId={conditionBlockId}
          setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        />
      </div>

      <ConditionValueField
        plotfieldCommandId={plotfieldCommandId}
        conditionValue={conditionValue}
        conditionBlockId={conditionBlockId}
        setShowCharacterPromptModal={setShowCharacterPromptModal}
        showCharacterPromptModal={showCharacterPromptModal}
      />
    </div>
  );
}

type CreateNewCharacterModalTypes = {
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockId: string;
};

function CreateNewCharacterModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockId,
}: CreateNewCharacterModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewCharacterModalRef = useRef<HTMLDivElement>(null);

  const createNewCharacter = useCreateCharacterBlank({
    characterType: "minorcharacter",
    name: conditionName,
    storyId: storyId || "",
    language: "russian",
  });
  const theme = localStorage.getItem("theme");
  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });
  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);

  const handleCreatingNewCharacter = () => {
    const characterId = generateMongoObjectId();
    createNewCharacter.mutate({ characterId });

    updateConditionBlock.mutate({
      name: conditionName,
      blockValueId: characterId,
    });
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
  };

  useOutOfModal({
    modalRef: createNewCharacterModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <aside
      ref={createNewCharacterModalRef}
      className={`${
        showCreateNewValueModal ? "" : "hidden"
      } absolute rounded-md shadow-sm p-[1rem] bg-secondary flex flex-col gap-[.5rem] w-full`}
    >
      <p className="text-[1.5rem] text-text-light">
        Такого персонажа не существует, хотите создать?
      </p>
      <button
        ref={focusOnBtnRef}
        onClick={handleCreatingNewCharacter}
        className={`self-end text-[1.6rem] w-fit rounded-md bg-secondary shadow-sm ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light focus-within:border-black focus-within:border-[2px] focus-within:text-black`}
      >
        Создать
      </button>
    </aside>
  );
}

type ConditionValueFieldTypes = {
  plotfieldCommandId: string;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterPromptModal: boolean;
  conditionValue: string;
  conditionBlockId: string;
};

function ConditionValueField({
  plotfieldCommandId,
  showCharacterPromptModal,
  conditionValue,
  conditionBlockId,
  setShowCharacterPromptModal,
}: ConditionValueFieldTypes) {
  const { getCurrentlyOpenConditionBlock, updateConditionBlockValue } =
    useConditionBlocks();

  const [currentConditionValue, setCurrentConditionValue] = useState(
    getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionValue || ""
  );
  const theme = localStorage.getItem("theme");
  const debouncedConditionValue = useDebounce({
    delay: 700,
    value:
      getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionValue ||
      "",
  });

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (
      debouncedConditionValue?.trim().length &&
      conditionValue?.trim() !== debouncedConditionValue.trim()
    ) {
      updateConditionBlock.mutate({ value: currentConditionValue });
    }
  }, [debouncedConditionValue]);

  return (
    <div className="w-[calc(50%-.5rem)] min-w-[15rem]">
      <input
        type="text"
        placeholder="Значение"
        value={
          getCurrentlyOpenConditionBlock({
            plotfieldCommandId,
          })?.conditionValue || ""
        }
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentConditionValue(e.target.value);
          updateConditionBlockValue({
            conditionBlockId:
              getCurrentlyOpenConditionBlock({
                plotfieldCommandId,
              })?.conditionBlockId || "",
            conditionValue: e.target.value,
            plotfieldCommandId,
          });
        }}
        className={`text-[1.5rem] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem]`}
      />
    </div>
  );
}
