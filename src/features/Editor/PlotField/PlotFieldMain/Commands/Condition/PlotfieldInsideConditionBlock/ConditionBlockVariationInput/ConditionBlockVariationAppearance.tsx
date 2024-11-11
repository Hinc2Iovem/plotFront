import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useGetTranslationAppearancePart from "../../../../../../../../hooks/Fetching/Translation/useGetTranslationAppearancePart";
import useCreateAppearancePartOptimistic from "../../../../../../../../hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import useConditionBlocks from "../../Context/ConditionContext";
import useUpdateConditionAppearance from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionAppearance";

type ConditionBlockVariationAppearanceTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  currentAppearancePartId: string;
  conditionBlockVariationId: string;
};

export default function ConditionBlockVariationAppearance({
  plotfieldCommandId,
  conditionBlockId,
  currentAppearancePartId,
  conditionBlockVariationId,
}: ConditionBlockVariationAppearanceTypes) {
  const [showAppearancePartPromptModal, setShowAppearancePartPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueNonExisting] = useState(false);
  const [appearancePartId, setAppearancePartId] = useState(currentAppearancePartId || "");
  const [debouncedAppearancePartValue, setDebouncedAppearancePartValue] =
    useState<DebouncedCheckAppearancePartTypes | null>(null);

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const [currentConditionName, setCurrentConditionName] = useState("");

  const { data: appearancePart } = useGetTranslationAppearancePart({ appearancePartId, language: "russian" });

  const updateConditionBlock = useUpdateConditionAppearance({
    conditionBlockAppearanceId: conditionBlockVariationId,
  });

  useEffect(() => {
    if (appearancePart) {
      setCurrentConditionName((appearancePart.translations || [])[0]?.text);
    }
  }, [appearancePart, appearancePartId]);

  useEffect(() => {
    if (appearancePartId && currentConditionName) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        appearancePartId,
      });

      updateConditionBlock.mutate({
        appearancePartId,
      });
    }
  }, [appearancePartId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  useEffect(() => {
    if (debouncedAppearancePartValue && !showAppearancePartPromptModal) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        appearancePartId,
      });

      setCurrentConditionName(debouncedAppearancePartValue.partName);
      setAppearancePartId(debouncedAppearancePartValue.partId);

      updateConditionBlock.mutate({
        appearancePartId,
      });
    }
  }, [debouncedAppearancePartValue]);

  return (
    <div className="relative">
      <PlotfieldInput
        type="text"
        placeholder="Часть внешности"
        onClick={(e) => {
          setShowAppearancePartPromptModal((prev) => !prev);
          e.stopPropagation();
        }}
        value={currentConditionName}
        onChange={(e) => {
          if (!showAppearancePartPromptModal) {
            setShowAppearancePartPromptModal(true);
          }
          setHighlightRedOnValueNonExisting(false);
          setCurrentConditionName(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? "" : ""}`}
      />

      <AppearancePartPromptsModal
        currentAppearancePartName={currentConditionName}
        setCurrentAppearancePartName={setCurrentConditionName}
        setShowAppearancePartPromptModal={setShowAppearancePartPromptModal}
        showAppearancePartPromptModal={showAppearancePartPromptModal}
        debouncedAppearancePart={debouncedValue}
        setDebouncedAppearancePartValue={setDebouncedAppearancePartValue}
        setAppearancePartId={setAppearancePartId}
      />

      <CreateNewValueModal
        conditionName={currentConditionName}
        conditionBlockAppearanceId={conditionBlockVariationId}
        setHighlightRedOnValueNonExisting={setHighlightRedOnValueNonExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />
    </div>
  );
}

export type DebouncedCheckAppearancePartTypes = {
  partId: string;
  partName: string;
};

type AppearancePartPromptsModalTypes = {
  showAppearancePartPromptModal: boolean;
  setShowAppearancePartPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  currentAppearancePartName: string;
  debouncedAppearancePart: string;
  setDebouncedAppearancePartValue: React.Dispatch<React.SetStateAction<DebouncedCheckAppearancePartTypes | null>>;
  setAppearancePartId: React.Dispatch<React.SetStateAction<string>>;
};

function AppearancePartPromptsModal({
  showAppearancePartPromptModal,
  setCurrentAppearancePartName,
  currentAppearancePartName,
  setShowAppearancePartPromptModal,
  setDebouncedAppearancePartValue,
  setAppearancePartId,
  debouncedAppearancePart,
}: AppearancePartPromptsModalTypes) {
  const { storyId } = useParams();
  const { data: appearanceParts } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
  });

  const memoizedAppearanceParts = useMemo(() => {
    if (!appearanceParts) return [];

    if (currentAppearancePartName) {
      return appearanceParts?.filter((p) =>
        p?.translations?.filter((pt) => pt.text?.toLowerCase().includes(currentAppearancePartName?.toLowerCase()))
      );
    }
    return appearanceParts;
  }, [currentAppearancePartName, appearanceParts]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedAppearancePart?.trim().length) {
      const existingPart = memoizedAppearanceParts?.find((p) =>
        p?.translations?.find((pt) => pt.text?.toLowerCase() === currentAppearancePartName.toLowerCase())
      );
      if (existingPart) {
        setDebouncedAppearancePartValue({
          partId: existingPart?.appearancePartId,
          partName: (existingPart.translations || [])[0]?.text,
        });
      }
    }
  }, [debouncedAppearancePart]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowAppearancePartPromptModal,
    showModal: showAppearancePartPromptModal,
  });

  return (
    <AsideScrollable ref={modalRef} className={`${showAppearancePartPromptModal ? "" : "hidden"} translate-y-[.5rem]`}>
      {memoizedAppearanceParts?.length ? (
        memoizedAppearanceParts.map((mp) => (
          <AsideScrollableButton
            key={mp._id}
            onClick={() => {
              setShowAppearancePartPromptModal(false);
              setCurrentAppearancePartName((mp.translations || [])[0]?.text);
              setAppearancePartId(mp._id);
            }}
          >
            {(mp.translations || [])[0]?.text}
          </AsideScrollableButton>
        ))
      ) : (
        <AsideScrollableButton
          onClick={() => {
            setShowAppearancePartPromptModal(false);
          }}
        >
          Пусто
        </AsideScrollableButton>
      )}
    </AsideScrollable>
  );
}

type CreateNewValueModalTypes = {
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockAppearanceId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueNonExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateNewValueModal({
  setHighlightRedOnValueNonExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockAppearanceId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewAppearanceModalRef = useRef<HTMLDivElement>(null);
  const updateConditionBlock = useUpdateConditionAppearance({
    conditionBlockAppearanceId,
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
    setHighlightRedOnValueNonExisting(false);
    const appearanceId = generateMongoObjectId();
    createNewAppearance.mutate({ appearancePartId: appearanceId });
    updateConditionBlock.mutate({
      appearancePartId: appearanceId,
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
      <InformativeOrSuggestionText>Такой одежды не существует, хотите создать?</InformativeOrSuggestionText>
      <InformativeOrSuggestionButton ref={focusOnBtnRef} onClick={handleCreatingNewAppearance}>
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
