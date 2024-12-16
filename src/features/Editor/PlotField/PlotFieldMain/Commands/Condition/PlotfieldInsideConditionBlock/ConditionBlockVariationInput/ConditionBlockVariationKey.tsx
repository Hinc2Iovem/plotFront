import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useCreateNewKeyAsValue from "../../../../../hooks/Key/useCreateNewKeyAsValue";
import useGetAllKeysByStoryId from "../../../../../hooks/Key/useGetAllKeysByStoryId";
import useConditionBlocks from "../../Context/ConditionContext";
import PlotfieldInput from "../../../../../../../../ui/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionButton from "../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import AsideScrollableButton from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionKey from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionKey";
import useGetKeyById from "../../../../../hooks/Key/useGetKeyById";
import ConditionBlockFieldName from "./shared/ConditionBlockFieldName";
import useSearch from "../../../../../../Context/Search/SearchContext";

type ConditionBlockVariationKeyTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  keyId?: string;
  conditionBlockVariationId: string;
  topologyBlockId: string;
};

export default function ConditionBlockVariationKey({
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariationId,
  keyId,
  topologyBlockId,
}: ConditionBlockVariationKeyTypes) {
  const { episodeId } = useParams();
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [commandKeyId, setCommandKeyId] = useState(keyId || "");

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const [currentConditionName, setCurrentConditionName] = useState("");
  const [backUpConditionName, setBackUpConditionName] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  useEffect(() => {
    if (commandKey) {
      setCurrentConditionName(commandKey.text);
      setBackUpConditionName(commandKey.text);
    }
  }, [commandKey]);

  useEffect(() => {
    if (keyId?.trim().length) {
      setCommandKeyId(keyId);
    }
  }, [keyId]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Condition - Key",
          id: conditionBlockVariationId,
          text: currentConditionName,
          topologyBlockId,
          type: "conditionVariation",
        },
      });
    }
  }, [episodeId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Key",
        id: conditionBlockVariationId,
        type: "conditionVariation",
        value: debouncedValue,
      });
    }
  }, [debouncedValue]);

  useEffect(() => {
    // when user deleted some part of the input for no reason and then closed propmt modal, this will restore value to the initial state
    if (backUpConditionName && !showKeyPromptModal) {
      if (backUpConditionName !== currentConditionName) {
        if (episodeId) {
          updateValue({
            episodeId,
            commandName: "Condition - Key",
            id: conditionBlockVariationId,
            type: "conditionVariation",
            value: backUpConditionName,
          });
        }
        setCurrentConditionName(backUpConditionName);
      }
    }
  }, [backUpConditionName, showKeyPromptModal]);

  return (
    <div className="relative w-full">
      <PlotfieldInput
        type="text"
        onBlur={() => {
          setCurrentlyActive(false);
        }}
        placeholder="Ключ"
        onClick={(e) => {
          e.stopPropagation();
          setShowKeyPromptModal((prev) => !prev);
          setCurrentlyActive(true);
        }}
        value={currentConditionName}
        onChange={(e) => {
          if (!showKeyPromptModal) {
            setShowKeyPromptModal(true);
          }
          setCurrentlyActive(true);
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <KeyPromptsModal
        currentKeyName={currentConditionName}
        setCurrentKeyName={setCurrentConditionName}
        setBackUpConditionName={setBackUpConditionName}
        setShowKeyPromptModal={setShowKeyPromptModal}
        showKeyPromptModal={showKeyPromptModal}
        debouncedKey={debouncedValue}
        setCommandKeyId={setCommandKeyId}
        conditionBlockVariationId={conditionBlockVariationId}
        conditionBlockId={conditionBlockId}
        plotfieldCommandId={plotfieldCommandId}
      />

      <CreateNewValueModal
        conditionName={currentConditionName}
        conditionBlockKeyId={conditionBlockVariationId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />

      <ConditionBlockFieldName currentlyActive={currentlyActive} text="Ключ" />
    </div>
  );
}

export type DebouncedCheckKeyTypes = {
  keyId: string;
  keyName: string;
};

type KeyPromptsModalTypes = {
  showKeyPromptModal: boolean;
  setShowKeyPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentKeyName: React.Dispatch<React.SetStateAction<string>>;
  setBackUpConditionName: React.Dispatch<React.SetStateAction<string>>;
  currentKeyName: string;
  debouncedKey: string;
  conditionBlockVariationId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
};

export function KeyPromptsModal({
  showKeyPromptModal,
  setCurrentKeyName,
  setBackUpConditionName,
  currentKeyName,
  setShowKeyPromptModal,
  setCommandKeyId,
  debouncedKey,
  conditionBlockVariationId,
  conditionBlockId,
  plotfieldCommandId,
}: KeyPromptsModalTypes) {
  const { storyId } = useParams();
  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const updateConditionBlock = useUpdateConditionKey({
    conditionBlockKeyId: conditionBlockVariationId || "",
  });
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
    // handle scenarios when user didn't clicked on the button and decided to just write key himself
    if (debouncedKey?.trim().length && !showKeyPromptModal) {
      const existingKey = memoizedKeys?.find((k) => k.text?.toLowerCase() === currentKeyName?.toLowerCase());
      if (existingKey) {
        handleButtonClick({ keyId: existingKey._id, text: existingKey.text });
      }
    }
  }, [debouncedKey, showKeyPromptModal]);

  const handleButtonClick = ({ keyId, text }: { keyId: string; text: string }) => {
    updateConditionBlockVariationValue({
      commandKeyId: keyId,
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId,
    });

    setCurrentKeyName(text);
    setBackUpConditionName(text);
    setCommandKeyId(keyId);

    updateConditionBlock.mutate({
      keyId: keyId,
    });
  };

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
              handleButtonClick({ keyId: mk._id, text: mk.text });
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
