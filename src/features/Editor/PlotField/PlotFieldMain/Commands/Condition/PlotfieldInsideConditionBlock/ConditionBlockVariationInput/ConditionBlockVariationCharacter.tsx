import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";
import useGetTranslationCharacters from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useCreateCharacterBlank from "../../../hooks/Character/useCreateCharacterBlank";
import ConditionSignField from "./ConditionSignField";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";

type ConditionBlockVariationCharacterTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockVariationCharacter({
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockVariationCharacterTypes) {
  const { storyId } = useParams();
  const [showCharacterPromptModal, setShowCharacterPromptModal] =
    useState(false);
  const {
    getConditionBlockById,
    updateConditionBlockName,
    updateConditionBlockValueId,
  } = useConditionBlocks();
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);
  const [currentConditionName, setCurrentConditionName] = useState(
    getConditionBlockById({ conditionBlockId, plotfieldCommandId })
      ?.conditionName || ""
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
      getConditionBlockById({ conditionBlockId, plotfieldCommandId })
        ?.conditionName || "",
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
      currentConditionName?.trim() !== debouncedConditionName.trim()
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
    <div className="w-full flex gap-[1rem] flex-col">
      <div className="w-full flex gap-[1rem] flex-shrink flex-wrap">
        <div className="w-full min-w-[10rem] relative">
          <PlotfieldInput
            type="text"
            placeholder="Персонаж"
            onClick={(e) => {
              setShowCharacterPromptModal((prev) => !prev);
              e.stopPropagation();
            }}
            value={
              getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                ?.conditionName || ""
            }
            onChange={(e) => {
              if (!showCharacterPromptModal) {
                setShowCharacterPromptModal(true);
              }
              setHighlightRedOnValueOnExisting(false);
              setCurrentConditionName(e.target.value);
              updateConditionBlockName({
                conditionBlockId:
                  getConditionBlockById({
                    conditionBlockId,
                    plotfieldCommandId,
                  })?.conditionBlockId || "",
                conditionName: e.target.value,
                plotfieldCommandId,
              });
            }}
            className={`${
              highlightRedOnValueNonExisting
                ? " border-red-300 border-[2px]"
                : ""
            }`}
          />
          <AsideScrollable
            ref={modalRef}
            className={` ${
              showCharacterPromptModal ? "" : "hidden"
            } translate-y-[1rem]`}
          >
            {(memoizedCharacters || [])?.map((mk, i) => (
              <AsideScrollableButton
                key={mk + "-" + i}
                onClick={() => {
                  setShowCharacterPromptModal(false);
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
          <CreateNewCharacterModal
            setShowCreateNewValueModal={setShowCreateNewValueModal}
            showCreateNewValueModal={showCreateNewValueModal}
            conditionName={currentConditionName}
            conditionBlockId={conditionBlockId}
            setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
          />
        </div>

        <ConditionSignField
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />

        <ConditionValueField
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
          setShowCharacterPromptModal={setShowCharacterPromptModal}
          showCharacterPromptModal={showCharacterPromptModal}
        />
      </div>
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
    <AsideInformativeOrSuggestion
      ref={createNewCharacterModalRef}
      className={`${showCreateNewValueModal ? "" : "hidden"} `}
    >
      <InformativeOrSuggestionText>
        Такого персонажа не существует, хотите создать?
      </InformativeOrSuggestionText>
      <InformativeOrSuggestionButton
        ref={focusOnBtnRef}
        onClick={handleCreatingNewCharacter}
      >
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}

type ConditionValueFieldTypes = {
  plotfieldCommandId: string;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterPromptModal: boolean;
  conditionBlockId: string;
};

function ConditionValueField({
  plotfieldCommandId,
  showCharacterPromptModal,
  conditionBlockId,
  setShowCharacterPromptModal,
}: ConditionValueFieldTypes) {
  const { getConditionBlockById, updateConditionBlockValue } =
    useConditionBlocks();

  const [currentConditionValue, setCurrentConditionValue] = useState(
    getConditionBlockById({ conditionBlockId, plotfieldCommandId })
      ?.conditionValue || ""
  );
  const debouncedConditionValue = useDebounce({
    delay: 700,
    value:
      getConditionBlockById({ conditionBlockId, plotfieldCommandId })
        ?.conditionValue || "",
  });

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (
      debouncedConditionValue?.trim().length &&
      currentConditionValue?.trim() !== debouncedConditionValue.trim()
    ) {
      updateConditionBlock.mutate({ value: currentConditionValue });
    }
  }, [debouncedConditionValue]);

  return (
    <div className="min-w-[10rem] w-full">
      <PlotfieldInput
        type="text"
        placeholder="Значение"
        value={
          getConditionBlockById({ conditionBlockId, plotfieldCommandId })
            ?.conditionValue || ""
        }
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentConditionValue(e.target.value);
          updateConditionBlockValue({
            conditionBlockId:
              getConditionBlockById({ conditionBlockId, plotfieldCommandId })
                ?.conditionBlockId || "",
            conditionValue: e.target.value,
            plotfieldCommandId,
          });
        }}
        className={`text-[1.5rem]`}
      />
    </div>
  );
}
