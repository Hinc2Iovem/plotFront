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
  const [showAppearancePartPromptModal, setShowAppearancePartPromptModal] =
    useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueNonExisting] =
    useState(false);
  const [appearancePartId, setAppearancePartId] = useState("");
  const [debouncedAppearancePartValue, setDebouncedAppearancePartValue] =
    useState<DebouncedCheckAppearancePartTypes | null>(null);

  const {
    getConditionBlockById,
    updateConditionBlockName,
    updateConditionBlockValueId,
    conditions,
  } = useConditionBlocks();

  const [currentConditionName, setCurrentConditionName] = useState(
    getConditionBlockById({ plotfieldCommandId, conditionBlockId })
      ?.conditionName || ""
  );

  useEffect(() => {
    const conditionBlock = getConditionBlockById({
      conditionBlockId,
      plotfieldCommandId,
    });
    if (conditionBlock?.conditionName !== currentConditionName) {
      setCurrentConditionName(conditionBlock?.conditionName || "");
    }
  }, [conditions, conditionBlockId, plotfieldCommandId]);

  useEffect(() => {
    if (appearancePartId && currentConditionName) {
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
        blockValueId: appearancePartId,
        conditionBlockId,
        conditionType: "appearance",
        plotfieldCommandId,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        type: "appearance",
        blockValueId: appearancePartId,
      });
    }
  }, [appearancePartId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (debouncedAppearancePartValue && !showAppearancePartPromptModal) {
      updateConditionBlockName({
        conditionBlockId:
          getConditionBlockById({
            conditionBlockId,
            plotfieldCommandId,
          })?.conditionBlockId || "",
        conditionName: debouncedAppearancePartValue.partName,
        plotfieldCommandId,
      });

      updateConditionBlockValueId({
        blockValueId: debouncedAppearancePartValue.partId,
        conditionBlockId,
        conditionType: "appearance",
        plotfieldCommandId,
      });

      setCurrentConditionName(debouncedAppearancePartValue.partName);
      setAppearancePartId(debouncedAppearancePartValue.partId);

      updateConditionBlock.mutate({
        name: debouncedAppearancePartValue.partName,
        type: "appearance",
        blockValueId: debouncedAppearancePartValue.partId,
      });
    }
  }, [debouncedAppearancePartValue]);

  return (
    <div className="relative mt-[1.5rem]">
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
        conditionBlockId={conditionBlockId}
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
  setShowAppearancePartPromptModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  currentAppearancePartName: string;
  debouncedAppearancePart: string;
  setDebouncedAppearancePartValue: React.Dispatch<
    React.SetStateAction<DebouncedCheckAppearancePartTypes | null>
  >;
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
        p?.translations?.filter((pt) =>
          pt.text
            ?.toLowerCase()
            .includes(currentAppearancePartName?.toLowerCase())
        )
      );
    }
    return appearanceParts;
  }, [currentAppearancePartName, appearanceParts]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedAppearancePart?.trim().length) {
      const existingPart = memoizedAppearanceParts?.find((p) =>
        p?.translations?.find(
          (pt) =>
            pt.text?.toLowerCase() === currentAppearancePartName.toLowerCase()
        )
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
    <AsideScrollable
      ref={modalRef}
      className={`${
        showAppearancePartPromptModal ? "" : "hidden"
      } translate-y-[.5rem]`}
    >
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
  conditionBlockId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueNonExisting: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

function CreateNewValueModal({
  setHighlightRedOnValueNonExisting,
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
    setHighlightRedOnValueNonExisting(false);
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
        Такой одежды не существует, хотите создать?
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
