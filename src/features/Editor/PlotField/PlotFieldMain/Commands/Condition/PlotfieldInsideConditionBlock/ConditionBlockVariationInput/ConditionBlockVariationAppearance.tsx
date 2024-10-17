import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "../../Context/ConditionContext";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useCreateAppearancePartOptimistic from "../../../../../../../../hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";

type ConditionBlockVariationAppearanceTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockVariationAppearance({
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockVariationAppearanceTypes) {
  const { storyId } = useParams();
  const [showAppearancePromptModal, setShowAppearancePromptModal] =
    useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);
  const {
    getConditionBlockById,
    updateConditionBlockName,
    updateConditionBlockValueId,
  } = useConditionBlocks();
  const [currentConditionName, setCurrentConditionName] = useState(
    getConditionBlockById({ plotfieldCommandId, conditionBlockId })
      ?.conditionName || ""
  );

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: appearances } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const memoizedAppearances = useMemo(() => {
    const allAppearances =
      appearances?.flatMap((k) =>
        k.translations.map((kt) => kt.text?.toLowerCase())
      ) || [];

    if (currentConditionName) {
      return allAppearances.filter((k) =>
        k?.includes(currentConditionName.toLowerCase())
      );
    }

    return allAppearances;
  }, [currentConditionName, appearances]);

  const debouncedValue = useDebounce({
    delay: 700,
    value:
      getConditionBlockById({ plotfieldCommandId, conditionBlockId })
        ?.conditionName || "",
  });

  const handleUpdatingConditionContextValue = ({
    appearanceId,
  }: {
    appearanceId: string;
  }) => {
    updateConditionBlockValueId({
      blockValueId: appearanceId,
      conditionBlockId,
      conditionType: "appearance",
      plotfieldCommandId,
    });
  };

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  const handleCheckValueCorrectnessBeforeUpdating = ({
    onClick,
  }: {
    onClick: boolean;
  }) => {
    const existingAppearance = appearances?.find((mk) =>
      mk.translations.find(
        (mkt) =>
          mkt.text?.trim()?.toLowerCase() ===
          currentConditionName?.trim().toLowerCase()
      )
    );

    if (existingAppearance) {
      setShowAppearancePromptModal(false);
      setHighlightRedOnValueOnExisting(false);
      handleUpdatingConditionContextValue({
        appearanceId: existingAppearance._id,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        blockValueId: existingAppearance._id,
      });
    } else {
      if (onClick) {
        setShowCreateNewValueModal(true);
        console.log("Show Modal to create appearance");
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
      debouncedValue?.trim().length &&
      currentConditionName?.trim() !== debouncedValue.trim()
    ) {
      handleCheckValueCorrectnessBeforeUpdating({ onClick: false });
    }
  }, [debouncedValue]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowAppearancePromptModal,
    showModal: showAppearancePromptModal,
  });

  return (
    <div className="w-full relative">
      <PlotfieldInput
        type="text"
        placeholder="Одежда"
        onClick={(e) => {
          e.stopPropagation();
          setShowAppearancePromptModal((prev) => !prev);
        }}
        value={
          getConditionBlockById({
            plotfieldCommandId,
            conditionBlockId,
          })?.conditionName || ""
        }
        onChange={(e) => {
          if (!showAppearancePromptModal) {
            setShowAppearancePromptModal(true);
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
          updateConditionBlockName({
            conditionBlockId:
              getConditionBlockById({
                plotfieldCommandId,
                conditionBlockId,
              })?.conditionBlockId || "",
            conditionName: e.target.value,
            plotfieldCommandId,
          });
        }}
        className={`${
          highlightRedOnValueNonExisting ? "border-red-300 border-[2px]" : ""
        }`}
      />
      <AsideScrollable
        ref={modalRef}
        className={`${
          showAppearancePromptModal ? "" : "hidden"
        } translate-y-[.5rem]`}
      >
        {memoizedAppearances.map((mk, i) => (
          <AsideScrollableButton
            key={mk + "-" + i}
            onClick={() => {
              setShowAppearancePromptModal(false);
              setCurrentConditionName(mk);
              handleCheckValueCorrectnessBeforeUpdating({ onClick: true });
              updateConditionBlockName({
                conditionBlockId:
                  getConditionBlockById({
                    plotfieldCommandId,
                    conditionBlockId,
                  })?.conditionBlockId || "",
                conditionName: mk,
                plotfieldCommandId,
              });
            }}
          >
            {mk}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>

      <CreateNewValueModal
        conditionName={currentConditionName}
        conditionBlockId={conditionBlockId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />
    </div>
  );
}

type CreateNewValueModalTypes = {
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

function CreateNewValueModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewAppearanceModalRef = useRef<HTMLDivElement>(null);
  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);

  const createNewAppearance = useCreateAppearancePartOptimistic({
    storyId: storyId || "",
    appearancePartName: conditionName,
  });

  const handleCreatingNewAppearance = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
    const appearanceId = generateMongoObjectId();
    createNewAppearance.mutate({ appearancePartId: appearanceId });
    updateConditionBlock.mutate({
      name: conditionName,
      blockValueId: appearanceId,
    });
  };

  useOutOfModal({
    modalRef: createNewAppearanceModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <AsideInformativeOrSuggestion
      ref={createNewAppearanceModalRef}
      className={`${showCreateNewValueModal ? "" : "hidden"}`}
    >
      <InformativeOrSuggestionText>
        Такого ключа не существует, хотите создать?
      </InformativeOrSuggestionText>
      <InformativeOrSuggestionButton
        ref={focusOnBtnRef}
        onClick={handleCreatingNewAppearance}
      >
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
