import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useUpdateConditionValue from "../../../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useCreateNewKeyAsValue from "../../../../../hooks/Key/useCreateNewKeyAsValue";
import useGetAllKeysByStoryId from "../../../../../hooks/Key/useGetAllKeysByStoryId";
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
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] =
    useState(false);
  const [commandKeyId, setCommandKeyId] = useState("");
  const [debouncedKeyValue, setDebouncedKeyValue] =
    useState<DebouncedCheckKeyTypes | null>(null);

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
    if (commandKeyId && currentConditionName) {
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
        blockValueId: commandKeyId,
        conditionBlockId,
        conditionType: "key",
        plotfieldCommandId,
      });
      updateConditionBlock.mutate({
        name: currentConditionName,
        type: "key",
        blockValueId: commandKeyId,
      });
    }
  }, [commandKeyId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  const updateConditionBlock = useUpdateConditionValue({
    conditionBlockId,
  });

  useEffect(() => {
    if (debouncedKeyValue && !showKeyPromptModal) {
      updateConditionBlockName({
        conditionBlockId:
          getConditionBlockById({
            conditionBlockId,
            plotfieldCommandId,
          })?.conditionBlockId || "",
        conditionName: debouncedKeyValue.keyName,
        plotfieldCommandId,
      });

      updateConditionBlockValueId({
        blockValueId: debouncedKeyValue.keyId,
        conditionBlockId,
        conditionType: "key",
        plotfieldCommandId,
      });

      setCurrentConditionName(debouncedKeyValue.keyName);
      setCommandKeyId(debouncedKeyValue.keyId);

      updateConditionBlock.mutate({
        name: debouncedKeyValue.keyName,
        type: "key",
        blockValueId: debouncedKeyValue.keyId,
      });
    }
  }, [debouncedKeyValue]);

  return (
    <div className="relative mt-[1.5rem]">
      <PlotfieldInput
        type="text"
        placeholder="Ключ"
        onClick={(e) => {
          setShowKeyPromptModal((prev) => !prev);
          e.stopPropagation();
        }}
        value={currentConditionName}
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
        className={`${highlightRedOnValueNonExisting ? "" : ""}`}
      />

      <KeyPromptsModal
        currentKeyName={currentConditionName}
        setCurrentKeyName={setCurrentConditionName}
        setShowKeyPromptModal={setShowKeyPromptModal}
        showKeyPromptModal={showKeyPromptModal}
        debouncedKey={debouncedValue}
        setDebouncedKeyValue={setDebouncedKeyValue}
        setCommandKeyId={setCommandKeyId}
      />

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
// updateConditionBlockName({
//   conditionBlockId:
//     getConditionBlockById({
//       plotfieldCommandId,
//       conditionBlockId,
//     })?.conditionBlockId || "",
//   conditionName: mk,
//   plotfieldCommandId,
// });

export type DebouncedCheckKeyTypes = {
  keyId: string;
  keyName: string;
};

type KeyPromptsModalTypes = {
  showKeyPromptModal: boolean;
  setShowKeyPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentKeyName: React.Dispatch<React.SetStateAction<string>>;
  currentKeyName: string;
  debouncedKey: string;
  setDebouncedKeyValue: React.Dispatch<
    React.SetStateAction<DebouncedCheckKeyTypes | null>
  >;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
};

export function KeyPromptsModal({
  showKeyPromptModal,
  setCurrentKeyName,
  currentKeyName,
  setShowKeyPromptModal,
  setDebouncedKeyValue,
  setCommandKeyId,
  debouncedKey,
}: KeyPromptsModalTypes) {
  const { storyId } = useParams();
  const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });

  const memoizedKeys = useMemo(() => {
    if (!keys) return [];

    if (currentKeyName) {
      return keys?.filter((k) =>
        k?.text?.toLowerCase().includes(currentKeyName?.toLowerCase())
      );
    }
    return keys;
  }, [currentKeyName, keys]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedKey?.trim().length) {
      const existingKey = memoizedKeys?.find(
        (k) => k.text?.toLowerCase() === currentKeyName?.toLowerCase()
      );
      if (existingKey) {
        setDebouncedKeyValue({
          keyId: existingKey._id,
          keyName: existingKey.text,
        });
      }
    }
  }, [debouncedKey]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowKeyPromptModal,
    showModal: showKeyPromptModal,
  });
  return (
    <AsideScrollable
      ref={modalRef}
      className={`${showKeyPromptModal ? "" : "hidden"} translate-y-[.5rem]`}
    >
      {memoizedKeys?.length ? (
        memoizedKeys.map((mk) => (
          <AsideScrollableButton
            key={mk._id}
            onClick={() => {
              setShowKeyPromptModal(false);
              setCurrentKeyName(mk.text);
              setCommandKeyId(mk._id);
            }}
          >
            {mk.text}
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
