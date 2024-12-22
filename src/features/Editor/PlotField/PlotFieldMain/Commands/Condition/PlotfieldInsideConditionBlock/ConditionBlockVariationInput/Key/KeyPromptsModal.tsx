import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionKey from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionKey";
import useGetAllKeysByStoryId from "../../../../../../hooks/Key/useGetAllKeysByStoryId";
import useConditionBlocks from "../../../Context/ConditionContext";
import useSearch from "../../../../../../../Context/Search/SearchContext";

export type ExposedMethodsKey = {
  updateKeyOnBlur: () => void;
};

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
  conditionBlockVariationId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  backUpConditionName: string;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
};

const KeyPromptsModal = forwardRef<ExposedMethodsKey, KeyPromptsModalTypes>(
  (
    {
      showKeyPromptModal,
      setCurrentKeyName,
      setBackUpConditionName,
      currentKeyName,
      setShowKeyPromptModal,
      setCommandKeyId,
      conditionBlockVariationId,
      conditionBlockId,
      plotfieldCommandId,
      backUpConditionName,
    },
    ref
  ) => {
    const { storyId, episodeId } = useParams();
    const { updateValue } = useSearch();
    const { updateConditionBlockVariationValue } = useConditionBlocks();
    const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });

    const updateConditionBlock = useUpdateConditionKey({
      conditionBlockKeyId: conditionBlockVariationId || "",
    });

    const memoizedKeys = useMemo(() => {
      if (!keys) return [];

      if (currentKeyName) {
        return keys?.filter((k) => k?.text?.toLowerCase().includes(currentKeyName?.toLowerCase()));
      }
      return keys;
    }, [currentKeyName, keys]);

    const modalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      updateKeyOnBlur,
    }));

    const updateValues = (value: string) => {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "Condition - Key",
          id: conditionBlockVariationId,
          type: "conditionVariation",
          value: value,
        });
      }
    };

    const updateKeyOnBlur = () => {
      const existingKey = memoizedKeys?.find((k) => k.text?.toLowerCase() === currentKeyName?.toLowerCase());
      if (existingKey) {
        handleButtonClick({ keyId: existingKey._id, text: existingKey.text });
      } else {
        updateValues(backUpConditionName);
        setCurrentKeyName(backUpConditionName);
      }
    };

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
);

KeyPromptsModal.displayName = "KeyPromptsModal";

export default KeyPromptsModal;
