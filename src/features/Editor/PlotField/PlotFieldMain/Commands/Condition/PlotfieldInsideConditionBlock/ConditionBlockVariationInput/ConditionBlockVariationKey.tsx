import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useCreateNewKeyAsValue from "../../../../../hooks/Key/useCreateNewKeyAsValue";
import useGetAllKeysByStoryId from "../../../../../hooks/Key/useGetAllKeysByStoryId";
import useConditionBlocks from "../../Context/ConditionContext";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionKey from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionKey";
import useGetKeyById from "../../../../../hooks/Key/useGetKeyById";

type ConditionBlockVariationKeyTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  conditionBlockKeyId: string;
  keyId?: string;
  conditionBlockVariationId: string;
};

export default function ConditionBlockVariationKey({
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariationId,
  keyId,
}: ConditionBlockVariationKeyTypes) {
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [commandKeyId, setCommandKeyId] = useState(keyId || "");
  const [debouncedKeyValue, setDebouncedKeyValue] = useState<DebouncedCheckKeyTypes | null>(null);

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const [currentConditionName, setCurrentConditionName] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  const updateConditionBlock = useUpdateConditionKey({
    conditionBlockKeyId: conditionBlockVariationId || "",
  });

  useEffect(() => {
    if (commandKey) {
      setCurrentConditionName(commandKey.text);
    }
  }, [commandKey]);

  useEffect(() => {
    if (commandKeyId && currentConditionName) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        commandKeyId,
      });

      updateConditionBlock.mutate({
        keyId: commandKeyId,
      });
    }
  }, [commandKeyId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  useEffect(() => {
    if (debouncedKeyValue && !showKeyPromptModal) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        commandKeyId,
      });

      setCurrentConditionName(debouncedKeyValue.keyName);
      setCommandKeyId(debouncedKeyValue.keyId);

      updateConditionBlock.mutate({
        keyId: debouncedKeyValue.keyId,
      });
    }
  }, [debouncedKeyValue]);

  return (
    <div className="relative">
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
        conditionBlockKeyId={conditionBlockVariationId}
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
  setDebouncedKeyValue: React.Dispatch<React.SetStateAction<DebouncedCheckKeyTypes | null>>;
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
      return keys?.filter((k) => k?.text?.toLowerCase().includes(currentKeyName?.toLowerCase()));
    }
    return keys;
  }, [currentKeyName, keys]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedKey?.trim().length) {
      const existingKey = memoizedKeys?.find((k) => k.text?.toLowerCase() === currentKeyName?.toLowerCase());
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
    <AsideScrollable ref={modalRef} className={`${showKeyPromptModal ? "" : "hidden"} translate-y-[.5rem]`}>
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
  conditionBlockKeyId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateNewValueModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockKeyId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewKeyModalRef = useRef<HTMLDivElement>(null);

  const updateConditionBlock = useUpdateConditionKey({
    conditionBlockKeyId,
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
      keyId,
    });
  };

  useOutOfModal({
    modalRef: createNewKeyModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <AsideInformativeOrSuggestion ref={createNewKeyModalRef} className={`${showCreateNewValueModal ? "" : "hidden"}`}>
      <InformativeOrSuggestionText>Такого ключа не существует, хотите создать?</InformativeOrSuggestionText>
      <InformativeOrSuggestionButton ref={focusOnBtnRef} onClick={handleCreatingNewKey}>
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
