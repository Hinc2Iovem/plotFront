import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useCreateNewKeyAsValue from "../../../../../hooks/Key/useCreateNewKeyAsValue";
import useGetAllKeysByStoryId from "../../../../../hooks/Key/useGetAllKeysByStoryId";
import useIfVariations from "../../Context/IfContext";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideInformativeOrSuggestion from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionButton from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";
import InformativeOrSuggestionText from "../../../../../../../shared/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateIfKey from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfKey";
import useGetKeyById from "../../../../../hooks/Key/useGetKeyById";
import IfFieldName from "./shared/IfFieldName";
import useSearch from "../../../../../../Context/Search/SearchContext";

type IfVariationKeyTypes = {
  plotfieldCommandId: string;
  keyId?: string;
  ifVariationId: string;
  topologyBlockId: string;
};

export default function IfVariationKey({
  plotfieldCommandId,
  ifVariationId,
  keyId,
  topologyBlockId,
}: IfVariationKeyTypes) {
  const { episodeId } = useParams();
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [commandKeyId, setCommandKeyId] = useState(keyId || "");

  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const [currentIfName, setCurrentIfName] = useState("");
  const [backUpIfName, setBackUpIfName] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  useEffect(() => {
    if (commandKey) {
      setCurrentIfName(commandKey.text);
      setBackUpIfName(commandKey.text);
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
          commandName: "If - Key",
          id: ifVariationId,
          text: currentIfName,
          topologyBlockId,
          type: "ifVariation",
        },
      });
    }
  }, [episodeId]);

  const debouncedValue = useDebounce({
    delay: 700,
    value: currentIfName,
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Key",
        id: ifVariationId,
        type: "ifVariation",
        value: debouncedValue,
      });
    }
  }, [debouncedValue]);

  useEffect(() => {
    // when user deleted some part of the input for no reason and then closed propmt modal, this will restore value to the initial state
    if (backUpIfName && !showKeyPromptModal) {
      if (backUpIfName !== currentIfName) {
        if (episodeId) {
          updateValue({
            episodeId,
            commandName: "If - Key",
            id: ifVariationId,
            type: "ifVariation",
            value: backUpIfName,
          });
        }
        setCurrentIfName(backUpIfName);
      }
    }
  }, [backUpIfName, showKeyPromptModal]);

  return (
    <div className="relative w-full">
      <PlotfieldInput
        type="text"
        focusedSecondTime={focusedSecondTime}
        onBlur={() => {
          setFocusedSecondTime(false);
          setCurrentlyActive(false);
        }}
        setFocusedSecondTime={setFocusedSecondTime}
        placeholder="Ключ"
        onClick={(e) => {
          e.stopPropagation();
          setShowKeyPromptModal((prev) => !prev);
          setCurrentlyActive(true);
        }}
        value={currentIfName}
        onChange={(e) => {
          if (!showKeyPromptModal) {
            setShowKeyPromptModal(true);
          }
          setCurrentlyActive(true);
          setHighlightRedOnValueOnExisting(false);
          setCurrentIfName(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <KeyPromptsModal
        currentKeyName={currentIfName}
        setCurrentKeyName={setCurrentIfName}
        setBackUpIfName={setBackUpIfName}
        setShowKeyPromptModal={setShowKeyPromptModal}
        showKeyPromptModal={showKeyPromptModal}
        debouncedKey={debouncedValue}
        setCommandKeyId={setCommandKeyId}
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
      />

      <CreateNewValueModal
        ifName={currentIfName}
        ifKeyId={ifVariationId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />

      <IfFieldName currentlyActive={currentlyActive} text="Ключ" />
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
  setBackUpIfName: React.Dispatch<React.SetStateAction<string>>;
  currentKeyName: string;
  debouncedKey: string;
  ifVariationId: string;
  plotfieldCommandId: string;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
};

export function KeyPromptsModal({
  showKeyPromptModal,
  setCurrentKeyName,
  setBackUpIfName,
  currentKeyName,
  setShowKeyPromptModal,
  setCommandKeyId,
  debouncedKey,
  ifVariationId,
  plotfieldCommandId,
}: KeyPromptsModalTypes) {
  const { storyId } = useParams();
  const { updateIfVariationValue } = useIfVariations();

  const updateIf = useUpdateIfKey({
    ifKeyId: ifVariationId || "",
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
    updateIfVariationValue({
      commandKeyId: keyId,
      plotfieldCommandId,
      ifVariationId,
    });

    setCurrentKeyName(text);
    setBackUpIfName(text);
    setCommandKeyId(keyId);

    updateIf.mutate({
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
  ifName: string;
  ifKeyId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateNewValueModal({
  setHighlightRedOnValueOnExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  ifName,
  ifKeyId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewKeyModalRef = useRef<HTMLDivElement>(null);

  const updateIf = useUpdateIfKey({
    ifKeyId,
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
    createNewKey.mutate({ keyName: ifName, keyId });
    updateIf.mutate({
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
