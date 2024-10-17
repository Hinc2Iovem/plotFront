import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useCreateNewKeyAsValue from "../../../hooks/Key/useCreateNewKeyAsValue";
import useGetAllKeysByStoryId from "../../../hooks/Key/useGetAllKeysByStoryId";
import useConditionBlocks from "../../Context/ConditionContext";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";

type ConditionBlockVariationKeyTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockVariationKey({
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockVariationKeyTypes) {
  const { storyId } = useParams();
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
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

  const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });

  const memoizedKeys = useMemo(() => {
    const allKeys = keys?.map((k) => k.text?.toLowerCase()) || [];
    if (currentConditionName) {
      return allKeys?.filter((k) =>
        k?.includes(currentConditionName.toLowerCase())
      );
    }
    return allKeys;
  }, [currentConditionName, keys]);

  const debouncedValue = useDebounce({
    delay: 700,
    value:
      getConditionBlockById({ plotfieldCommandId, conditionBlockId })
        ?.conditionName || "",
  });

  const handleUpdatingConditionContextValue = ({
    keyId,
  }: {
    keyId: string;
  }) => {
    updateConditionBlockValueId({
      blockValueId: keyId,
      conditionBlockId,
      conditionType: "key",
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
    const existingKey = keys?.find(
      (mk) =>
        mk.text?.trim()?.toLowerCase() ===
        currentConditionName?.trim().toLowerCase()
    );

    if (existingKey) {
      setShowKeyPromptModal(false);
      setHighlightRedOnValueOnExisting(false);
      handleUpdatingConditionContextValue({
        keyId: existingKey._id,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        blockValueId: existingKey._id,
      });
    } else {
      if (onClick) {
        setShowCreateNewValueModal(true);
        console.log("Show Modal to create key");
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
    setShowModal: setShowKeyPromptModal,
    showModal: showKeyPromptModal,
  });

  return (
    <div className="relative">
      <PlotfieldInput
        type="text"
        placeholder="Ключ"
        onClick={(e) => {
          setShowKeyPromptModal((prev) => !prev);
          e.stopPropagation();
        }}
        value={
          getConditionBlockById({
            plotfieldCommandId,
            conditionBlockId,
          })?.conditionName || ""
        }
        onChange={(e) => {
          if (!showKeyPromptModal) {
            setShowKeyPromptModal(true);
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
        className={`${showKeyPromptModal ? "" : "hidden"} translate-y-[.5rem]`}
      >
        {memoizedKeys?.length ? (
          memoizedKeys.map((mk, i) => (
            <AsideScrollableButton
              key={mk + "-" + i}
              onClick={() => {
                setShowKeyPromptModal(false);
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
          ))
        ) : (
          <AsideScrollableButton
            onClick={() => {
              setShowKeyPromptModal(false);
            }}
          >
            Пусто
          </AsideScrollableButton>
        )}
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
  const createNewKeyModalRef = useRef<HTMLDivElement>(null);

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);
  const createNewKey = useCreateNewKeyAsValue({ storyId: storyId || "" });

  const handleCreatingNewKey = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueOnExisting(false);
    const keyId = generateMongoObjectId();
    createNewKey.mutate({ keyName: conditionName, keyId });
    updateConditionBlock.mutate({
      name: conditionName,
      blockValueId: keyId,
    });
  };

  useOutOfModal({
    modalRef: createNewKeyModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <AsideInformativeOrSuggestion
      ref={createNewKeyModalRef}
      className={`${showCreateNewValueModal ? "" : "hidden"}`}
    >
      <InformativeOrSuggestionText>
        Такого ключа не существует, хотите создать?
      </InformativeOrSuggestionText>
      <InformativeOrSuggestionButton
        ref={focusOnBtnRef}
        onClick={handleCreatingNewKey}
      >
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
