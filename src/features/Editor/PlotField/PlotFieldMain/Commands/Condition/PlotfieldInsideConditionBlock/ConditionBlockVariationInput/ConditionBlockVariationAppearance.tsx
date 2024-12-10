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
import ConditionBlockFieldName from "./shared/ConditionBlockFieldName";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import useSearch from "../../../../../../Context/Search/SearchContext";

type ConditionBlockVariationAppearanceTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  currentAppearancePartId: string;
  conditionBlockVariationId: string;
  topologyBlockId: string;
  currentlyDressed: boolean;
};

export default function ConditionBlockVariationAppearance({
  plotfieldCommandId,
  conditionBlockId,
  currentAppearancePartId,
  conditionBlockVariationId,
  currentlyDressed,
  topologyBlockId,
}: ConditionBlockVariationAppearanceTypes) {
  const { episodeId } = useParams();
  const [showAppearancePartPromptModal, setShowAppearancePartPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueNonExisting] = useState(false);
  const [appearancePartId, setAppearancePartId] = useState(currentAppearancePartId || "");
  const [debouncedAppearancePartValue, setDebouncedAppearancePartValue] =
    useState<DebouncedCheckAppearancePartTypes | null>(null);

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const [currentConditionName, setCurrentConditionName] = useState("");
  const [isDressed, setIsDressed] = useState(currentlyDressed);
  const [currentlyActive, setCurrentlyActive] = useState(false);

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

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Condition - Apperance",
          id: conditionBlockVariationId,
          text: debouncedAppearancePartValue?.partName || "",
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
        commandName: "Condition - Apperance",
        id: conditionBlockVariationId,
        value: debouncedAppearancePartValue?.partName || "",
        type: "conditionVariation",
      });
    }
  }, [debouncedAppearancePartValue, episodeId]);

  return (
    <div className="relative w-full flex gap-[.5rem]">
      <div className="flex-grow relative">
        <PlotfieldInput
          type="text"
          onBlur={() => {
            setCurrentlyActive(false);
          }}
          placeholder="Часть внешности"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentlyActive(true);
            setShowAppearancePartPromptModal((prev) => !prev);
          }}
          value={currentConditionName}
          onChange={(e) => {
            if (!showAppearancePartPromptModal) {
              setShowAppearancePartPromptModal(true);
            }
            setCurrentlyActive(true);
            setHighlightRedOnValueNonExisting(false);
            setCurrentConditionName(e.target.value);
          }}
          className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
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
        <ConditionBlockFieldName currentlyActive={currentlyActive} text="Одежда" />
      </div>

      <PlotfieldButton
        disabled={updateConditionBlock.isPending}
        onClick={() => {
          updateConditionBlock.mutate({ currentlyDressed: !isDressed });
          setIsDressed((prev) => !prev);
          updateConditionBlockVariationValue({
            conditionBlockId,
            conditionBlockVariationId,
            plotfieldCommandId,
            currentlyDressed,
          });
        }}
        className={`${
          isDressed ? "bg-green-600 hover:bg-green-500" : "bg-primary-darker hover:bg-primary"
        } disabled:cursor-not-allowed w-fit`}
      >
        {isDressed ? "Надето" : "Надеть"}
      </PlotfieldButton>
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
    createNewAppearance.mutate({ appearancePartId: appearanceId, currentLanguage: "russian" });
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
