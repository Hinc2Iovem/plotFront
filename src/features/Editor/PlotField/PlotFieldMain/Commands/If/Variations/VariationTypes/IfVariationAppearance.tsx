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
import IfFieldName from "./shared/IfFieldName";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import useSearch from "../../../../Search/SearchContext";
import useUpdateIfAppearance from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfAppearance";
import useIfVariations from "../../Context/IfContext";

type IfVariationAppearanceTypes = {
  plotfieldCommandId: string;
  currentAppearancePartId: string;
  ifVariationId: string;
  topologyBlockId: string;
  currentlyDressed: boolean;
};

export default function IfVariationAppearance({
  plotfieldCommandId,
  currentAppearancePartId,
  ifVariationId,
  currentlyDressed,
  topologyBlockId,
}: IfVariationAppearanceTypes) {
  const { episodeId } = useParams();
  const [showAppearancePartPromptModal, setShowAppearancePartPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueNonExisting] = useState(false);
  const [appearancePartId, setAppearancePartId] = useState(currentAppearancePartId || "");
  const [debouncedAppearancePartValue, setDebouncedAppearancePartValue] =
    useState<DebouncedCheckAppearancePartTypes | null>(null);
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const { updateIfVariationValue } = useIfVariations();

  const [currentIfName, setCurrentIfName] = useState("");
  const [isDressed, setIsDressed] = useState(currentlyDressed);
  const [currentlyActive, setCurrentlyActive] = useState(false);

  const { data: appearancePart } = useGetTranslationAppearancePart({ appearancePartId, language: "russian" });

  const updateIf = useUpdateIfAppearance({
    ifAppearanceId: ifVariationId,
  });

  useEffect(() => {
    if (appearancePart) {
      setCurrentIfName((appearancePart.translations || [])[0]?.text);
    }
  }, [appearancePart, appearancePartId]);

  useEffect(() => {
    if (appearancePartId && currentIfName) {
      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        appearancePartId,
      });

      updateIf.mutate({
        appearancePartId,
      });
    }
  }, [appearancePartId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentIfName,
  });

  useEffect(() => {
    if (debouncedAppearancePartValue && !showAppearancePartPromptModal) {
      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        appearancePartId,
      });

      setCurrentIfName(debouncedAppearancePartValue.partName);
      setAppearancePartId(debouncedAppearancePartValue.partId);

      updateIf.mutate({
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
          commandName: "If - Apperance",
          id: ifVariationId,
          text: debouncedAppearancePartValue?.partName || "",
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
        commandName: "If - Apperance",
        id: ifVariationId,
        value: debouncedAppearancePartValue?.partName || "",
        type: "ifVariation",
      });
    }
  }, [debouncedAppearancePartValue, episodeId]);

  return (
    <div className="relative w-full flex gap-[.5rem]">
      <div className="flex-grow relative">
        <PlotfieldInput
          type="text"
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
            setCurrentlyActive(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          placeholder="Часть внешности"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentlyActive(true);
            setShowAppearancePartPromptModal((prev) => !prev);
          }}
          value={currentIfName}
          onChange={(e) => {
            if (!showAppearancePartPromptModal) {
              setShowAppearancePartPromptModal(true);
            }
            setCurrentlyActive(true);
            setHighlightRedOnValueNonExisting(false);
            setCurrentIfName(e.target.value);
          }}
          className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
        />

        <AppearancePartPromptsModal
          currentAppearancePartName={currentIfName}
          setCurrentAppearancePartName={setCurrentIfName}
          setShowAppearancePartPromptModal={setShowAppearancePartPromptModal}
          showAppearancePartPromptModal={showAppearancePartPromptModal}
          debouncedAppearancePart={debouncedValue}
          setDebouncedAppearancePartValue={setDebouncedAppearancePartValue}
          setAppearancePartId={setAppearancePartId}
        />

        <CreateNewValueModal
          ifName={currentIfName}
          ifAppearanceId={ifVariationId}
          setHighlightRedOnValueNonExisting={setHighlightRedOnValueNonExisting}
          setShowCreateNewValueModal={setShowCreateNewValueModal}
          showCreateNewValueModal={showCreateNewValueModal}
        />
        <IfFieldName currentlyActive={currentlyActive} text="Одежда" />
      </div>

      <PlotfieldButton
        disabled={updateIf.isPending}
        onClick={() => {
          updateIf.mutate({ currentlyDressed: !isDressed });
          setIsDressed((prev) => !prev);
          updateIfVariationValue({
            ifVariationId,
            plotfieldCommandId,
            currentlyDressed,
          });
        }}
        className={`${
          isDressed ? "bg-green-600 hover:bg-green-500" : "bg-secondary hover:bg-primary"
        } disabled:cursor-not-allowed transition-colors w-fit`}
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
  ifName: string;
  ifAppearanceId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueNonExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateNewValueModal({
  setHighlightRedOnValueNonExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  ifName,
  ifAppearanceId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewAppearanceModalRef = useRef<HTMLDivElement>(null);
  const updateIf = useUpdateIfAppearance({
    ifAppearanceId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);

  const createNewAppearance = useCreateAppearancePartOptimistic({
    storyId: storyId || "",
    appearancePartName: ifName,
  });

  const handleCreatingNewAppearance = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueNonExisting(false);
    const appearanceId = generateMongoObjectId();
    createNewAppearance.mutate({ appearancePartId: appearanceId, currentLanguage: "russian" });
    updateIf.mutate({
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
